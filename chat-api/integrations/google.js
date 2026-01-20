const { google } = require('googleapis');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const db = global.dbInstance;

// --- Helper: Get Google Auth ---
const getGoogleAuth = (config) => {
    // config should contain service account json structure
    return new JWT({
        email: config.client_email,
        key: config.private_key,
        scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/calendar',
        ],
    });
};

// --- GOOGLE SHEETS ---
const exportToSheet = async (leadData) => {
    try {
        const row = db.prepare("SELECT config FROM integrations_config WHERE id = 'google_sheets' AND enabled = 1").get();
        if (!row) return;

        const config = JSON.parse(row.config); // { sheet_id: '...', service_account: { ... } }
        if (!config.sheet_id || !config.service_account) return;

        const serviceAccountAuth = getGoogleAuth(config.service_account);
        const doc = new GoogleSpreadsheet(config.sheet_id, serviceAccountAuth);

        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0]; // Assume first sheet

        // Map leadData to Headers if needed, or just dump
        await sheet.addRow(leadData);
        console.log(`[SHEETS] Added lead to sheet: ${config.sheet_id}`);

    } catch (e) {
        console.error('[SHEETS] Export failed:', e.message);
    }
};

// --- GOOGLE CALENDAR ---
const scheduleMeeting = async (meetingData) => {
    try {
        const row = db.prepare("SELECT config FROM integrations_config WHERE id = 'google_calendar' AND enabled = 1").get();
        if (!row) throw new Error('Google Calendar not configured');

        const config = JSON.parse(row.config); // { calendar_id: 'primary', service_account: { ... } }
        const auth = getGoogleAuth(config.service_account);
        const calendar = google.calendar({ version: 'v3', auth });

        // meetingData: { summary, description, startTime, endTime, attendees: ['email@...'] }
        const event = {
            summary: meetingData.summary,
            description: meetingData.description,
            start: { dateTime: meetingData.startTime, timeZone: 'America/Sao_Paulo' },
            end: { dateTime: meetingData.endTime, timeZone: 'America/Sao_Paulo' },
            attendees: meetingData.attendees ? meetingData.attendees.map(e => ({ email: e })) : [],
        };

        const res = await calendar.events.insert({
            calendarId: config.calendar_id || 'primary',
            resource: event,
        });

        console.log(`[CALENDAR] Event created: ${res.data.htmlLink}`);
        return res.data;

    } catch (e) {
        console.error('[CALENDAR] Schedule failed:', e.message);
        throw e;
    }
};

module.exports = { exportToSheet, scheduleMeeting };
