export async function POST({ request }) {
    try {
        const { prompt, mode = 'Artigo Blog' } = await request.json();

        if (!prompt) {
            return new Response(JSON.stringify({ error: 'Prompt is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const apiKey = process.env.DEEPSEEK_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'DeepSeek API key not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // System prompt based on Ara's identity
        const systemPrompt = `Você é Ara, a Editora Chefe e inteligência central da plataforma GetNexo. 
Sua missão é criar conteúdo de alta performance focado em conversão e engajamento para WhatsApp, Redes Sociais e Blogs.

Modo Atual: ${mode}

Instruções Adicionais:
- Use um tom profissional, porém inovador e persuasivo.
- Foque em resultados práticos e benefícios claros.
- Se o modo for "Artigo Blog", inclua sugestões de título (H1) e subtítulos (H2).
- Se o modo for "LinkedIn Insight", foque em autoridade e tendências.
- Se o modo for "E-mail Flow", estruture como uma sequência lógica de nutrição.
- Se o modo for "Ad Copy", use frameworks como AIDA ou PAS.

Responda em Português do Brasil de forma estruturada.`;

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 2000,
                temperature: 0.7,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('DeepSeek API error:', errorData);
            return new Response(JSON.stringify({ error: 'AI Service error' }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await response.json();
        const aiResponse = data.choices[0]?.message?.content || 'Desculpe, não consegui processar sua solicitação.';

        return new Response(JSON.stringify({
            content: aiResponse,
            tokens: data.usage?.total_tokens || 0,
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Ara Generation Error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
