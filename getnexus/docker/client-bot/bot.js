const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server, {
    cors: { origin: "*" }
});

// Ensure data dir exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const db = new sqlite3.Database(path.join(dataDir, 'db.sqlite'));

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY,
        sender TEXT,
        text TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

const CLIENT_SITE = process.env.CLIENT_SITE;
const PIX_KEY = process.env.PIX_KEY;
const IA_MODEL = process.env.IA_MODEL || 'deepseek-lite';

app.get('/health', (req, res) => {
    res.json({ status: 'ok', memory: process.memoryUsage(), uptime: process.uptime() });
});

io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('message', (msg) => {
        db.run("INSERT INTO messages (sender, text) VALUES (?, ?)", ['user', msg]);

        const reply = IA_MODEL === 'deepseek-lite'
            ? `Oi! Seu PIX é ${PIX_KEY}. Quer ajuda?`
            : `Entendi: "${msg}". Site: ${CLIENT_SITE}`;

        socket.emit('reply', reply);

        db.run("INSERT INTO messages (sender, text) VALUES (?, ?)", ['bot', reply]);
    });

    socket.on('disconnect', () => {
        console.log('Cliente saiu');
    });
});

server.listen(3000, () => {
    console.log('🔥 Bot rodando na porta 3000 (interno)');
});
