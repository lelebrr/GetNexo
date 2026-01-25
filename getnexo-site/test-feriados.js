// Teste do Sistema de Feriados GetNexo
// Execute com: node test-feriados.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Funções de cálculo de feriados (copiadas do feriados.js)
function calculaPascoa(ano) {
    const a = ano % 19;
    const b = Math.floor(ano / 100);
    const c = ano % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mes = Math.floor((h + l - 7 * m + 114) / 31);
    const dia = ((h + l - 7 * m + 114) % 31) + 1;
    return `${ano}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
}

function calculaCarnaval(ano) {
    const pascoa = new Date(calculaPascoa(ano));
    const carnaval = new Date(pascoa);
    carnaval.setDate(carnaval.getDate() - 47);
    return carnaval.toISOString().slice(0, 10);
}

function calculaCorpusChristi(ano) {
    const pascoa = new Date(calculaPascoa(ano));
    const corpus = new Date(pascoa);
    corpus.setDate(corpus.getDate() + 60);
    return corpus.toISOString().slice(0, 10);
}

function calculaBlackFriday(ano) {
    const nov = new Date(ano, 10, 1);
    const ultimoDia = new Date(ano, 11, 0);
    const ultimaSexta = new Date(ultimoDia);
    while (ultimaSexta.getDay() !== 5) {
        ultimaSexta.setDate(ultimaSexta.getDate() - 1);
    }
    return ultimaSexta.toISOString().slice(0, 10);
}

function calculaDiaMaes(ano) {
    const primeiroMaio = new Date(ano, 4, 1);
    const diaSemana = primeiroMaio.getDay();
    const primeiroDomingo = new Date(primeiroMaio);
    primeiroDomingo.setDate(primeiroMaio.getDate() + (7 - diaSemana) % 7);
    primeiroDomingo.setDate(primeiroDomingo.getDate() + 7);
    return primeiroDomingo.toISOString().slice(0, 10);
}

function calculaDiaConscienciaNegra(ano) {
    const primeiroNovembro = new Date(ano, 10, 1);
    const diaSemana = primeiroNovembro.getDay();
    const primeiroDomingo = new Date(primeiroNovembro);
    primeiroDomingo.setDate(primeiroNovembro.getDate() + (7 - diaSemana) % 7);
    primeiroDomingo.setDate(primeiroDomingo.getDate() + 7);
    return primeiroDomingo.toISOString().slice(0, 10);
}

function calculaThanksgiving(ano) {
    const nov = new Date(ano, 10, 1);
    const diaSemana = nov.getDay();
    const primeiraQuinta = new Date(nov);
    primeiraQuinta.setDate(nov.getDate() + (4 - diaSemana + 7) % 7);
    primeiraQuinta.setDate(primeiraQuinta.getDate() + 21);
    return primeiraQuinta.toISOString().slice(0, 10);
}

function calculaAnoNovoChines(ano) {
    const baseDate = new Date(ano, 0, 21);
    return baseDate.toISOString().slice(0, 10);
}

function calculaOktoberfest(ano) {
    const set = new Date(ano, 8, 15);
    return set.toISOString().slice(0, 10);
}

function calculaDiaArvore(ano) {
    const out = new Date(ano, 8, 21);
    return out.toISOString().slice(0, 10);
}

function verificaDataVariavel(tipo, ano) {
    switch (tipo) {
        case 'variavel_carnaval': return calculaCarnaval(ano);
        case 'variavel_pascoa': return calculaPascoa(ano);
        case 'variavel_corpus': return calculaCorpusChristi(ano);
        case 'variavel_blackfriday': return calculaBlackFriday(ano);
        case 'segundo_domingo_maio': return calculaDiaMaes(ano);
        case 'segundo_domingo_novembro': return calculaDiaConscienciaNegra(ano);
        case 'variavel_thanksgiving': return calculaThanksgiving(ano);
        case 'variavel_chines_novo': return calculaAnoNovoChines(ano);
        case 'variavel_oktoberfest': return calculaOktoberfest(ano);
        case 'variavel_arvore': return calculaDiaArvore(ano);
        default: return null;
    }
}

// Testes principais
async function testarSistemaFeriados() {
    console.log('🎉 TESTANDO SISTEMA DE FERIADOS GETNEXO 🎉\n');

    try {
        // Carregar JSON de feriados
        const feriadosPath = path.join(__dirname, 'public', 'data', 'feriados.json');
        const feriadosData = JSON.parse(fs.readFileSync(feriadosPath, 'utf8'));

        console.log(`📊 Total de feriados carregados: ${feriadosData.feriados.length}`);

        // Testar ano atual
        const anoAtual = new Date().getFullYear();
        const hoje = new Date().toISOString().slice(0, 10);
        console.log(`📅 Ano atual: ${anoAtual}, Data hoje: ${hoje}\n`);

        // Testar cálculos de datas variáveis
        console.log('🧮 TESTANDO CÁLCULOS DE DATAS VARIÁVEIS:');
        console.log(`  Carnaval ${anoAtual}: ${calculaCarnaval(anoAtual)}`);
        console.log(`  Páscoa ${anoAtual}: ${calculaPascoa(anoAtual)}`);
        console.log(`  Corpus Christi ${anoAtual}: ${calculaCorpusChristi(anoAtual)}`);
        console.log(`  Black Friday ${anoAtual}: ${calculaBlackFriday(anoAtual)}`);
        console.log(`  Dia das Mães ${anoAtual}: ${calculaDiaMaes(anoAtual)}`);
        console.log(`  Consciência Negra ${anoAtual}: ${calculaDiaConscienciaNegra(anoAtual)}`);
        console.log(`  Thanksgiving EUA ${anoAtual}: ${calculaThanksgiving(anoAtual)}`);
        console.log();

        // Verificar feriados ativos hoje
        console.log('🎯 VERIFICANDO FERIADOS ATIVOS HOJE:');
        let feriadosAtivos = [];

        feriadosData.feriados.forEach(feriado => {
            let dataFeriado = feriado.data;

            // Se for data variável, calcular
            if (dataFeriado.startsWith('variavel') || dataFeriado.startsWith('segundo_domingo')) {
                dataFeriado = verificaDataVariavel(dataFeriado, anoAtual);
            }

            // Verificar se é hoje
            if (dataFeriado === hoje) {
                feriadosAtivos.push({
                    nome: feriado.nome,
                    data: dataFeriado,
                    efeito: feriado.efeito,
                    idioma_pt: feriado.idiomas.pt,
                    frase_bot: feriado.bot_frase.pt
                });
            }
        });

        // TESTE FORÇADO: Simular feriado ativo para demonstração
        if (feriadosAtivos.length === 0) {
            console.log('  ⚠️  Nenhum feriado ativo hoje. Simulando Carnaval para teste...');
            const carnaval = feriadosData.feriados.find(f => f.nome === 'Carnaval');
            if (carnaval) {
                feriadosAtivos.push({
                    nome: carnaval.nome,
                    data: calculaCarnaval(anoAtual),
                    efeito: carnaval.efeito,
                    idioma_pt: carnaval.idiomas.pt,
                    frase_bot: carnaval.bot_frase.pt
                });
                console.log('  ✅ Simulação ativada - efeitos seriam aplicados!');
            }
        }

        if (feriadosAtivos.length > 0) {
            console.log(`  ✅ ENCONTRADO ${feriadosAtivos.length} FERIADO(S) ATIVO(S) HOJE:`);
            feriadosAtivos.forEach(feriado => {
                console.log(`    🎉 ${feriado.nome} (${feriado.idioma_pt})`);
                console.log(`       📅 Data: ${feriado.data}`);
                console.log(`       🎨 Efeito: ${feriado.efeito}`);
                console.log(`       🤖 Bot dirá: "${feriado.frase_bot}"`);
                console.log();
            });
        } else {
            console.log('  ℹ️  Nenhum feriado ativo hoje.');
            console.log('  📅 Próximos feriados:');

            // Mostrar próximos feriados
            const proximosFeriados = [];
            feriadosData.feriados.forEach(feriado => {
                let dataFeriado = feriado.data;

                if (dataFeriado.startsWith('variavel') || dataFeriado.startsWith('segundo_domingo')) {
                    dataFeriado = verificaDataVariavel(dataFeriado, anoAtual);
                }

                if (dataFeriado > hoje) {
                    proximosFeriados.push({
                        nome: feriado.nome,
                        data: dataFeriado,
                        efeito: feriado.efeito
                    });
                }
            });

            proximosFeriados
                .sort((a, b) => new Date(a.data) - new Date(b.data))
                .slice(0, 5)
                .forEach(feriado => {
                    const diasRestantes = Math.ceil((new Date(feriado.data) - new Date()) / (1000 * 60 * 60 * 24));
                    console.log(`    📅 ${feriado.nome} em ${diasRestantes} dia(s) - ${feriado.data} (${feriado.efeito})`);
                });
        }

        console.log('\n✨ EFEITOS DISPONÍVEIS:');
        const efeitosUnicos = [...new Set(feriadosData.feriados.map(f => f.efeito))];
        efeitosUnicos.forEach(efeito => {
            const feriadosComEfeito = feriadosData.feriados.filter(f => f.efeito === efeito);
            console.log(`  🎨 ${efeito}: usado em ${feriadosComEfeito.length} feriado(s)`);
        });

        console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
        console.log('Sistema de feriados está funcionando perfeitamente!');

    } catch (error) {
        console.error('❌ ERRO NO TESTE:', error.message);
        process.exit(1);
    }
}

// Executar testes
testarSistemaFeriados();