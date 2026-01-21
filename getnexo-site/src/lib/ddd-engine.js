/**
 * Domain-Driven Design Engine com Bounded Contexts
 * Implementa conceitos de DDD: bounded contexts, aggregates, entities, value objects
 */
class DDDEngine {
    constructor() {
        this.boundedContexts = new Map(); // Contextos delimitados
        this.aggregates = new Map(); // Aggregates por contexto
        this.repositories = new Map(); // Repositories por aggregate
        this.domainServices = new Map(); // Serviços de domínio
        this.domainEvents = new Map(); // Eventos de domínio
        this.factories = new Map(); // Factories para criação de objetos
    }

    /**
     * Cria um bounded context
     */
    createBoundedContext(contextName, options = {}) {
        const context = {
            name: contextName,
            aggregates: [],
            domainServices: [],
            repositories: [],
            ubiquitousLanguage: new Map(), // Linguagem ubíqua
            options: {
                eventStorming: options.eventStorming || false,
                ...options
            }
        };

        this.boundedContexts.set(contextName, context);
        return context;
    }

    /**
     * Define aggregate em um bounded context
     */
    defineAggregate(contextName, aggregateName, aggregateClass) {
        const context = this.boundedContexts.get(contextName);
        if (!context) throw new Error(`Bounded context ${contextName} not found`);

        const aggregate = {
            name: aggregateName,
            class: aggregateClass,
            entities: [],
            valueObjects: [],
            domainEvents: [],
            invariants: []
        };

        this.aggregates.set(`${contextName}.${aggregateName}`, aggregate);
        context.aggregates.push(aggregateName);

        return aggregate;
    }

    /**
     * Cria repository para aggregate
     */
    createRepository(contextName, aggregateName, repositoryImpl) {
        const key = `${contextName}.${aggregateName}`;
        this.repositories.set(key, repositoryImpl);

        const context = this.boundedContexts.get(contextName);
        if (context) {
            context.repositories.push(aggregateName);
        }

        return repositoryImpl;
    }

    /**
     * Registra serviço de domínio
     */
    registerDomainService(contextName, serviceName, serviceImpl) {
        const key = `${contextName}.${serviceName}`;
        this.domainServices.set(key, serviceImpl);

        const context = this.boundedContexts.get(contextName);
        if (context) {
            context.domainServices.push(serviceName);
        }

        return serviceImpl;
    }

    /**
     * Define entidade dentro de um aggregate
     */
    defineEntity(aggregateKey, entityName, entityClass) {
        const aggregate = this.aggregates.get(aggregateKey);
        if (!aggregate) throw new Error(`Aggregate ${aggregateKey} not found`);

        aggregate.entities.push({
            name: entityName,
            class: entityClass
        });
    }

    /**
     * Define value object
     */
    defineValueObject(aggregateKey, voName, voClass) {
        const aggregate = this.aggregates.get(aggregateKey);
        if (!aggregate) throw new Error(`Aggregate ${aggregateKey} not found`);

        aggregate.valueObjects.push({
            name: voName,
            class: voClass
        });
    }

    /**
     * Adiciona invariante de negócio ao aggregate
     */
    addInvariant(aggregateKey, invariantName, invariantFunction) {
        const aggregate = this.aggregates.get(aggregateKey);
        if (!aggregate) throw new Error(`Aggregate ${aggregateKey} not found`);

        aggregate.invariants.push({
            name: invariantName,
            check: invariantFunction
        });
    }

    /**
     * Executa comandos de domínio
     */
    async executeDomainCommand(contextName, aggregateName, command) {
        const aggregateKey = `${contextName}.${aggregateName}`;
        const aggregate = this.aggregates.get(aggregateKey);
        const repository = this.repositories.get(aggregateKey);

        if (!aggregate || !repository) {
            throw new Error(`Aggregate or repository not found for ${aggregateKey}`);
        }

        try {
            // Carrega aggregate do repository
            const aggregateInstance = await repository.load(command.aggregateId);

            // Executa comando
            const result = await aggregateInstance.executeCommand(command);

            // Verifica invariantes
            this.checkInvariants(aggregate, aggregateInstance);

            // Salva mudanças
            await repository.save(aggregateInstance);

            // Publica eventos de domínio
            if (result.events && result.events.length > 0) {
                for (const event of result.events) {
                    await this.publishDomainEvent(contextName, event);
                }
            }

            return result;

        } catch (error) {
            // Em produção, poderia ter compensação ou saga
            throw error;
        }
    }

    /**
     * Verifica invariantes do aggregate
     */
    checkInvariants(aggregate, aggregateInstance) {
        for (const invariant of aggregate.invariants) {
            if (!invariant.check(aggregateInstance)) {
                throw new Error(`Business invariant violated: ${invariant.name}`);
            }
        }
    }

    /**
     * Publica evento de domínio
     */
    async publishDomainEvent(contextName, event) {
        const enrichedEvent = {
            ...event,
            contextName,
            eventId: this.generateEventId(),
            timestamp: new Date().toISOString()
        };

        // Adiciona ao registro de eventos
        if (!this.domainEvents.has(contextName)) {
            this.domainEvents.set(contextName, []);
        }
        this.domainEvents.get(contextName).push(enrichedEvent);

        // Notifica subscribers (poderia ser integrado com event-driven engine)
        console.log(`Domain event published: ${event.type} in context ${contextName}`);
    }

    /**
     * Adiciona termo à linguagem ubíqua
     */
    addUbiquitousLanguageTerm(contextName, term, definition) {
        const context = this.boundedContexts.get(contextName);
        if (context) {
            context.ubiquitousLanguage.set(term, definition);
        }
    }

    /**
     * Cria factory para objetos de domínio
     */
    createFactory(contextName, factoryName, factoryFunction) {
        const key = `${contextName}.${factoryName}`;
        this.factories.set(key, factoryFunction);
        return factoryFunction;
    }

    /**
     * Saga de domínio para processos complexos
     */
    createDomainSaga(contextName, sagaName, steps) {
        const saga = {
            id: this.generateSagaId(),
            contextName,
            name: sagaName,
            steps: steps,
            currentStep: 0,
            state: 'pending',
            compensations: []
        };

        // Registra como serviço de domínio
        this.registerDomainService(contextName, sagaName, {
            start: async (initialData) => {
                saga.state = 'running';
                const results = [];

                try {
                    for (let i = 0; i < steps.length; i++) {
                        saga.currentStep = i;
                        const step = steps[i];

                        const result = await step.execute(initialData);
                        results.push(result);

                        // Registra compensação
                        if (step.compensate) {
                            saga.compensations.push(step.compensate);
                        }
                    }

                    saga.state = 'completed';
                    return { success: true, results };

                } catch (error) {
                    // Executa compensações
                    await this.compensateDomainSaga(saga);
                    saga.state = 'failed';
                    throw error;
                }
            }
        });

        return saga;
    }

    /**
     * Executa compensações da saga
     */
    async compensateDomainSaga(saga) {
        for (const compensation of saga.compensations.reverse()) {
            try {
                await compensation();
            } catch (error) {
                console.error('Error in domain saga compensation:', error);
            }
        }
    }

    /**
     * Gera ID único para evento
     */
    generateEventId() {
        return `domain_evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Gera ID único para saga
     */
    generateSagaId() {
        return `domain_saga_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Context mapping entre bounded contexts
     */
    defineContextMapping(fromContext, toContext, mappingType, translationRules) {
        // Implementação simplificada de context mapping
        const mapping = {
            from: fromContext,
            to: toContext,
            type: mappingType, // partnership, shared-kernel, customer-supplier, etc.
            translationRules
        };

        // Armazenaria os mappings para tradução automática
        return mapping;
    }

    /**
     * Estatísticas dos bounded contexts
     */
    getStats() {
        const stats = {};
        for (const [contextName, context] of this.boundedContexts) {
            stats[contextName] = {
                aggregates: context.aggregates.length,
                domainServices: context.domainServices.length,
                repositories: context.repositories.length,
                ubiquitousLanguageTerms: context.ubiquitousLanguage.size
            };
        }
        return stats;
    }

    /**
     * Obtém bounded context
     */
    getBoundedContext(contextName) {
        return this.boundedContexts.get(contextName);
    }

    /**
     * Lista todos os bounded contexts
     */
    listBoundedContexts() {
        return Array.from(this.boundedContexts.keys());
    }
}

// Singleton instance
const dddEngine = new DDDEngine();

module.exports = dddEngine;