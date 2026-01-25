// src/components/hooks/useDemoState.js
// Hook para gerenciar estado persistente do demo GetNexo
// Salva configurações, histórico do chat e preferências no localStorage

import { useState, useEffect } from 'react'

export function useDemoState() {
    // Configurações padrão
    const configPadrao = {
        iaResposta: 'grok-code-fast-1',
        iaImagem: 'flux-schnell',
        vozAtiva: true,
        arLogo: true,
        produtosReais: [
            'tenis branco', 'tenis preto', 'bota marrom', 'chinelo simples', 'salto bege',
            'camiseta branca', 'camiseta preta', 'calca jeans', 'jaqueta verde', 'vestido preto',
            'oculos sol', 'relógio prata', 'bolsa crossbody', 'chapeu fedora', 'pulseira prata',
            'celular preto', 'fone ouvido', 'smartwatch', 'teclado gamer', 'carregador wireless',
            'vasinho planta', 'mesa centro', 'cadeira gamer', 'abajur minimal', 'quadro 3d'
        ]
    }

    // Estado das configurações
    const [config, setConfig] = useState(configPadrao)
    const [carregando, setCarregando] = useState(true)

    // Carrega configurações do localStorage na inicialização
    useEffect(() => {
        try {
            const configSalva = localStorage.getItem('getnexo-demo-config')
            if (configSalva) {
                const configParsed = JSON.parse(configSalva)
                // Mescla com padrão para garantir que novas propriedades sejam incluídas
                setConfig({ ...configPadrao, ...configParsed })
            }
        } catch (error) {
            console.warn('Erro ao carregar configuração salva:', error)
            // Mantém configuração padrão
        } finally {
            setCarregando(false)
        }
    }, [])

    // Salva configuração no localStorage
    const salvarConfig = (novaConfig) => {
        try {
            const configAtualizada = { ...config, ...novaConfig }
            localStorage.setItem('getnexo-demo-config', JSON.stringify(configAtualizada))
            setConfig(configAtualizada)
            return true
        } catch (error) {
            console.error('Erro ao salvar configuração:', error)
            return false
        }
    }

    // Reseta configuração para padrão
    const resetarConfig = () => {
        try {
            localStorage.removeItem('getnexo-demo-config')
            setConfig(configPadrao)
            return true
        } catch (error) {
            console.error('Erro ao resetar configuração:', error)
            return false
        }
    }

    // === GERENCIAMENTO DO HISTÓRICO DO CHAT ===

    // Carrega histórico salvo
    const getHistorico = () => {
        try {
            const historicoSalvo = localStorage.getItem('getnexo-chat')
            return historicoSalvo ? JSON.parse(historicoSalvo) : []
        } catch (error) {
            console.warn('Erro ao carregar histórico:', error)
            return []
        }
    }

    // Salva histórico
    const salvarHistorico = (mensagens) => {
        try {
            localStorage.setItem('getnexo-chat', JSON.stringify(mensagens))
            return true
        } catch (error) {
            console.error('Erro ao salvar histórico:', error)
            return false
        }
    }

    // Limpa histórico
    const limparHistorico = () => {
        try {
            localStorage.removeItem('getnexo-chat')
            return true
        } catch (error) {
            console.error('Erro ao limpar histórico:', error)
            return false
        }
    }

    // === ESTATÍSTICAS DO DEMO ===

    // Carrega estatísticas
    const getEstatisticas = () => {
        try {
            const statsSalvas = localStorage.getItem('getnexo-demo-stats')
            return statsSalvas ? JSON.parse(statsSalvas) : {
                mensagensEnviadas: 0,
                imagensGeradas: 0,
                arVisualizacoes: 0,
                tempoTotal: 0,
                ultimaSessao: null
            }
        } catch (error) {
            console.warn('Erro ao carregar estatísticas:', error)
            return { mensagensEnviadas: 0, imagensGeradas: 0, arVisualizacoes: 0, tempoTotal: 0, ultimaSessao: null }
        }
    }

    // Atualiza estatísticas
    const atualizarEstatisticas = (novasStats) => {
        try {
            const statsAtuais = getEstatisticas()
            const statsAtualizadas = {
                ...statsAtuais,
                ...novasStats,
                ultimaSessao: new Date().toISOString()
            }
            localStorage.setItem('getnexo-demo-stats', JSON.stringify(statsAtualizadas))
            return statsAtualizadas
        } catch (error) {
            console.error('Erro ao atualizar estatísticas:', error)
            return null
        }
    }

    // === PREFERÊNCIAS DO USUÁRIO ===

    // Carrega preferências
    const getPreferencias = () => {
        try {
            const prefsSalvas = localStorage.getItem('getnexo-demo-prefs')
            return prefsSalvas ? JSON.parse(prefsSalvas) : {
                tema: 'escuro',
                idioma: 'pt-BR',
                notificacoes: true,
                tourCompleto: false
            }
        } catch (error) {
            console.warn('Erro ao carregar preferências:', error)
            return { tema: 'escuro', idioma: 'pt-BR', notificacoes: true, tourCompleto: false }
        }
    }

    // Salva preferências
    const salvarPreferencias = (novasPrefs) => {
        try {
            const prefsAtuais = getPreferencias()
            const prefsAtualizadas = { ...prefsAtuais, ...novasPrefs }
            localStorage.setItem('getnexo-demo-prefs', JSON.stringify(prefsAtualizadas))
            return true
        } catch (error) {
            console.error('Erro ao salvar preferências:', error)
            return false
        }
    }

    // === UTILITÁRIOS ===

    // Exporta todos os dados (backup)
    const exportarDados = () => {
        try {
            return {
                config: config,
                historico: getHistorico(),
                estatisticas: getEstatisticas(),
                preferencias: getPreferencias(),
                timestamp: new Date().toISOString()
            }
        } catch (error) {
            console.error('Erro ao exportar dados:', error)
            return null
        }
    }

    // Importa dados (restauração)
    const importarDados = (dados) => {
        try {
            if (dados.config) salvarConfig(dados.config)
            if (dados.historico) salvarHistorico(dados.historico)
            if (dados.estatisticas) localStorage.setItem('getnexo-demo-stats', JSON.stringify(dados.estatisticas))
            if (dados.preferencias) salvarPreferencias(dados.preferencias)
            return true
        } catch (error) {
            console.error('Erro ao importar dados:', error)
            return false
        }
    }

    // Limpa TODOS os dados
    const limparTudo = () => {
        try {
            localStorage.removeItem('getnexo-demo-config')
            localStorage.removeItem('getnexo-chat')
            localStorage.removeItem('getnexo-demo-stats')
            localStorage.removeItem('getnexo-demo-prefs')
            setConfig(configPadrao)
            return true
        } catch (error) {
            console.error('Erro ao limpar tudo:', error)
            return false
        }
    }

    return {
        // Estado
        config,
        carregando,

        // Configurações
        salvarConfig,
        resetarConfig,

        // Histórico
        getHistorico,
        salvarHistorico,
        limparHistorico,

        // Estatísticas
        getEstatisticas,
        atualizarEstatisticas,

        // Preferências
        getPreferencias,
        salvarPreferencias,

        // Utilitários
        exportarDados,
        importarDados,
        limparTudo
    }
}