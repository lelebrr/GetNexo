const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'admin_settings.json');

const initialSettings = {
    integrations: {
        whatsapp: { enabled: true, status: 'connected' },
        openai: { enabled: true, model: 'gpt-4' }
    },
    system: {
        brandName: 'Nexus Enterprise',
        primaryColor: '#00f7ff',
        secondaryColor: '#ffc400',
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        maintenanceMode: false
    },
    notifications: {
        email: { enabled: true, address: 'admin@getnexo.com' },
        push: { enabled: true }
    }
};

if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(initialSettings, null, 2));
    console.log('✅ Admin settings database initialized at:', dbPath);
} else {
    console.log('ℹ️ Admin settings database already exists.');
}
