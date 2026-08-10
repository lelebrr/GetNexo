import fs from 'fs';
import path from 'path';

export async function POST({ request }) {
    try {
        const body = await request.json();
        const { slug, lang } = body;

        if (!slug || !lang) {
            return new Response(
                JSON.stringify({ error: 'Slug e idioma são obrigatórios' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Validate slug and lang to prevent path traversal
        const safeRegex = /^[a-zA-Z0-9_-]+$/;
        if (!safeRegex.test(slug) || !safeRegex.test(lang)) {
            return new Response(
                JSON.stringify({ error: 'Formato inválido para slug ou idioma' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Determinar o caminho do arquivo baseado no idioma
        let filePath;
        if (lang === 'pt') {
            filePath = path.join(process.cwd(), 'src', 'pages', 'blog', `${slug}.astro`);
        } else {
            filePath = path.join(process.cwd(), 'src', 'pages', lang, 'blog', `${slug}.astro`);
        }

        // Verificar se o arquivo existe
        if (!fs.existsSync(filePath)) {
            return new Response(
                JSON.stringify({ error: 'Post não encontrado' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Excluir o arquivo
        fs.unlinkSync(filePath);

        return new Response(
            JSON.stringify({ success: true, message: 'Post excluído com sucesso' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Erro ao excluir post:', error);
        return new Response(
            JSON.stringify({ error: 'Erro interno ao excluir post' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
