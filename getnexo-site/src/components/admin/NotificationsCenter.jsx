import React, { useState } from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';

const NotificationsCenter = () => {
    const [channels, setChannels] = useState({
        email: { enabled: true, address: 'admin@getnexo.com' },
        discord: { enabled: false, webhook: '' },
        slack: { enabled: false, webhook: '' },
        push: { enabled: true }
    });

    const [events, setEvents] = useState([
        { id: 'new_lead', name: 'Novo Lead Capturado', email: true, push: true, discord: false },
        { id: 'new_sale', name: 'Nova Venda Realizada', email: true, push: true, discord: true },
        { id: 'payment_fail', name: 'Falha no Pagamento', email: true, push: true, discord: false },
        { id: 'system_alert', name: 'Alerta de Sistema (Crítico)', email: true, push: true, discord: true }
    ]);

    const handleChannelToggle = (channel) => {
        setChannels(prev => ({
            ...prev,
            [channel]: { ...prev[channel], enabled: !prev[channel].enabled }
        }));
    };

    const handleEventToggle = (eventId, channel) => {
        setEvents(events.map(event =>
            event.id === eventId ? { ...event, [channel]: !event[channel] } : event
        ));
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-white mb-2">🔔 Central de Notificações</h1>
                <p className="text-gray-400">Configure como e quando você e sua equipe são alertados.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Canais de Notificação */}
                <div className="lg:col-span-1 space-y-6">
                    <h2 className="text-lg font-bold text-[#ffc400] uppercase tracking-wider">Canais de Entrega</h2>

                    <Card className="p-4 bg-gray-900 border border-gray-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white flex items-center gap-2"><span className="text-xl">📧</span> Email Admin</h3>
                            <input type="checkbox" checked={channels.email.enabled} onChange={() => handleChannelToggle('email')} className="accent-cyan-500" />
                        </div>
                        {channels.email.enabled && (
                            <Input value={channels.email.address} onChange={(e) => setChannels({ ...channels, email: { ...channels.email, address: e.target.value } })} placeholder="email@admin.com" />
                        )}
                    </Card>

                    <Card className="p-4 bg-gray-900 border border-gray-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white flex items-center gap-2"><span className="text-xl">👾</span> Discord Webhook</h3>
                            <input type="checkbox" checked={channels.discord.enabled} onChange={() => handleChannelToggle('discord')} className="accent-cyan-500" />
                        </div>
                        {channels.discord.enabled && (
                            <Input value={channels.discord.webhook} onChange={(e) => setChannels({ ...channels, discord: { ...channels.discord, webhook: e.target.value } })} placeholder="https://discord.com/api/webhooks/..." />
                        )}
                    </Card>

                    <Card className="p-4 bg-gray-900 border border-gray-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white flex items-center gap-2"><span className="text-xl">📱</span> Browser Push</h3>
                            <input type="checkbox" checked={channels.push.enabled} onChange={() => handleChannelToggle('push')} className="accent-cyan-500" />
                        </div>
                        <p className="text-xs text-gray-500">Notificações nativas do navegador quando o painel estiver aberto.</p>
                    </Card>
                </div>

                {/* Matriz de Eventos */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-lg font-bold text-[#ffc400] uppercase tracking-wider">Matriz de Eventos</h2>

                    <Card className="bg-gray-900 border border-gray-800 p-0 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-bold">Evento</th>
                                    <th className="p-4 text-center w-24">Email</th>
                                    <th className="p-4 text-center w-24">Push</th>
                                    <th className="p-4 text-center w-24">Discord</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {events.map((event) => (
                                    <tr key={event.id} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 font-bold text-white">{event.name}</td>
                                        <td className="p-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={event.email}
                                                onChange={() => handleEventToggle(event.id, 'email')}
                                                disabled={!channels.email.enabled}
                                                className="accent-cyan-500 h-4 w-4"
                                            />
                                        </td>
                                        <td className="p-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={event.push}
                                                onChange={() => handleEventToggle(event.id, 'push')}
                                                disabled={!channels.push.enabled}
                                                className="accent-cyan-500 h-4 w-4"
                                            />
                                        </td>
                                        <td className="p-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={event.discord}
                                                onChange={() => handleEventToggle(event.id, 'discord')}
                                                disabled={!channels.discord.enabled}
                                                className="accent-cyan-500 h-4 w-4"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="p-4 bg-gray-800/50 flex justify-end">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6">Salvar Preferências</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default NotificationsCenter;
