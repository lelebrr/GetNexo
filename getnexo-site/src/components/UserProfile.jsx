import React, { useState, useEffect } from 'react';

export default function UserProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/profile');
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            } else {
                setMessage('Erro ao carregar perfil');
            }
        } catch (error) {
            setMessage('Erro de conexão');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');

        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            });

            if (response.ok) {
                setMessage('Perfil salvo com sucesso!');
            } else {
                setMessage('Erro ao salvar perfil');
            }
        } catch (error) {
            setMessage('Erro de conexão');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field, value) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePreferenceChange = (field, value) => {
        setProfile(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [field]: value
            }
        }));
    };

    if (loading) return <div>Carregando...</div>;
    if (!profile) return <div>Erro ao carregar perfil</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Perfil do Usuário</h2>

            <div className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center space-x-4">
                    <img
                        src={profile.avatar || '/default-avatar.png'}
                        alt="Avatar"
                        className="w-16 h-16 rounded-full"
                    />
                    <div>
                        <label htmlFor="avatarUrl" className="block text-sm font-medium mb-1">URL do Avatar</label>
                        <input
                            id="avatarUrl"
                            type="url"
                            value={profile.avatar || ''}
                            onChange={(e) => handleChange('avatar', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Nome</label>
                        <input
                            id="name"
                            type="text"
                            value={profile.name || ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={profile.email || ''}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                    </div>
                </div>

                {/* Bio */}
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium mb-1">Biografia</label>
                    <textarea
                        id="bio"
                        value={profile.bio || ''}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Conte um pouco sobre você..."
                    />
                </div>

                {/* Preferences */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Preferências</h3>

                    <div>
                        <label htmlFor="theme" className="block text-sm font-medium mb-1">Tema</label>
                        <select
                            id="theme"
                            value={profile.preferences?.theme || 'light'}
                            onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="light">Claro</option>
                            <option value="dark">Escuro</option>
                            <option value="auto">Automático</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="language" className="block text-sm font-medium mb-1">Idioma</label>
                        <select
                            id="language"
                            value={profile.preferences?.language || 'pt-BR'}
                            onChange={(e) => handlePreferenceChange('language', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="pt-BR">Português (BR)</option>
                            <option value="en">English</option>
                            <option value="es">Español</option>
                        </select>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="notifications"
                            checked={profile.preferences?.notifications ?? true}
                            onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="notifications" className="text-sm">Receber notificações</label>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        {saving ? 'Salvando...' : 'Salvar Perfil'}
                    </button>
                </div>

                {message && (
                    <div className={`p-3 rounded-md ${message.includes('sucesso') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}