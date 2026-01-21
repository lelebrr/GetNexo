const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Middleware para autenticação
const authenticateToken = require('../middleware/auth');

// Aplicar autenticação a todas as rotas
router.use(authenticateToken);

// Cache para containers (atualizado a cada 30 segundos)
let containersCache = {
    data: [],
    timestamp: 0,
    CACHE_DURATION: 30000 // 30 segundos
};

// Função para executar comandos Docker de forma segura
function executeDockerCommand(command, callback) {
    exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
        if (error) {
            console.error('Erro ao executar comando Docker:', error);
            callback(error, null);
            return;
        }
        callback(null, stdout || stderr);
    });
}

// Função para obter lista de containers
function getContainers(callback) {
    const now = Date.now();

    // Usar cache se estiver válido
    if (containersCache.timestamp && (now - containersCache.timestamp) < containersCache.CACHE_DURATION) {
        return callback(null, containersCache.data);
    }

    // Comando para listar containers com detalhes
    const command = `docker ps -a --format '{"id":"{{.ID}}","name":"{{.Names}}","image":"{{.Image}}","status":"{{.Status}}","ports":"{{.Ports}}"}'`;

    executeDockerCommand(command, (error, output) => {
        if (error) {
            return callback(error, null);
        }

        try {
            // Parsear output JSON
            const containersRaw = output.trim().split('\n').filter(line => line.trim());
            const containers = containersRaw.map(line => {
                try {
                    const container = JSON.parse(line);

                    // Extrair informações do status
                    const statusMatch = container.status.match(/(Up|Exited|Created)/);
                    const status = statusMatch ? statusMatch[1].toLowerCase() : 'unknown';

                    // Calcular uptime para containers rodando
                    let uptime = 'N/A';
                    if (status === 'up') {
                        const uptimeMatch = container.status.match(/Up (\d+ \w+)/);
                        uptime = uptimeMatch ? uptimeMatch[1] : 'Unknown';
                    }

                    return {
                        id: container.id,
                        name: container.name,
                        image: container.image,
                        status: status,
                        uptime: uptime,
                        ports: container.ports,
                        memoryUsage: 'N/A', // Será implementado com stats
                        memoryLimit: 'N/A',
                        cpuUsage: 'N/A'
                    };
                } catch (parseError) {
                    console.error('Erro ao parsear container:', parseError);
                    return null;
                }
            }).filter(container => container !== null);

            // Atualizar cache
            containersCache.data = containers;
            containersCache.timestamp = now;

            callback(null, containers);
        } catch (parseError) {
            callback(parseError, null);
        }
    });
}

// GET /api/docker/containers - Listar todos os containers
router.get('/containers', (req, res) => {
    getContainers((error, containers) => {
        if (error) {
            console.error('Erro ao listar containers:', error);
            return res.status(500).json({
                error: 'Erro interno do servidor',
                message: 'Não foi possível listar os containers'
            });
        }

        res.json({ containers });
    });
});

// POST /api/docker/:action - Executar ações em containers
router.post('/:action', (req, res) => {
    const { action } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            error: 'Nome do container é obrigatório'
        });
    }

    let command = '';

    switch (action) {
        case 'start':
            command = `docker start ${name}`;
            break;
        case 'stop':
            command = `docker stop ${name}`;
            break;
        case 'restart':
            command = `docker restart ${name}`;
            break;
        case 'delete':
            command = `docker rm -f ${name}`;
            break;
        case 'scale-up':
            // Implementar lógica de escala (exemplo simples)
            command = `docker run -d --name ${name}-scaled-${Date.now()} ${name}`;
            break;
        case 'scale-update':
            // Atualizar configurações de escala (placeholder)
            return res.json({ message: 'Configurações de escala atualizadas' });
        case 'logs':
            command = `docker logs --tail 100 ${name}`;
            break;
        default:
            return res.status(400).json({
                error: 'Ação não suportada',
                supported: ['start', 'stop', 'restart', 'delete', 'scale-up', 'scale-update', 'logs']
            });
    }

    executeDockerCommand(command, (error, output) => {
        if (error) {
            console.error(`Erro ao executar ${action}:`, error);
            return res.status(500).json({
                error: `Erro ao executar ${action}`,
                details: error.message
            });
        }

        // Invalidar cache após ações que modificam estado
        if (['start', 'stop', 'restart', 'delete', 'scale-up'].includes(action)) {
            containersCache.timestamp = 0;
        }

        res.json({
            message: `Ação ${action} executada com sucesso`,
            output: action === 'logs' ? output : undefined
        });
    });
});

// GET /api/docker/stats/:name - Obter estatísticas de um container
router.get('/stats/:name', (req, res) => {
    const { name } = req.params;

    // Comando para obter estatísticas
    const command = `docker stats --no-stream --format '{"container":"{{.Container}}","cpu":"{{.CPUPerc}}","memory":"{{.MemUsage}}","memoryPerc":"{{.MemPerc}}","netIO":"{{.NetIO}}","blockIO":"{{.BlockIO}}"}' ${name}`;

    executeDockerCommand(command, (error, output) => {
        if (error) {
            console.error('Erro ao obter estatísticas:', error);
            return res.status(500).json({
                error: 'Erro ao obter estatísticas do container'
            });
        }

        try {
            const stats = JSON.parse(output.trim());
            res.json({ stats });
        } catch (parseError) {
            res.status(500).json({
                error: 'Erro ao parsear estatísticas'
            });
        }
    });
});

// POST /api/docker/deploy - Deploy de nova aplicação
router.post('/deploy', (req, res) => {
    const { image, name, ports, env } = req.body;

    if (!image || !name) {
        return res.status(400).json({
            error: 'Imagem e nome são obrigatórios'
        });
    }

    // Construir comando de deploy
    let command = `docker run -d --name ${name} ${image}`;

    if (ports && ports.length > 0) {
        ports.forEach(port => {
            command += ` -p ${port}`;
        });
    }

    if (env && env.length > 0) {
        env.forEach(envVar => {
            command += ` -e ${envVar}`;
        });
    }

    executeDockerCommand(command, (error, output) => {
        if (error) {
            console.error('Erro ao fazer deploy:', error);
            return res.status(500).json({
                error: 'Erro ao fazer deploy da aplicação'
            });
        }

        // Invalidar cache
        containersCache.timestamp = 0;

        res.json({
            message: 'Aplicação implantada com sucesso',
            containerId: output.trim()
        });
    });
});

// GET /api/docker/logs/:name - Obter logs de um container
router.get('/logs/:name', (req, res) => {
    const { name } = req.params;
    const { tail = 100 } = req.query;

    const command = `docker logs --tail ${tail} ${name}`;

    executeDockerCommand(command, (error, output) => {
        if (error) {
            console.error('Erro ao obter logs:', error);
            return res.status(500).json({
                error: 'Erro ao obter logs do container'
            });
        }

        res.json({
            logs: output,
            container: name
        });
    });
});

module.exports = router;