import React, { useState } from 'react';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

export default function WebAuthnSetup() {
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        try {
            setMessage('Iniciando registro...');

            // Get registration options from server
            const resp = await fetch('/api/webauthn/register');
            const options = await resp.json();

            if (!resp.ok) {
                throw new Error(options.error || 'Failed to get registration options');
            }

            // Start registration
            const credential = await startRegistration(options);

            // Send credential to server
            const verifyResp = await fetch('/api/webauthn/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credential)
            });

            const result = await verifyResp.json();

            if (result.success) {
                setMessage('Biometria registrada com sucesso!');
            } else {
                setMessage('Erro no registro: ' + result.error);
            }
        } catch (error) {
            setMessage('Erro: ' + error.message);
        }
    };

    const handleAuthenticate = async () => {
        try {
            setMessage('Iniciando autenticação...');

            // Get authentication options from server
            const resp = await fetch('/api/webauthn/authenticate');
            const options = await resp.json();

            if (!resp.ok) {
                throw new Error(options.error || 'Failed to get authentication options');
            }

            // Start authentication
            const credential = await startAuthentication(options);

            // Send credential to server
            const verifyResp = await fetch('/api/webauthn/authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credential)
            });

            const result = await verifyResp.json();

            if (result.success) {
                setMessage('Autenticação biométrica bem-sucedida!');
            } else {
                setMessage('Erro na autenticação: ' + result.error);
            }
        } catch (error) {
            setMessage('Erro: ' + error.message);
        }
    };

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Configuração de Biometria</h3>
            <div className="space-y-3">
                <button
                    onClick={handleRegister}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                    Registrar Biometria
                </button>
                <button
                    onClick={handleAuthenticate}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                >
                    Autenticar com Biometria
                </button>
            </div>
            {message && (
                <div className="mt-4 p-3 bg-gray-100 rounded">
                    {message}
                </div>
            )}
        </div>
    );
}