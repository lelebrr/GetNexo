/**
 * CQRS (Command Query Responsibility Segregation) Engine
 * Separa responsabilidades de comando (write) e consulta (read)
 */
class CQRSEngine {
    constructor() {
        this.commandHandlers = new Map(); // Tipo de comando -> handler
        this.queryHandlers = new Map(); // Tipo de query -> handler
        this.readModels = new Map(); // Read models otimizados para consultas
        this.eventHandlers = new Map(); // Event handlers para projeções
        this.commandQueue = []; // Fila de comandos pendentes
        this.processingCommands = false;
    }

    /**
     * Registra handler para comando
     */
    registerCommandHandler(commandType, handler) {
        this.commandHandlers.set(commandType, handler);
    }

    /**
     * Registra handler para query
     */
    registerQueryHandler(queryType, handler) {
        this.queryHandlers.set(queryType, handler);
    }

    /**
     * Registra event handler para projeções
     */
    registerEventHandler(eventType, handler) {
        if (!this.eventHandlers.has(eventType)) {
            this.eventHandlers.set(eventType, []);
        }
        this.eventHandlers.get(eventType).push(handler);
    }

    /**
     * Executa um comando (write side)
     */
    async executeCommand(command) {
        const enrichedCommand = {
            ...command,
            commandId: this.generateCommandId(),
            timestamp: new Date().toISOString(),
            expectedVersion: command.expectedVersion || 0
        };

        // Adiciona à fila de comandos
        this.commandQueue.push(enrichedCommand);

        // Processa fila se não estiver processando
        if (!this.processingCommands) {
            await this.processCommandQueue();
        }

        return enrichedCommand.commandId;
    }

    /**
     * Processa fila de comandos
     */
    async processCommandQueue() {
        if (this.processingCommands || this.commandQueue.length === 0) return;

        this.processingCommands = true;

        while (this.commandQueue.length > 0) {
            const command = this.commandQueue.shift();
            const handler = this.commandHandlers.get(command.type);

            if (handler) {
                try {
                    // Executa comando e gera eventos
                    const events = await handler(command);

                    // Publica eventos para atualizar read models
                    if (events && events.length > 0) {
                        for (const event of events) {
                            await this.publishEvent(event);
                        }
                    }

                } catch (error) {
                    console.error(`Error executing command ${command.type}:`, error);
                    // Em produção, poderia ter retry logic ou dead letter
                }
            }
        }

        this.processingCommands = false;
    }

    /**
     * Executa uma query (read side)
     */
    async executeQuery(query) {
        const handler = this.queryHandlers.get(query.type);

        if (!handler) {
            throw new Error(`No handler registered for query type: ${query.type}`);
        }

        // Queries são otimizadas e não alteram estado
        return await handler(query);
    }

    /**
     * Publica evento para atualizar projeções
     */
    async publishEvent(event) {
        const enrichedEvent = {
            ...event,
            eventId: this.generateEventId(),
            timestamp: new Date().toISOString()
        };

        // Notifica event handlers (projeções)
        const handlers = this.eventHandlers.get(event.type) || [];
        for (const handler of handlers) {
            try {
                await handler(enrichedEvent);
            } catch (error) {
                console.error(`Error in event handler for ${event.type}:`, error);
            }
        }
    }

    /**
     * Atualiza read model
     */
    updateReadModel(modelName, data) {
        this.readModels.set(modelName, {
            ...this.readModels.get(modelName),
            ...data,
            lastUpdated: new Date().toISOString()
        });
    }

    /**
     * Obtém read model
     */
    getReadModel(modelName) {
        return this.readModels.get(modelName) || null;
    }

    /**
     * Cria projeção baseada em eventos
     */
    createProjection(projectionName, eventTypes, projectionFunction) {
        const handler = async (event) => {
            if (eventTypes.includes(event.type)) {
                const currentProjection = this.readModels.get(projectionName) || {};
                const newProjection = await projectionFunction(currentProjection, event);
                this.updateReadModel(projectionName, newProjection);
            }
        };

        // Registra handler para todos os event types relevantes
        for (const eventType of eventTypes) {
            this.registerEventHandler(eventType, handler);
        }
    }

    /**
     * Saga para coordenação complexa
     */
    createSaga(sagaName, startCommand, steps) {
        const saga = {
            id: this.generateSagaId(),
            name: sagaName,
            state: 'pending',
            steps: steps,
            currentStep: 0,
            compensations: []
        };

        // Handler para o comando inicial
        this.registerCommandHandler(startCommand, async (command) => {
            const events = [];
            saga.state = 'running';

            try {
                // Executa passos da saga
                for (let i = 0; i < steps.length; i++) {
                    saga.currentStep = i;
                    const step = steps[i];

                    // Simula execução do passo
                    const result = await step.execute(command);
                    events.push(...result.events);

                    // Registra compensação
                    if (step.compensate) {
                        saga.compensations.push(step.compensate);
                    }
                }

                saga.state = 'completed';
                events.push({ type: `${sagaName}Completed`, sagaId: saga.id });

            } catch (error) {
                // Executa compensações em caso de falha
                await this.compensateSaga(saga);
                saga.state = 'failed';
                events.push({ type: `${sagaName}Failed`, sagaId: saga.id, error: error.message });
            }

            return events;
        });

        return saga;
    }

    /**
     * Executa compensações da saga
     */
    async compensateSaga(saga) {
        for (const compensation of saga.compensations.reverse()) {
            try {
                await compensation();
            } catch (error) {
                console.error('Error in saga compensation:', error);
            }
        }
    }

    /**
     * Gera ID único para comando
     */
    generateCommandId() {
        return `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Gera ID único para evento
     */
    generateEventId() {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Gera ID único para saga
     */
    generateSagaId() {
        return `saga_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Estatísticas do engine
     */
    getStats() {
        return {
            commandHandlers: this.commandHandlers.size,
            queryHandlers: this.queryHandlers.size,
            eventHandlers: Array.from(this.eventHandlers.values()).reduce((sum, handlers) => sum + handlers.length, 0),
            readModels: this.readModels.size,
            pendingCommands: this.commandQueue.length,
            processingCommands: this.processingCommands
        };
    }
}

// Singleton instance
const cqrsEngine = new CQRSEngine();

module.exports = cqrsEngine;