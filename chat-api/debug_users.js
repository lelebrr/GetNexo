const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = '/data/omninchat.db'; // Docker path
// Or local path if running from host: '/home/lele/usenexo/data/chat-api/omninchat.db'

// We will run this via docker exec to be safe with paths
const db = new Database(dbPath);

console.log('--- Users in DB ---');
const users = db.prepare('SELECT id, email, role_id, password FROM users').all();
console.log(users);

if (users.length === 0) {
    console.log('No users found!');
} else {
    // Verify admin password
    const admin = users.find(u => u.email === 'admin@getnexo.com.br');
    if (admin) {
        console.log('Admin found. Testing password "admin123"...');
        const match = bcrypt.compareSync('admin123', admin.password);
        console.log('Password match:', match);

        if (!match) {
            console.log('Updating admin password to "admin123"...');
            const newHash = bcrypt.hashSync('admin123', 10);
            db.prepare('UPDATE users SET password = ? WHERE email = ?').run(newHash, 'admin@getnexo.com.br');
            console.log('Password updated.');
        }
    } else {
        console.log('Admin user NOT found.');
    }
}
