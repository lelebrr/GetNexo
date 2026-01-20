import { useState } from 'react';

export default function CTA() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic from previous iteration
        alert('Acesso liberado. Rodando em 3... 2... 1...');
    };

    return (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col md:flex-row gap-0 max-w-lg mx-auto">
            <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-t-xl md:rounded-l-xl md:rounded-tr-none bg-white text-black border-2 border-transparent focus:border-red-600 focus:outline-none transition-all placeholder:text-gray-500"
                required
            />
            <button
                type="submit"
                className="p-4 bg-red-600 text-white font-bold rounded-b-xl md:rounded-r-xl md:rounded-bl-none hover:bg-red-700 hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
            >
                Começar agora
            </button>
        </form>
    );
}
