import fs from 'fs';
import path from 'path';

export async function POST() {
    try {
        const logsDir = path.join(process.cwd(), 'logs');

        if (!fs.existsSync(logsDir)) {
            return new Response(
                JSON.stringify({ success: true, message: 'Nenhum log para limpar' }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const files = fs.readdirSync(logsDir);
        let deletedCount = 0;

        files.forEach(file => {
            const filePath = path.join(logsDir, file);
            fs.unlinkSync(filePath);
            deletedCount++;
        });

        console.log(`🧹 ${deletedCount} arquivos de log foram limpos`);

        return new Response(
            JSON.stringify({
                success: true,
                message: `Logs limpos com sucesso (${deletedCount} arquivos)`
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Erro ao limpar logs:', error);
        return new Response(
            JSON.stringify({ error: 'Erro ao limpar logs' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
