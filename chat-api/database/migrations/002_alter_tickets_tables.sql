-- Adicionar colunas à tabela tickets (SQLite não suporta IF NOT EXISTS em ALTER TABLE)
-- Verificar e adicionar colunas individualmente

-- customer_id
ALTER TABLE tickets ADD COLUMN customer_id INTEGER;

-- customer_name
ALTER TABLE tickets ADD COLUMN customer_name TEXT;

-- customer_phone
ALTER TABLE tickets ADD COLUMN customer_phone TEXT;

-- customer_email
ALTER TABLE tickets ADD COLUMN customer_email TEXT;

-- channel
ALTER TABLE tickets ADD COLUMN channel TEXT DEFAULT 'whatsapp';

-- assigned_agent_id
ALTER TABLE tickets ADD COLUMN assigned_agent_id INTEGER;

-- assigned_agent_name
ALTER TABLE tickets ADD COLUMN assigned_agent_name TEXT;

-- human_agent
ALTER TABLE tickets ADD COLUMN human_agent BOOLEAN DEFAULT 0;

-- sentiment
ALTER TABLE tickets ADD COLUMN sentiment TEXT;

-- sentiment_score
ALTER TABLE tickets ADD COLUMN sentiment_score REAL;

-- last_message
ALTER TABLE tickets ADD COLUMN last_message TEXT;

-- last_message_at
ALTER TABLE tickets ADD COLUMN last_message_at DATETIME;

-- updated_at
ALTER TABLE tickets ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- closed_at
ALTER TABLE tickets ADD COLUMN closed_at DATETIME;

-- tags
ALTER TABLE tickets ADD COLUMN tags TEXT;

-- metadata
ALTER TABLE tickets ADD COLUMN metadata TEXT;

-- Atualizar dados existentes se necessário
UPDATE tickets SET customer_phone = phone WHERE customer_phone IS NULL;
UPDATE tickets SET assigned_agent_id = assigned_to WHERE assigned_agent_id IS NULL;

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_tickets_customer ON tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned ON tickets(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_tickets_closed ON tickets(closed_at);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_sentiment ON tickets(sentiment);

-- Criar índices para outras tabelas
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_created ON ticket_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_sender ON ticket_messages(sender_type);

CREATE INDEX IF NOT EXISTS idx_ticket_notes_ticket ON ticket_notes(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_notes_created ON ticket_notes(created_at);

CREATE INDEX IF NOT EXISTS idx_ticket_sentiments_ticket ON ticket_sentiments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_sentiments_detected ON ticket_sentiments(detected_at);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER IF NOT EXISTS update_tickets_updated_at 
AFTER UPDATE ON tickets
BEGIN
    UPDATE tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_ticket_notes_updated_at 
AFTER UPDATE ON ticket_notes
BEGIN
    UPDATE ticket_notes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
