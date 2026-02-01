import type { APIRoute } from 'astro';
import { verifyToken } from '../../lib/auth';

// Dados simulados para exportação
const mockData: { [key: string]: any[] } = {
    // Return empty or fetch from real DB in future
    users: [],
    analytics: [
        { date: '2024-01-01', pageViews: 1200, uniqueVisitors: 800, bounceRate: 0.45 },
        { date: '2024-01-02', pageViews: 1350, uniqueVisitors: 850, bounceRate: 0.42 },
        { date: '2024-01-03', pageViews: 1100, uniqueVisitors: 720, bounceRate: 0.48 },
    ],
    files: [
        { id: 1, name: 'documento.pdf', size: 2048576, uploadDate: '2024-01-15', type: 'pdf' },
        { id: 2, name: 'imagem.jpg', size: 1048576, uploadDate: '2024-01-20', type: 'image' },
        { id: 3, name: 'video.mp4', size: 5242880, uploadDate: '2024-01-25', type: 'video' },
    ]
};

// Função para converter array de objetos para CSV
function arrayToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Adicionar cabeçalhos
    csvRows.push(headers.join(','));

    // Adicionar linhas de dados
    data.forEach((row: any) => {
        const values = headers.map(header => {
            const value = row[header];
            // Escapar valores que contêm vírgulas ou aspas
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
}

// Gerar relatório em HTML
function generateHTMLReport(data: any[], type: string): string {
    const title = type === 'users' ? 'Relatório de Usuários' :
        type === 'analytics' ? 'Relatório de Analytics' :
            'Relatório de Arquivos';

    let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%;">';
    tableHTML += '<thead><tr>';

    if (data.length > 0) {
        Object.keys(data[0]).forEach(header => {
            tableHTML += `<th style="padding: 8px; background-color: #f2f2f2;">${header}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';

        data.forEach(row => {
            tableHTML += '<tr>';
            Object.values(row).forEach(value => {
                tableHTML += `<td style="padding: 8px;">${value}</td>`;
            });
            tableHTML += '</tr>';
        });
    }

    tableHTML += '</tbody></table>';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { margin-top: 20px; }
            th, td { padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
        </style>
    </head>
    <body>
        <h1>${title}</h1>
        <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
        ${tableHTML}
    </body>
    </html>
  `;
}

export const GET: APIRoute = async ({ request, url }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Token não fornecido' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    if (!decoded) {
        return new Response(JSON.stringify({ error: 'Token inválido' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const dataType = url.searchParams.get('type') || 'users'; // users, analytics, files
    const format = url.searchParams.get('format') || 'json'; // json, csv, html

    try {
        const data = mockData[dataType] || mockData.users;

        if (!data || data.length === 0) {
            return new Response(JSON.stringify({ error: 'Dados não encontrados' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        let content = '';
        let contentType = '';
        let filename = `${dataType}_report_${new Date().toISOString().split('T')[0]}`;

        switch (format) {
            case 'csv':
                content = arrayToCSV(data);
                contentType = 'text/csv';
                filename += '.csv';
                break;

            case 'html':
                content = generateHTMLReport(data, dataType);
                contentType = 'text/html';
                filename += '.html';
                break;

            case 'json':
            default:
                content = JSON.stringify(data, null, 2);
                contentType = 'application/json';
                filename += '.json';
                break;
        }

        return new Response(content, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`
            }
        });

    } catch (error) {
        console.error('Erro na exportação:', error);
        return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};