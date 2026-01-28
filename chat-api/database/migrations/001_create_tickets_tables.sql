-- Tabela de Tickets/Conversas
CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    channel TEXT NOT NULL, -- 'whatsapp', 'telegram', 'instagram', 'facebook', etc.
    status TEXT NOT NULL DEFAULT 'open', -- 'open', 'waiting', 'closed', 'priority'
    priority INTEGER DEFAULT 0, -- 0=normal, 1=alta, 2=urgente
    assigned_agent_id INTEGER,
    assigned_agent_name TEXT,
    human_agent BOOLEAN DEFAULT 0, -- 0=bot, 1=humano
    sentiment TEXT, -- 'positive', 'negative', 'neutral', 'mixed'
    sentiment_score REAL,
    last_message TEXT,
    last_message_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    closed_at DATETIME,
    tags TEXT, -- JSON array de tags
    metadata TEXT -- JSON object com metadados adicionais
);

-- Tabela de Mensagens do Ticket
CREATE TABLE IF NOT EXISTS ticket_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL,
    sender_id INTEGER, -- ID do remetente (pode ser cliente ou agente)
    sender_name TEXT,
    sender_type TEXT NOT NULL, -- 'customer', 'agent', 'bot'
    message_type TEXT NOT NULL, -- 'text', 'image', 'audio', 'video', 'document', 'location'
    content TEXT NOT NULL,
    media_url TEXT,
    media_type TEXT,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- Tabela de Notas Internas
CREATE TABLE IF NOT EXISTS ticket_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL,
    agent_id INTEGER NOT NULL,
    agent_name TEXT NOT NULL,
    note TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT 1, -- 1=nota interna, 0=visível ao cliente
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- Tabela de Sentimentos (histórico)
CREATE TABLE IF NOT EXISTS ticket_sentiments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL,
    sentiment TEXT NOT NULL,
    sentiment_score REAL,
    detected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    message_id INTEGER,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (message_id) REFERENCES ticket_messages(id) ON DELETE SET NULL
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_customer ON tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned ON tickets(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_tickets_closed ON tickets(closed_at);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_sentiment ON tickets(sentiment);

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
