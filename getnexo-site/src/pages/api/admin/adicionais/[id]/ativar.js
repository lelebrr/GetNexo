export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'ID do adicional é obrigatório' });
        }

        // Simular ativação do adicional
        const ativacaoPermitida = ['360-ar', 'ia-plus', 'equipe']; // Apenas estes podem ser ativados

        if (!ativacaoPermitida.includes(id)) {
            return res.status(400).json({ error: 'Este adicional não pode ser ativado manualmente' });
        }

        // Mock de ativação
        console.log(`[ATIVAÇÃO] Ativando adicional: ${id}`);

        // Em produção, aqui seria feita a lógica de ativação no banco de dados
        // e atualização das permissões do usuário

        res.status(200).json({
            success: true,
            message: `Adicional ${id} ativado com sucesso!`
        });

    } catch (error) {
        console.error('Erro ao ativar adicional:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}