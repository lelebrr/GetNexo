/**
 * API Client Utility
 * Handles internal API requests with automatic authentication headers
 */

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
        };

        if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(endpoint, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro na requisição API');
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};
