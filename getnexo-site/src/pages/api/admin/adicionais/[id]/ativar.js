export const prerender = false;

export async function POST({ request, params }) {
    try {
        const { id } = params;

        if (!id) {
            return new Response(JSON.stringify({ error: 'ID do adicional é obrigatório' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Simular ativação do adicional
        const ativacaoPermitida = ['360-ar', 'ia-plus', 'equipe']; // Apenas estes podem ser ativados

        if (!ativacaoPermitida.includes(id)) {
            return new Response(JSON.stringify({ error: 'Este adicional não pode ser ativado manualmente' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Mock de ativação
        console.log(`[ATIVAÇÃO] Ativando adicional: ${id}`);

        // Em produção, aqui seria feita a lógica de ativação no banco de dados
        // e atualização das permissões do usuário

        return new Response(JSON.stringify({
            success: true,
            message: `Adicional ${id} ativado com sucesso!`
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Erro ao ativar adicional:', error);
        return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}