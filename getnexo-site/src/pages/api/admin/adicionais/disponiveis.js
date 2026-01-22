export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        // Mock data para adicionais disponíveis
        const adicionais = [
            {
                id: '360-ar',
                nome: '360° AR',
                descricao: 'Visualização 3D completa e AR nativo',
                preco: 'R$ 97/mês',
                beneficio: 'Aumenta conversão em até 40%',
                ativo: true,
                comprado: true
            },
            {
                id: 'multizap',
                nome: 'MultiZap',
                descricao: '3 contas WhatsApp simultâneas',
                preco: 'R$ 147/mês',
                beneficio: 'Escala atendimento sem limites',
                ativo: false,
                comprado: false
            },
            {
                id: 'ia-plus',
                nome: 'IA Plus',
                descricao: 'GPT-4o + respostas humanas',
                preco: 'R$ 197/mês',
                beneficio: 'Inteligência máxima no atendimento',
                ativo: true,
                comprado: true
            },
            {
                id: 'equipe',
                nome: 'Equipe',
                descricao: '5 usuários admin simultâneos',
                preco: 'R$ 297/mês',
                beneficio: 'Colaboração total na gestão',
                ativo: false,
                comprado: true
            }
        ];

        res.status(200).json({ adicionais });
    } catch (error) {
        console.error('Erro ao buscar adicionais disponíveis:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}