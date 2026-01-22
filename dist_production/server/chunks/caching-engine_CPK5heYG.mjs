class CachingEngine {
  constructor() {
    this.layers = /* @__PURE__ */ new Map();
    this.strategies = /* @__PURE__ */ new Map();
    this.invalidationRules = /* @__PURE__ */ new Map();
    this.stats = /* @__PURE__ */ new Map();
  }
  /**
   * Cria camada de cache
   */
  createCacheLayer(layerName, config = {}) {
    const layer = {
      name: layerName,
      type: config.type || "memory",
      // memory, redis, memcached
      data: /* @__PURE__ */ new Map(),
      ttl: config.ttl || 3e5,
      // 5min default
      maxSize: config.maxSize || 1e3,
      strategy: config.strategy || "lru",
      // lru, lfu, fifo
      stats: {
        hits: 0,
        misses: 0,
        sets: 0,
        deletes: 0,
        evictions: 0
      },
      accessOrder: [],
      // Para LRU
      accessCount: /* @__PURE__ */ new Map()
      // Para LFU
    };
    if (layer.type === "redis") {
      layer.client = config.client;
    } else if (layer.type === "memcached") {
      layer.client = config.client;
    }
    this.layers.set(layerName, layer);
    this.stats.set(layerName, layer.stats);
    return layer;
  }
  /**
   * Define estratégia de cache
   */
  setCacheStrategy(cacheKey, strategy) {
    this.strategies.set(cacheKey, strategy);
  }
  /**
   * Obtém valor do cache (multi-layer)
   */
  async get(key, layers = []) {
    for (const layerName of layers) {
      const layer = this.layers.get(layerName);
      if (!layer) continue;
      try {
        const value = await this.getFromLayer(layer, key);
        if (value !== null) {
          layer.stats.hits++;
          if (layer.strategy === "lru") {
            this.updateLRU(layer, key);
          }
          if (layer.strategy === "lfu") {
            this.updateLFU(layer, key);
          }
          await this.promoteToUpperLayers(key, value, layers, layerName);
          return value;
        }
      } catch (error) {
      }
    }
    this.recordMiss(layers);
    return null;
  }
  /**
   * Define valor no cache (multi-layer)
   */
  async set(key, value, options = {}) {
    const { layers = [], ttl, tags = [] } = options;
    for (const layerName of layers) {
      const layer = this.layers.get(layerName);
      if (!layer) continue;
      try {
        const item = {
          value,
          timestamp: Date.now(),
          ttl: ttl || layer.ttl,
          tags,
          accessCount: 1,
          lastAccess: Date.now()
        };
        await this.setInLayer(layer, key, item);
        layer.stats.sets++;
        await this.enforceMaxSize(layer);
      } catch (error) {
      }
    }
  }
  /**
   * Remove valor do cache
   */
  async delete(key, layers = []) {
    for (const layerName of layers) {
      const layer = this.layers.get(layerName);
      if (!layer) continue;
      try {
        await this.deleteFromLayer(layer, key);
        layer.stats.deletes++;
      } catch (error) {
      }
    }
  }
  /**
   * Invalida cache por tags
   */
  async invalidateByTags(tags, layers = []) {
    const keysToDelete = /* @__PURE__ */ new Set();
    for (const layerName of layers) {
      const layer = this.layers.get(layerName);
      if (!layer) continue;
      for (const [key, item] of layer.data) {
        if (item.tags && tags.some((tag) => item.tags.includes(tag))) {
          keysToDelete.add(key);
        }
      }
    }
    for (const key of keysToDelete) {
      await this.delete(key, layers);
    }
    return keysToDelete.size;
  }
  /**
   * Invalida cache por padrão
   */
  async invalidateByPattern(pattern, layers = []) {
    const regex = new RegExp(pattern);
    for (const layerName of layers) {
      const layer = this.layers.get(layerName);
      if (!layer) continue;
      const keysToDelete = [];
      for (const key of layer.data.keys()) {
        if (regex.test(key)) {
          keysToDelete.push(key);
        }
      }
      for (const key of keysToDelete) {
        await this.deleteFromLayer(layer, key);
        layer.stats.deletes++;
      }
    }
  }
  /**
   * Obtém valor de uma camada específica
   */
  async getFromLayer(layer, key) {
    let item = null;
    switch (layer.type) {
      case "memory":
        item = layer.data.get(key);
        break;
      case "redis":
        if (layer.client) {
          const data = await layer.client.get(key);
          item = data ? JSON.parse(data) : null;
        }
        break;
      case "memcached":
        if (layer.client) {
          item = await new Promise((resolve) => {
            layer.client.get(key, (err, data) => {
              resolve(err ? null : JSON.parse(data));
            });
          });
        }
        break;
    }
    if (item && Date.now() - item.timestamp > item.ttl) {
      await this.deleteFromLayer(layer, key);
      return null;
    }
    return item ? item.value : null;
  }
  /**
   * Define valor em uma camada específica
   */
  async setInLayer(layer, key, item) {
    switch (layer.type) {
      case "memory":
        layer.data.set(key, item);
        break;
      case "redis":
        if (layer.client) {
          await layer.client.setex(key, Math.ceil(item.ttl / 1e3), JSON.stringify(item));
        }
        break;
      case "memcached":
        if (layer.client) {
          await new Promise((resolve, reject) => {
            layer.client.set(key, JSON.stringify(item), Math.ceil(item.ttl / 1e3), (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }
        break;
    }
  }
  /**
   * Remove valor de uma camada específica
   */
  async deleteFromLayer(layer, key) {
    switch (layer.type) {
      case "memory":
        layer.data.delete(key);
        break;
      case "redis":
        if (layer.client) {
          await layer.client.del(key);
        }
        break;
      case "memcached":
        if (layer.client) {
          await new Promise((resolve) => {
            layer.client.delete(key, () => resolve());
          });
        }
        break;
    }
  }
  /**
   * Atualiza LRU
   */
  updateLRU(layer, key) {
    const index = layer.accessOrder.indexOf(key);
    if (index > -1) {
      layer.accessOrder.splice(index, 1);
    }
    layer.accessOrder.push(key);
  }
  /**
   * Atualiza LFU
   */
  updateLFU(layer, key) {
    layer.accessCount.set(key, (layer.accessCount.get(key) || 0) + 1);
  }
  /**
   * Aplica estratégia de eviction
   */
  async enforceMaxSize(layer) {
    while (layer.data.size > layer.maxSize) {
      let keyToEvict = null;
      switch (layer.strategy) {
        case "lru":
          keyToEvict = layer.accessOrder.shift();
          break;
        case "lfu":
          let minCount = Infinity;
          for (const [key, count] of layer.accessCount) {
            if (count < minCount) {
              minCount = count;
              keyToEvict = key;
            }
          }
          break;
        case "fifo":
          keyToEvict = layer.data.keys().next().value;
          break;
      }
      if (keyToEvict) {
        await this.deleteFromLayer(layer, keyToEvict);
        layer.stats.evictions++;
      }
    }
  }
  /**
   * Promove valor para camadas superiores
   */
  async promoteToUpperLayers(key, value, layers, currentLayer) {
    const currentIndex = layers.indexOf(currentLayer);
    if (currentIndex > 0) {
      const upperLayers = layers.slice(0, currentIndex);
      await this.set(key, value, { layers: upperLayers });
    }
  }
  /**
   * Registra cache miss
   */
  recordMiss(layers) {
    for (const layerName of layers) {
      const layer = this.layers.get(layerName);
      if (layer) {
        layer.stats.misses++;
      }
    }
  }
  /**
   * Limpa cache
   */
  async clear(layers = []) {
    for (const layerName of layers) {
      const layer = this.layers.get(layerName);
      if (!layer) continue;
      try {
        if (layer.type === "memory") {
          layer.data.clear();
          layer.accessOrder = [];
          layer.accessCount.clear();
        } else if (layer.client && layer.client.flushall) {
          await layer.client.flushall();
        }
      } catch (error) {
      }
    }
  }
  /**
   * Obtém estatísticas de uma camada
   */
  getLayerStats(layerName) {
    const layer = this.layers.get(layerName);
    if (!layer) return null;
    const hitRate = layer.stats.hits + layer.stats.misses > 0 ? layer.stats.hits / (layer.stats.hits + layer.stats.misses) * 100 : 0;
    return {
      ...layer.stats,
      hitRate,
      size: layer.data.size,
      type: layer.type,
      strategy: layer.strategy
    };
  }
  /**
   * Lista camadas de cache
   */
  listLayers() {
    return Array.from(this.layers.keys());
  }
  /**
   * Estatísticas gerais
   */
  getStats() {
    const layers = Array.from(this.layers.values());
    const totalHits = layers.reduce((sum, l) => sum + l.stats.hits, 0);
    const totalMisses = layers.reduce((sum, l) => sum + l.stats.misses, 0);
    const totalSets = layers.reduce((sum, l) => sum + l.stats.sets, 0);
    return {
      layers: layers.length,
      totalHits,
      totalMisses,
      totalSets,
      overallHitRate: totalHits + totalMisses > 0 ? totalHits / (totalHits + totalMisses) * 100 : 0,
      totalEvictions: layers.reduce((sum, l) => sum + l.stats.evictions, 0)
    };
  }
}
const cachingEngine = new CachingEngine();
export {
  CachingEngine as C,
  cachingEngine as c
};
