import { handler as ssrHandler } from './dist/server/entry.mjs';
import { initSocket } from './server.js';

export const handler = (req, res) => {
    // Initialize Socket.IO if not already done
    if (!global.io && req.socket.server) {
        global.io = initSocket(req.socket.server);
    }

    return ssrHandler(req, res);
};