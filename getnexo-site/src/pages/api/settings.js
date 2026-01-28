/**
 * Settings API - Manages system configuration
 * GET: Retrieves current settings
 * POST: Updates settings
 */

import fs from 'fs/promises';
import path from 'path';

// Settings file path
const SETTINGS_PATH = path.join(process.cwd(), 'settings.json');

// Default settings
const DEFAULT_SETTINGS = {
    store_name: 'Minha Loja GetNexo',
    base_url: 'https://getnexo.com.br',
    seo_description: 'Plataforma de automação de vendas pelo WhatsApp',
    maintenance_mode: 'false',
    debug_mode: 'false',
    timezone: 'America/Sao_Paulo',
    updatedAt: new Date().toISOString()
};

// Helper to read settings
async function readSettings() {
    try {
        const data = await fs.readFile(SETTINGS_PATH, 'utf8');
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (e) {
        // Return defaults if file doesn't exist
        return DEFAULT_SETTINGS;
    }
}

// Helper to write settings
async function writeSettings(settings) {
    await fs.writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2));
}

export async function GET({ request }) {
    try {
        const settings = await readSettings();

        return new Response(JSON.stringify(settings), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error in GET /api/settings:', error);
        return new Response(JSON.stringify({ error: 'Erro ao carregar configurações' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function POST({ request }) {
    try {
        const body = await request.json();
        const { settings: newSettings } = body;

        if (!newSettings || typeof newSettings !== 'object') {
            return new Response(JSON.stringify({ error: 'Dados inválidos' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Read current settings
        const currentSettings = await readSettings();

        // Merge with new settings
        const updatedSettings = {
            ...currentSettings,
            ...newSettings,
            updatedAt: new Date().toISOString()
        };

        // Write settings
        await writeSettings(updatedSettings);

        return new Response(JSON.stringify({
            message: 'Configurações salvas com sucesso',
            settings: updatedSettings
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error in POST /api/settings:', error);
        return new Response(JSON.stringify({ error: 'Erro ao salvar configurações' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
