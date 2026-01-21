import { Server } from 'socket.io';
import { createServer } from 'http';
import { startAlertMonitoring } from './lib/alerts.js';

let io;

export function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Join user room for private messages
        socket.on('join', (userId) => {
            socket.join(`user_${userId}`);
        });

        // Join project room for collaboration
        socket.on('join-project', (projectId) => {
            socket.join(`project-${projectId}`);
        });

        // Chat messages
        socket.on('chat_message', (data) => {
            io.to(`user_${data.to}`).emit('chat_message', {
                from: data.from,
                message: data.message,
                timestamp: new Date()
            });
        });

        // Notifications
        socket.on('send_notification', (data) => {
            io.to(`user_${data.userId}`).emit('notification', {
                type: data.type,
                message: data.message,
                timestamp: new Date()
            });
        });

        // Real-time updates for orders
        socket.on('order_update', (data) => {
            io.to(`user_${data.userId}`).emit('order_update', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    // Iniciar monitoramento de alertas
    startAlertMonitoring();

    return io;
}

export function getIO() {
    if (!io) {
        throw new Error('Socket.IO not initialized');
    }
    return io;
}