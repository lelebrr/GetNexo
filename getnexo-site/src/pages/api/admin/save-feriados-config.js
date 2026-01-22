// API para salvar configuração dos feriados
// Salva em /data/feriados-config.json

import fs from 'fs';
import path from 'path';

export async function POST({ request }) {
    try {
        const body = await request.json();
        const configPath = path.join(process.cwd(), 'public', 'data', 'feriados-config.json');

        // Validação básica
        if (!body.config || !body.config.feriados) {
            return new Response(JSON.stringify({
                error: 'Configuração inválida'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Salvar arquivo
        fs.writeFileSync(configPath, JSON.stringify(body, null, 2), 'utf8');

        return new Response(JSON.stringify({
            success: true,
            message: 'Configuração salva com sucesso'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Erro ao salvar configuração dos feriados:', error);
        return new Response(JSON.stringify({
            error: 'Erro interno do servidor'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}