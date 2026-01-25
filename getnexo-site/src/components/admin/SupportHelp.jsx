import React from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';
import { Select } from '../../design-system/components/AdminExtras';

const SupportHelp = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Ajuda e Suporte</h1>
                <p className="text-gray-400">Central de ajuda oficial GetNexo. Tutoriais, FAQs e suporte direto.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Direct Support */}
                <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        💬 Fale com o Suporte
                    </h2>
                    <p className="text-gray-400 mb-6 text-sm">
                        Nossa equipe especializada está disponível de Seg à Sex das 09h às 18h para resolver seus problemas técnicos.
                    </p>

                    <div className="space-y-4">
                        <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold flex justify-center items-center gap-2">
                            <span>📱</span> Chamar no WhatsApp
                        </Button>
                        <Button variant="secondary" className="w-full">
                            <span>📧</span> Abrir Ticket via Email
                        </Button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-800">
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Status do Sistema</h3>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-green-400 font-mono">Todos os sistemas operacionais</span>
                        </div>
                    </div>
                </Card>

                {/* FAQ & Knowledge Base */}
                <div className="space-y-6">
                    <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-6">
                        <h2 className="text-xl font-bold text-white mb-4">📚 Tutoriais Rápidos</h2>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 transition-colors group">
                                    <span className="p-2 bg-gray-800 rounded group-hover:bg-gray-700">▶️</span>
                                    <span>Como configurar seu primeiro bot</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 transition-colors group">
                                    <span className="p-2 bg-gray-800 rounded group-hover:bg-gray-700">▶️</span>
                                    <span>Integrando com WhatsApp Oficial</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 transition-colors group">
                                    <span className="p-2 bg-gray-800 rounded group-hover:bg-gray-700">▶️</span>
                                    <span>Criando campanhas de broadcast</span>
                                </a>
                            </li>
                        </ul>
                    </Card>

                    <Card style={{ background: '#111827', borderColor: '#1f2937' }} className="p-6">
                        <h2 className="text-xl font-bold text-white mb-4">❓ Perguntas Frequentes</h2>
                        <div className="space-y-4">
                            <details className="group">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-300 hover:text-white">
                                    <span>Como altero minha senha?</span>
                                    <span className="transition group-open:rotate-180">▼</span>
                                </summary>
                                <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                                    Vá em Configurações &gt; Perfil e clique em "Alterar Senha". Você receberá um email de confirmação.
                                </p>
                            </details>
                            <div className="h-px bg-gray-800"></div>
                            <details className="group">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-300 hover:text-white">
                                    <span>Onde vejo minhas faturas?</span>
                                    <span className="transition group-open:rotate-180">▼</span>
                                </summary>
                                <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                                    Acesse Configurações &gt; Billing para ver o histórico completo de pagamentos e fazer o download de NFs.
                                </p>
                            </details>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SupportHelp;
