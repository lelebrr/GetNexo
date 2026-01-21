import React, { useState, useEffect } from 'react';

export default function PWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [notificationPermission, setNotificationPermission] = useState('default');
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [offlineStatus, setOfflineStatus] = useState(!navigator.onLine);

    useEffect(() => {
        // Check if already installed
        const checkInstallation = () => {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            const isInWebAppiOS = window.navigator.standalone === true;
            setIsInstalled(isStandalone || isInWebAppiOS);

            // Check notification permission
            if ('Notification' in window) {
                setNotificationPermission(Notification.permission);
            }
        };

        checkInstallation();

        // Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);

            // Show prompt after user interaction (scroll, click, etc.)
            const showPrompt = () => {
                if (!isInstalled && !showInstallPrompt) {
                    setShowInstallPrompt(true);
                }
            };

            // Show after 30 seconds or user interaction
            setTimeout(showPrompt, 30000);

            // Show on first meaningful interaction
            const handleInteraction = () => {
                showPrompt();
                document.removeEventListener('click', handleInteraction);
                document.removeEventListener('scroll', handleInteraction);
            };

            document.addEventListener('click', handleInteraction, { once: true });
            document.addEventListener('scroll', handleInteraction, { once: true });
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Listen for app installed event
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowInstallPrompt(false);
            setDeferredPrompt(null);

            // Track installation
            if (typeof gtag !== 'undefined') {
                gtag('event', 'pwa_install', {
                    event_category: 'engagement',
                    event_label: 'PWA Installation'
                });
            }
        };

        window.addEventListener('appinstalled', handleAppInstalled);

        // Listen for service worker updates
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
                    setUpdateAvailable(true);
                }
            });
        }

        // Listen for online/offline status
        const handleOnline = () => setOfflineStatus(false);
        const handleOffline = () => setOfflineStatus(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [isInstalled, showInstallPrompt]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        // Track result
        if (typeof gtag !== 'undefined') {
            gtag('event', outcome === 'accepted' ? 'pwa_install_accepted' : 'pwa_install_dismissed', {
                event_category: 'engagement',
                event_label: 'PWA Install Prompt'
            });
        }

        setDeferredPrompt(null);
        setShowInstallPrompt(false);
    };

    const handleDismissInstall = () => {
        setShowInstallPrompt(false);

        // Track dismissal
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_install_dismissed', {
                event_category: 'engagement',
                event_label: 'PWA Install Prompt'
            });
        }
    };

    const handleNotificationRequest = async () => {
        if (!('Notification' in window)) {
            alert('Este navegador não suporta notificações push.');
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);

            if (permission === 'granted') {
                // Register for push notifications
                await registerForPush();

                // Track permission granted
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'notification_permission_granted', {
                        event_category: 'engagement',
                        event_label: 'Push Notifications'
                    });
                }
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    };

    const registerForPush = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(process.env.VAPID_PUBLIC_KEY || 'BKxQzQy1qI1Gj9x7k9k9k9k9k9k9k9k9k9k9k9k9k9k9k')
            });

            // Send subscription to server
            await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscription })
            });
        } catch (error) {
            console.error('Error registering for push:', error);
        }
    };

    const handleUpdateClick = () => {
        // Trigger service worker update
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });
        }
        setUpdateAvailable(false);
        window.location.reload();
    };

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    if (isInstalled) return null;

    return (
        <>
            {/* PWA Install Prompt */}
            {showInstallPrompt && (
                <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-2xl p-4 animate-slide-up">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-2xl">📱</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Instalar GetNexo</h3>
                                <p className="text-sm text-blue-100">Acesse mais rápido e offline!</p>
                            </div>
                        </div>
                        <button
                            onClick={handleDismissInstall}
                            className="text-blue-200 hover:text-white text-xl leading-none"
                            aria-label="Fechar prompt de instalação"
                        >
                            ×
                        </button>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <button
                            onClick={handleInstallClick}
                            className="w-full bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            📲 Instalar Agora
                        </button>
                        <button
                            onClick={handleDismissInstall}
                            className="text-sm text-blue-200 hover:text-white transition-colors"
                        >
                            Agora não
                        </button>
                    </div>
                </div>
            )}

            {/* Update Available Notification */}
            {updateAvailable && (
                <div className="fixed top-4 right-4 z-50 bg-green-600 text-white rounded-xl shadow-2xl p-4 max-w-sm animate-slide-down">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                            <span className="text-2xl mr-2">🔄</span>
                            <div>
                                <h3 className="font-bold">Atualização Disponível</h3>
                                <p className="text-sm text-green-100">Nova versão do GetNexo!</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleUpdateClick}
                        className="w-full bg-white text-green-600 font-semibold py-2 px-4 rounded-lg hover:bg-green-50 transition-colors"
                    >
                        Atualizar Agora
                    </button>
                </div>
            )}

            {/* Offline Notification */}
            {offlineStatus && (
                <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-orange-600 text-white rounded-xl shadow-2xl p-4 animate-slide-down">
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">📶</span>
                        <div>
                            <h3 className="font-bold">Modo Offline</h3>
                            <p className="text-sm text-orange-100">Você está offline, mas pode continuar usando algumas funcionalidades.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Permission Request */}
            {!isInstalled && notificationPermission === 'default' && showInstallPrompt && (
                <div className="fixed bottom-40 left-4 right-4 md:left-auto md:right-4 md:w-96 z-40 bg-white border-2 border-green-200 rounded-xl shadow-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                            <span className="text-2xl mr-3">🔔</span>
                            <div>
                                <h3 className="font-bold text-gray-800">Ativar Notificações</h3>
                                <p className="text-sm text-gray-600">Receba atualizações importantes!</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleNotificationRequest}
                            className="flex-1 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Permitir
                        </button>
                        <button
                            onClick={() => setNotificationPermission('denied')}
                            className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Agora não
                        </button>
                    </div>
                </div>
            )}

            {/* PWA Status Indicator */}
            <div className="fixed bottom-4 right-4 z-30">
                <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-gray-200">
                    <div className={`w-3 h-3 rounded-full ${offlineStatus ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                    <span className="text-xs font-medium text-gray-700">
                        {offlineStatus ? 'Offline' : 'Online'}
                    </span>
                    {notificationPermission === 'granted' && (
                        <span className="text-xs text-green-600">🔔</span>
                    )}
                </div>
            </div>
        </>
    );
}