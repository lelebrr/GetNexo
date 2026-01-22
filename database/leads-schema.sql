-- schema-leads.sql - Banco de dados para Leads Perdidos Inteligentes
-- Execute isso uma vez: sqlite3 database/leads.db < database/leads-schema.sql

CREATE TABLE IF NOT EXISTS leads_perdidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  numero TEXT NOT NULL UNIQUE,                    -- +55 51 99999-8888
  nome TEXT,                                      -- João Silva (se capturado)
  produto TEXT NOT NULL,                          -- "Tênis Nike Air Max 270"
  preco REAL,                                     -- 399.90
  data_captura TEXT NOT NULL,                     -- "2026-01-22 14:32:00"
  interesse TEXT,                                 -- "pediu tamanho 40"
  ultima_msg TEXT,                                -- "Tem em 40?"
  link_compra TEXT,                               -- "https://loja.com/nike-270"
  foto_360 TEXT,                                  -- "/uploads/foto.jpg"
  conversa_json TEXT,                             -- JSON da conversa completa
  status TEXT DEFAULT 'perdido',                  -- perdido / reenviado / fechado
  enviado_reengajamento BOOLEAN DEFAULT 0,        -- se já mandamos oferta

  -- Campos de inteligência (analisados por IA)
  motivo_perda TEXT DEFAULT NULL,                 -- 'preco_alto', 'atendimento', 'duvida_estoque', 'so_consulta', 'desistiu', 'outro'
  score_intencao INTEGER DEFAULT 0,              -- 0-100 (quanto queria comprar)
  tags TEXT DEFAULT '',                           -- 'tamanho_40;cor_preto;frete_gratis'
  valor_perdido REAL DEFAULT 0,                   -- valor do produto visto
  ultima_interacao TEXT DEFAULT NULL,             -- timestamp da última atividade

  -- Controle de reengajamento
  tentativas_reengajamento INTEGER DEFAULT 0,     -- quantas vezes tentamos
  ultima_tentativa_reengajamento TEXT,            -- última tentativa
  melhor_horario_contato TEXT,                    -- horário que respondeu antes
  canal_preferido TEXT DEFAULT 'whatsapp'         -- whatsapp, instagram, email
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_numero ON leads_perdidos(numero);
CREATE INDEX IF NOT EXISTS idx_status ON leads_perdidos(status);
CREATE INDEX IF NOT EXISTS idx_data_captura ON leads_perdidos(data_captura);
CREATE INDEX IF NOT EXISTS idx_motivo_perda ON leads_perdidos(motivo_perda);
CREATE INDEX IF NOT EXISTS idx_score_intencao ON leads_perdidos(score_intencao);
CREATE INDEX IF NOT EXISTS idx_enviado_reengajamento ON leads_perdidos(enviado_reengajamento);

-- Tabela de histórico de reengajamento
CREATE TABLE IF NOT EXISTS historico_reengajamento (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL,
  data_envio TEXT NOT NULL,
  tipo_mensagem TEXT,                             -- 'desconto', 'estoque', 'urgencia', 'personalizada'
  conteudo TEXT,                                  -- mensagem enviada
  resposta_cliente TEXT,                          -- resposta (se houve)
  data_resposta TEXT,
  resultado TEXT,                                 -- 'ignorou', 'viu', 'respondeu', 'comprou'
  FOREIGN KEY (lead_id) REFERENCES leads_perdidos(id)
);

-- Configurações de reengajamento automático
CREATE TABLE IF NOT EXISTS config_reengajamento (
  id INTEGER PRIMARY KEY CHECK (id = 1),        -- apenas uma configuração
  habilitado BOOLEAN DEFAULT 1,
  intervalo_horas INTEGER DEFAULT 168,           -- 7 dias
  max_tentativas INTEGER DEFAULT 3,
  horario_envio TEXT DEFAULT '09:00',            -- horário preferido
  mensagens_padrao TEXT                         -- JSON com templates
);

-- Inserir configuração padrão
INSERT OR IGNORE INTO config_reengajamento (id, mensagens_padrao) VALUES (1, '{
  "preco_alto": "Ei! O {{produto}} que você viu tá R$ {{desconto}} mais barato hoje! ⏰ Corre que acaba: {{link}}",
  "duvida_estoque": "Boa notícia! Chegou mais {{produto}} no tamanho {{interesse}}. Reserva o seu? {{link}}",
  "atendimento": "Oi! Agora tô aqui 24h por dia. O que precisa sobre o {{produto}}? {{link}}",
  "so_consulta": "Lembrou do {{produto}}? Fizemos melhorias no frete grátis! {{link}}",
  "urgencia": "FLASH SALE! 40% OFF em {{produto}} - só hoje! Não perde: {{link}}"
}');

-- Views úteis para analytics
CREATE VIEW IF NOT EXISTS leads_por_motivo AS
SELECT
  motivo_perda,
  COUNT(*) as total,
  AVG(score_intencao) as media_score,
  SUM(valor_perdido) as valor_total_perdido
FROM leads_perdidos
WHERE motivo_perda IS NOT NULL
GROUP BY motivo_perda
ORDER BY total DESC;

CREATE VIEW IF NOT EXISTS performance_reengajamento AS
SELECT
  hr.tipo_mensagem,
  COUNT(*) as total_enviado,
  SUM(CASE WHEN hr.resultado = 'comprou' THEN 1 ELSE 0 END) as total_vendas,
  ROUND(
    SUM(CASE WHEN hr.resultado = 'comprou' THEN 1 ELSE 0 END) * 100.0 / COUNT(*),
    2
  ) as taxa_conversao_percentual
FROM historico_reengajamento hr
GROUP BY hr.tipo_mensagem;