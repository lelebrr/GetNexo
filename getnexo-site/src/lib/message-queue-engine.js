/**
 * Message Queue Engine (RabbitMQ/Kafka-style)
 * Simula sistema de filas de mensagens com exchanges, queues e bindings
 */
class MessageQueueEngine {
    constructor() {
        this.queues = new Map(); // Fila: nome -> mensagens
        this.exchanges = new Map(); // Exchange: nome -> tipo e bindings
        this.consumers = new Map(); // Consumer: queue -> handlers
        this.messagesInFlight = new Map(); // Mensagens sendo processadas
        this.dlq = new Map(); // Dead Letter Queue
    }

    /**
     * Cria uma fila
     */
    createQueue(queueName, options = {}) {
        if (!this.queues.has(queueName)) {
            this.queues.set(queueName, {
                messages: [],
                options: {
                    durable: options.durable || false,
                    maxLength: options.maxLength || Infinity,
                    ttl: options.ttl || null,
                    ...options
                }
            });
        }
        return this.queues.get(queueName);
    }

    /**
     * Cria um exchange
     */
    createExchange(exchangeName, type = 'direct', options = {}) {
        this.exchanges.set(exchangeName, {
            type,
            bindings: [],
            options: { durable: options.durable || false, ...options }
        });
    }

    /**
     * Faz binding entre exchange e queue
     */
    bindQueue(exchangeName, queueName, routingKey = '') {
        const exchange = this.exchanges.get(exchangeName);
        if (exchange) {
            exchange.bindings.push({ queue: queueName, routingKey });
        }
    }

    /**
     * Publica mensagem em um exchange
     */
    publish(exchangeName, routingKey, message, options = {}) {
        const exchange = this.exchanges.get(exchangeName);
        if (!exchange) return false;

        const envelope = {
            messageId: this.generateMessageId(),
            timestamp: new Date().toISOString(),
            routingKey,
            payload: message,
            headers: options.headers || {},
            persistent: options.persistent || false,
            priority: options.priority || 0
        };

        // Roteia para filas baseadas no tipo de exchange
        const matchedQueues = this.routeMessage(exchange, routingKey);

        for (const queueName of matchedQueues) {
            const queue = this.queues.get(queueName);
            if (queue) {
                if (queue.messages.length < queue.options.maxLength) {
                    queue.messages.push(envelope);
                    this.notifyConsumers(queueName);
                } else {
                    // Move para DLQ se cheio
                    this.moveToDLQ(queueName, envelope);
                }
            }
        }

        return true;
    }

    /**
     * Consome mensagem diretamente de uma fila
     */
    consume(queueName, handler, options = {}) {
        if (!this.consumers.has(queueName)) {
            this.consumers.set(queueName, []);
        }
        this.consumers.get(queueName).push({ handler, options });

        // Processa mensagens existentes
        this.notifyConsumers(queueName);
    }

    /**
     * Notifica consumidores de uma fila
     */
    async notifyConsumers(queueName) {
        const queue = this.queues.get(queueName);
        const consumers = this.consumers.get(queueName) || [];

        if (!queue || !consumers.length) return;

        while (queue.messages.length > 0 && consumers.length > 0) {
            const message = queue.messages.shift();
            const consumer = consumers[Math.floor(Math.random() * consumers.length)]; // Round-robin simples

            try {
                // Marca como in-flight
                this.messagesInFlight.set(message.messageId, { message, consumer, queueName });

                await consumer.handler(message);

                // Remove de in-flight se sucesso
                this.messagesInFlight.delete(message.messageId);

            } catch (error) {
                console.error(`Error processing message ${message.messageId}:`, error);

                // Retry logic
                if (consumer.options.retryCount < (consumer.options.maxRetries || 3)) {
                    consumer.options.retryCount = (consumer.options.retryCount || 0) + 1;
                    queue.messages.unshift(message); // Reinsere na frente
                } else {
                    this.moveToDLQ(queueName, message);
                }

                this.messagesInFlight.delete(message.messageId);
            }
        }
    }

    /**
     * Roteia mensagem baseada no tipo de exchange
     */
    routeMessage(exchange, routingKey) {
        const matchedQueues = [];

        for (const binding of exchange.bindings) {
            let matches = false;

            switch (exchange.type) {
                case 'direct':
                    matches = binding.routingKey === routingKey;
                    break;
                case 'topic':
                    matches = this.matchTopic(routingKey, binding.routingKey);
                    break;
                case 'headers':
                    // Implementação simplificada
                    matches = true;
                    break;
                case 'fanout':
                    matches = true;
                    break;
            }

            if (matches) {
                matchedQueues.push(binding.queue);
            }
        }

        return matchedQueues;
    }

    /**
     * Match topic routing (simplificado)
     */
    matchTopic(routingKey, bindingKey) {
        const routingParts = routingKey.split('.');
        const bindingParts = bindingKey.split('.');

        for (let i = 0; i < bindingParts.length; i++) {
            if (bindingParts[i] === '#') return true;
            if (bindingParts[i] === '*') continue;
            if (bindingParts[i] !== routingParts[i]) return false;
        }

        return routingParts.length === bindingParts.length;
    }

    /**
     * Move mensagem para Dead Letter Queue
     */
    moveToDLQ(queueName, message) {
        if (!this.dlq.has(queueName)) {
            this.dlq.set(queueName, []);
        }
        this.dlq.get(queueName).push({
            ...message,
            deadLetterReason: 'max retries exceeded or queue full'
        });
    }

    /**
     * Gera ID único para mensagem
     */
    generateMessageId() {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Estatísticas das filas
     */
    getQueueStats() {
        const stats = {};
        for (const [name, queue] of this.queues) {
            stats[name] = {
                messageCount: queue.messages.length,
                consumerCount: this.consumers.get(name)?.length || 0
            };
        }
        return stats;
    }

    /**
     * Limpa filas (para testes)
     */
    purgeQueue(queueName) {
        const queue = this.queues.get(queueName);
        if (queue) {
            queue.messages = [];
            return true;
        }
        return false;
    }

    /**
     * Estatísticas gerais
     */
    getStats() {
        return {
            queues: this.queues.size,
            exchanges: this.exchanges.size,
            totalMessages: Array.from(this.queues.values()).reduce((sum, q) => sum + q.messages.length, 0),
            messagesInFlight: this.messagesInFlight.size,
            dlqMessages: Array.from(this.dlq.values()).reduce((sum, dlq) => sum + dlq.length, 0)
        };
    }
}

// Singleton instance
const messageQueueEngine = new MessageQueueEngine();

module.exports = messageQueueEngine;