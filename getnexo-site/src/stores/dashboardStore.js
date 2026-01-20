import { atom, map } from 'nanostores';

// Sidebar State (Persisted via localStorage in Layout, sync here for React islands)
export const isSidebarExpanded = atom(true);

// Global Notification Count
export const notificationCount = atom(3);

// Real-time Alerts Map
export const systemAlerts = map({
    whatsapp: 'online', // online, connecting, offline
    meta: 'stable',
    database: 'healthy'
});

// Actions
export function toggleSidebar() {
    isSidebarExpanded.set(!isSidebarExpanded.get());
}

export function setAlertStatus(service, status) {
    systemAlerts.setKey(service, status);
}

export function clearNotifications() {
    notificationCount.set(0);
}
