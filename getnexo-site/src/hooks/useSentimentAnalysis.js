import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para análise de sentimentos
 * Fornece funções para analisar texto e gerenciar estado de sentimentos
 */
const useSentimentAnalysis = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastAnalysis, setLastAnalysis] = useState(null);

    /**
     * Analisa texto usando a API
     * @param {string} text - Texto a ser analisado
     * @param {Object} options - Opções adicionais
     * @returns {Promise<Object>} Resultado da análise
     */
    const analyzeText = useCallback(async (text, options = {}) => {
        if (!text || text.trim().length === 0) {
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/sentiment/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, options })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erro na análise de sentimento');
            }

            setLastAnalysis(result.data);
            return result.data;
        } catch (err) {
            console.error('Erro na análise de sentimento:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Analisa sentimento de um ticket
     * @param {string} ticketId - ID do ticket
     * @param {string} text - Texto a ser analisado
     * @param {Object} options - Opções adicionais
     */
    const analyzeTicket = useCallback(async (ticketId, text, options = {}) => {
        if (!ticketId || !text) {
            throw new Error('Ticket ID e texto são obrigatórios');
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/sentiment/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ticketId, text, options })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erro na análise do ticket');
            }

            setLastAnalysis(result.data);
            return result.data;
        } catch (err) {
            console.error('Erro na análise do ticket:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Analisa sentimento de uma mensagem
     * @param {string} messageId - ID da mensagem
     * @param {string} text - Texto a ser analisado
     * @param {string} ticketId - ID do ticket (opcional)
     * @param {Object} options - Opções adicionais
     */
    const analyzeMessage = useCallback(async (messageId, text, ticketId, options = {}) => {
        if (!messageId || !text) {
            throw new Error('Message ID e texto são obrigatórios');
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/sentiment/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messageId, text, ticketId, options })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erro na análise da mensagem');
            }

            setLastAnalysis(result.data);
            return result.data;
        } catch (err) {
            console.error('Erro na análise da mensagem:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Analisa múltiplos textos em lote
     * @param {string[]} texts - Array de textos
     * @param {Object} options - Opções adicionais
     */
    const analyzeBatch = useCallback(async (texts, options = {}) => {
        if (!Array.isArray(texts) || texts.length === 0) {
            throw new Error('Array de textos é obrigatório');
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/sentiment/analyze/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ texts, options })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erro na análise em lote');
            }

            return result.data;
        } catch (err) {
            console.error('Erro na análise em lote:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Busca análises de sentimento de um ticket
     * @param {string} ticketId - ID do ticket
     * @param {Object} options - Opções de paginação
     */
    const getTicketAnalyses = useCallback(async (ticketId, options = {}) => {
        if (!ticketId) {
            throw new Error('Ticket ID é obrigatório');
        }

        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                limit: options.limit || 50,
                skip: options.skip || 0
            });

            const response = await fetch(`/api/sentiment/analysis/ticket/${ticketId}?${params}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erro ao buscar análises do ticket');
            }

            return result.data;
        } catch (err) {
            console.error('Erro ao buscar análises do ticket:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtém métricas de dashboard
     * @param {Object} filters - Filtros para as métricas
     */
    const getDashboardMetrics = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams(filters);
            const response = await fetch(`/api/sentiment/dashboard/metrics?${params}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erro ao buscar métricas');
            }

            return result.data;
        } catch (err) {
            console.error('Erro ao buscar métricas:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtém métricas por agente
     * @param {Object} filters - Filtros
     */
    const getMetricsByAgent = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams(filters);
            const response = await fetch(`/api/sentiment/dashboard/metrics-by-agent?${params}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erro ao buscar métricas por agente');
            }

            return result.data;
        } catch (err) {
            console.error('Erro ao buscar métricas por agente:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtém métricas por produto
     * @param {Object} filters - Filtros
     */
    const getMetricsByProduct = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams(filters);
            const response = await fetch(`/api/sentiment/dashboard/metrics-by-product?${params}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erro ao buscar métricas por produto');
            }

            return result.data;
        } catch (err) {
            console.error('Erro ao buscar métricas por produto:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtém relatório de eficácia do suporte
     * @param {Object} filters - Filtros
     */
    const getSupportEffectivenessReport = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams(filters);
            const response = await fetch(`/api/sentiment/dashboard/effectiveness?${params}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erro ao buscar relatório de eficácia');
            }

            return result.data;
        } catch (err) {
            console.error('Erro ao buscar relatório de eficácia:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Limpa o estado de erro
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Limpa a última análise
     */
    const clearLastAnalysis = useCallback(() => {
        setLastAnalysis(null);
    }, []);

    return {
        // Estado
        loading,
        error,
        lastAnalysis,

        // Ações
        analyzeText,
        analyzeTicket,
        analyzeMessage,
        analyzeBatch,
        getTicketAnalyses,
        getDashboardMetrics,
        getMetricsByAgent,
        getMetricsByProduct,
        getSupportEffectivenessReport,

        // Utilitários
        clearError,
        clearLastAnalysis
    };
};

export default useSentimentAnalysis;
