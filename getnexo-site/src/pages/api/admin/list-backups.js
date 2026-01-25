import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const backupsDir = path.join(process.cwd(), 'backups');

        if (!fs.existsSync(backupsDir)) {
            return new Response(
                JSON.stringify({ backups: [] }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const files = fs.readdirSync(backupsDir);
        const backups = files
            .filter(file => file.endsWith('.json') || file.endsWith('.sql'))
            .map(file => {
                const filePath = path.join(backupsDir, file);
                const stats = fs.statSync(filePath);
                return {
                    name: file,
                    date: stats.mtime.toLocaleDateString('pt-BR'),
                    size: `${(stats.size / 1024).toFixed(2)} KB`
                };
            });

        return new Response(
            JSON.stringify({ backups }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Erro ao listar backups:', error);
        return new Response(
            JSON.stringify({ error: 'Erro ao listar backups' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
