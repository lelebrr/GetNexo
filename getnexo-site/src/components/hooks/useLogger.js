// src/components/hooks/useLogger.js
// Sistema de logs para o demo GetNexo

export function useLogger(config = {}) {
    const {
        ativo = true,
        maxLogs = 100,
        persistir = true
    } = config

    // Carrega logs salvos
    const carregarLogs = () => {
        if (!persistir) return []
        try {
            const logsSalvos = localStorage.getItem('getnexo-demo-logs')
            return logsSalvos ? JSON.parse(logsSalvos) : []
        } catch (error) {
            console.warn('Erro ao carregar logs:', error)
            return []
        }
    }

    // Salva logs
    const salvarLogs = (logs) => {
        if (!persistir) return
        try {
            localStorage.setItem('getnexo-demo-logs', JSON.stringify(logs.slice(-maxLogs)))
        } catch (error) {
            console.warn('Erro ao salvar logs:', error)
        }
    }

    // Adiciona log
    const log = (tipo, mensagem, dados = {}) => {
        if (!ativo) return

        const novoLog = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            tipo,
            mensagem,
            dados,
            userAgent: navigator.userAgent,
            url: window.location.href
        }

        const logsAtuais = carregarLogs()
        const novosLogs = [...logsAtuais, novoLog]
        salvarLogs(novosLogs)

        // Log no console com cores
        const cores = {
            info: '\x1b[36m',    // Ciano
            sucesso: '\x1b[32m', // Verde
            aviso: '\x1b[33m',   // Amarelo
            erro: '\x1b[31m',    // Vermelho
            debug: '\x1b[35m'    // Magenta
        }

        const cor = cores[tipo] || '\x1b[37m'
        console.log(`${cor}[${tipo.toUpperCase()}] ${new Date().toLocaleTimeString()} - ${mensagem}`, dados)
    }

    // Métodos específicos
    const info = (mensagem, dados) => log('info', mensagem, dados)
    const sucesso = (mensagem, dados) => log('sucesso', mensagem, dados)
    const aviso = (mensagem, dados) => log('aviso', mensagem, dados)
    const erro = (mensagem, dados) => log('erro', mensagem, dados)
    const debug = (mensagem, dados) => log('debug', mensagem, dados)

    // Obtém logs filtrados
    const getLogs = (filtro = {}) => {
        const logs = carregarLogs()
        const { tipo, desde, ate } = filtro

        return logs.filter(log => {
            if (tipo && log.tipo !== tipo) return false
            if (desde && new Date(log.timestamp) < new Date(desde)) return false
            if (ate && new Date(log.timestamp) > new Date(ate)) return false
            return true
        })
    }

    // Limpa logs
    const limparLogs = () => {
        salvarLogs([])
    }

    // Estatísticas dos logs
    const getStats = () => {
        const logs = carregarLogs()
        const stats = {
            total: logs.length,
            porTipo: {},
            hoje: 0,
            semana: 0,
            mes: 0
        }

        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0)
        const semanaAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000)
        const mesAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000)

        logs.forEach(log => {
            // Por tipo
            stats.porTipo[log.tipo] = (stats.porTipo[log.tipo] || 0) + 1

            // Por período
            const logDate = new Date(log.timestamp)
            if (logDate >= hoje) stats.hoje++
            if (logDate >= semanaAtras) stats.semana++
            if (logDate >= mesAtras) stats.mes++
        })

        return stats
    }

    // Exporta logs
    const exportarLogs = () => {
        const logs = carregarLogs()
        const dados = {
            exportadoEm: new Date().toISOString(),
            totalLogs: logs.length,
            stats: getStats(),
            logs: logs
        }

        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `getnexo-logs-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    return {
        log,
        info,
        sucesso,
        aviso,
        erro,
        debug,
        getLogs,
        limparLogs,
        getStats,
        exportarLogs
    }
}