
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080'
    : 'https://api.getnexo.com.br';

const MeetingScheduler = ({ contact, onClose, onScheduled }) => {
    const [summary, setSummary] = useState(`Reunião com ${contact.name || contact.phone}`);
    const [description, setDescription] = useState('Conversa sobre GetNexo');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState(30);
    const [loading, setLoading] = useState(false);

    const handleSchedule = async (e) => {
        e.preventDefault();
        if (!date || !time) return alert('Selecione data e hora');

        setLoading(true);
        try {
            const startTime = new Date(`${date}T${time}:00`);
            const endTime = new Date(startTime.getTime() + duration * 60000);

            const res = await axios.post(`${API_URL}/api/integrations/calendar/schedule`, {
                summary,
                description,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                attendees: [contact.email].filter(Boolean)
            });

            if (res.data.ok) {
                alert('Reunião agendada com sucesso!');
                onScheduled(`📅 Reunião Agendada: ${summary}\nData: ${date} às ${time}\nLink: ${res.data.link}`);
                onClose();
            }
        } catch (err) {
            console.error(err);
            alert('Falha ao agendar. Verifique as configurações do Google Calendar no Admin Panel.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-zoom-in">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/20">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span>📅</span> Agendar Reunião
                    </h3>
                    <button onClick={onClose} aria-label="Fechar" className="text-gray-500 hover:text-white transition-colors text-2xl focus-visible:ring-2 focus-visible:outline-none rounded">✕</button>
                </div>

                <form onSubmit={handleSchedule} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assunto</label>
                        <input
                            value={summary}
                            onChange={e => setSummary(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-neon-blue"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data</label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-neon-blue color-scheme-dark"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hora</label>
                            <input
                                type="time"
                                value={time}
                                onChange={e => setTime(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-neon-blue color-scheme-dark"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duração (minutos)</label>
                        <select
                            value={duration}
                            onChange={e => setDuration(Number(e.target.value))}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-neon-blue"
                        >
                            <option value={15}>15 minutos</option>
                            <option value={30}>30 minutos</option>
                            <option value={45}>45 minutos</option>
                            <option value={60}>1 hora</option>
                        </select>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-black transition-all transform active:scale-95 ${loading ? 'bg-gray-700' : 'bg-neon-blue hover:bg-white shadow-[0_0_20px_rgba(0,212,255,0.3)]'}`}
                        >
                            {loading ? 'AGENDANDO...' : 'CONFIRMAR AGENDAMENTO'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MeetingScheduler;
