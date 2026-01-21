/**
 * Event-Driven Architecture Engine com Event Sourcing
 * Simula uma arquitetura orientada a eventos com armazenamento de eventos
 */
class EventDrivenEngine {
    constructor() {
        this.eventStore = []; // Armazenamento simples de eventos
        this.eventHandlers = new Map(); // Mapeamento de tipos de eventos para handlers
        this.eventStreams = new Map(); // Streams por aggregateId
        this.snapshots = new Map(); // Snapshots para otimização
    }

    /**
     * Publica um evento no sistema
     */
    async publishEvent(event) {
        // Adiciona timestamp e sequence number
        const enrichedEvent = {
            ...event,
            timestamp: new Date().toISOString(),
            sequenceNumber: this.eventStore.length + 1,
            eventId: this.generateEventId()
        };

        // Armazena no event store
        this.eventStore.push(enrichedEvent);

        // Adiciona ao stream do aggregate
        if (!this.eventStreams.has(event.aggregateId)) {
            this.eventStreams.set(event.aggregateId, []);
        }
        this.eventStreams.get(event.aggregateId).push(enrichedEvent);

        // Notifica handlers registrados
        await this.notifyHandlers(enrichedEvent);

        return enrichedEvent;
    }

    /**
     * Registra um handler para um tipo de evento
     */
    registerHandler(eventType, handler) {
        if (!this.eventHandlers.has(eventType)) {
            this.eventHandlers.set(eventType, []);
        }
        this.eventHandlers.get(eventType).push(handler);
    }

    /**
     * Notifica todos os handlers para um evento
     */
    async notifyHandlers(event) {
        const handlers = this.eventHandlers.get(event.type) || [];
        for (const handler of handlers) {
            try {
                await handler(event);
            } catch (error) {
                console.error(`Error in event handler for ${event.type}:`, error);
            }
        }
    }

    /**
     * Carrega eventos para um aggregate específico
     */
    loadEvents(aggregateId, fromSequence = 0) {
        const stream = this.eventStreams.get(aggregateId) || [];
        return stream.filter(event => event.sequenceNumber > fromSequence);
    }

    /**
     * Recria o estado de um aggregate aplicando eventos
     */
    rebuildAggregate(aggregateId, aggregate) {
        const events = this.loadEvents(aggregateId);
        let state = {};

        for (const event of events) {
            state = this.applyEvent(state, event);
        }

        return state;
    }

    /**
     * Aplica um evento ao estado
     */
    applyEvent(state, event) {
        // Implementação básica - em produção seria mais complexa
        return { ...state, ...event.data, lastEvent: event.type };
    }

    /**
     * Cria snapshot para otimização
     */
    createSnapshot(aggregateId) {
        const state = this.rebuildAggregate(aggregateId);
        this.snapshots.set(aggregateId, {
            state,
            lastSequence: this.eventStreams.get(aggregateId)?.length || 0,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Carrega snapshot se disponível
     */
    loadSnapshot(aggregateId) {
        return this.snapshots.get(aggregateId);
    }

    /**
     * Gera ID único para evento
     */
    generateEventId() {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Busca eventos por critérios
     */
    queryEvents(criteria) {
        return this.eventStore.filter(event => {
            for (const [key, value] of Object.entries(criteria)) {
                if (event[key] !== value) return false;
            }
            return true;
        });
    }

    /**
     * Estatísticas do engine
     */
    getStats() {
        return {
            totalEvents: this.eventStore.length,
            totalAggregates: this.eventStreams.size,
            totalSnapshots: this.snapshots.size,
            eventsByType: this.eventStore.reduce((acc, event) => {
                acc[event.type] = (acc[event.type] || 0) + 1;
                return acc;
            }, {})
        };
    }
}

// Singleton instance
const eventDrivenEngine = new EventDrivenEngine();

module.exports = eventDrivenEngine;