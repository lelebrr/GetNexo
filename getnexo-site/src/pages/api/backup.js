import fs from 'fs';
import path from 'path';

export async function get({ request }) {
    try {
        // Simple backup system - export configs and basic data
        const backupData = {
            timestamp: new Date().toISOString(),
            version: '1.1',
            data: {
                globalConfigs: {},
                userConfigs: {},
                systemStats: {
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                    nodeVersion: process.version
                }
            }
        };

        // Try to load configs
        try {
            const globalConfigsPath = path.join(process.cwd(), 'globalConfigs.json');
            if (fs.existsSync(globalConfigsPath)) {
                backupData.data.globalConfigs = JSON.parse(fs.readFileSync(globalConfigsPath, 'utf8'));
            }
        } catch (error) {
            console.log('Error loading global configs for backup:', error);
        }

        try {
            const userConfigsPath = path.join(process.cwd(), 'userConfigs.json');
            if (fs.existsSync(userConfigsPath)) {
                backupData.data.userConfigs = JSON.parse(fs.readFileSync(userConfigsPath, 'utf8'));
            }
        } catch (error) {
            console.log('Error loading user configs for backup:', error);
        }

        // Return backup as JSON
        return new Response(JSON.stringify(backupData, null, 2), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': 'attachment; filename="getnexo_backup_' + new Date().toISOString().split('T')[0] + '.json"'
            }
        });

    } catch (error) {
        console.error('Backup API error:', error);
        return new Response(JSON.stringify({ error: 'Backup failed: ' + error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function post({ request }) {
    try {
        const backupData = await request.json();

        if (!backupData.data) {
            return new Response(JSON.stringify({ error: 'Invalid backup data' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Restore configs
        if (backupData.data.globalConfigs) {
            fs.writeFileSync('globalConfigs.json', JSON.stringify(backupData.data.globalConfigs, null, 2));
        }

        if (backupData.data.userConfigs) {
            fs.writeFileSync('userConfigs.json', JSON.stringify(backupData.data.userConfigs, null, 2));
        }

        return new Response(JSON.stringify({ success: true, message: 'Backup restored successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Restore API error:', error);
        return new Response(JSON.stringify({ error: 'Restore failed: ' + error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}