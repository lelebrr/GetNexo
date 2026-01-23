// Sistema de Cálculo de Datas de Feriados Festivos
// GetNexo - IA para WhatsApp e E-commerce

/**
 * Calcula a data da Páscoa usando o algoritmo de Meeus/Jones/Butcher
 * @param {number} ano - Ano para calcular
 * @returns {string} Data no formato YYYY-MM-DD
 */
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

/**
 * Calcula a data do Carnaval (47 dias antes da Páscoa)
 * @param {number} ano - Ano para calcular
 * @returns {string} Data no formato YYYY-MM-DD
 */
function calculaCarnaval(ano) {
    const pascoa = new Date(calculaPascoa(ano));
    const carnaval = new Date(pascoa);
    carnaval.setDate(carnaval.getDate() - 47);
    return carnaval.toISOString().slice(0, 10);
}

/**
 * Calcula a data do Corpus Christi (60 dias após a Páscoa)
 * @param {number} ano - Ano para calcular
 * @returns {string} Data no formato YYYY-MM-DD
 */
function calculaCorpusChristi(ano) {
    const pascoa = new Date(calculaPascoa(ano));
    const corpus = new Date(pascoa);
    corpus.setDate(corpus.getDate() + 60);
    return corpus.toISOString().slice(0, 10);
}

/**
 * Calcula a data da Black Friday (última sexta-feira de novembro)
 * @param {number} ano - Ano para calcular
 * @returns {string} Data no formato YYYY-MM-DD
 */
function calculaBlackFriday(ano) {
    const nov = new Date(ano, 10, 1); // 1 de novembro
    const ultimoDia = new Date(ano, 11, 0); // Último dia de novembro
    const ultimaSexta = new Date(ultimoDia);

    // Retrocede até encontrar uma sexta-feira (5 = sexta-feira)
    while (ultimaSexta.getDay() !== 5) {
        ultimaSexta.setDate(ultimaSexta.getDate() - 1);
    }

    return ultimaSexta.toISOString().slice(0, 10);
}

/**
 * Calcula a data do segundo domingo de maio (Dia das Mães)
 * @param {number} ano - Ano para calcular
 * @returns {string} Data no formato YYYY-MM-DD
 */
function calculaDiaMaes(ano) {
    const primeiroMaio = new Date(ano, 4, 1); // 1 de maio
    const diaSemana = primeiroMaio.getDay();

    // Encontra o primeiro domingo de maio
    const primeiroDomingo = new Date(primeiroMaio);
    primeiroDomingo.setDate(primeiroMaio.getDate() + (7 - diaSemana) % 7);

    // Adiciona 7 dias para o segundo domingo
    primeiroDomingo.setDate(primeiroDomingo.getDate() + 7);

    return primeiroDomingo.toISOString().slice(0, 10);
}

/**
 * Calcula a data do segundo domingo de novembro (Dia da Consciência Negra)
 * @param {number} ano - Ano para calcular
 * @returns {string} Data no formato YYYY-MM-DD
 */
function calculaDiaConscienciaNegra(ano) {
    const primeiroNovembro = new Date(ano, 10, 1); // 1 de novembro
    const diaSemana = primeiroNovembro.getDay();

    // Encontra o primeiro domingo de novembro
    const primeiroDomingo = new Date(primeiroNovembro);
    primeiroDomingo.setDate(primeiroNovembro.getDate() + (7 - diaSemana) % 7);

    // Adiciona 7 dias para o segundo domingo
    primeiroDomingo.setDate(primeiroDomingo.getDate() + 7);

    return primeiroDomingo.toISOString().slice(0, 10);
}

/**
 * Calcula a data do Dia de Ação de Graças EUA (quarta quinta-feira de novembro)
 * @param {number} ano - Ano para calcular
 * @returns {string} Data no formato YYYY-MM-DD
 */
function calculaThanksgiving(ano) {
    const nov = new Date(ano, 10, 1); // 1 de novembro
    const diaSemana = nov.getDay();

    // Encontra a primeira quinta-feira (4 = quinta-feira)
    const primeiraQuinta = new Date(nov);
    primeiraQuinta.setDate(nov.getDate() + (4 - diaSemana + 7) % 7);

    // Adiciona 21 dias para a quarta quinta-feira
    primeiraQuinta.setDate(primeiraQuinta.getDate() + 21);

    return primeiraQuinta.toISOString().slice(0, 10);
}

/**
 * Calcula a data do Ano Novo Chinês (baseado no calendário lunar)
 * @param {number} ano - Ano para calcular
 * @returns {string} Data aproximada no formato YYYY-MM-DD
 */
function calculaAnoNovoChines(ano) {
    // Usando uma fórmula aproximada baseada no calendário lunar chinês
    // O Ano Novo Chinês varia entre 21 de janeiro e 20 de fevereiro
    const baseDate = new Date(ano, 0, 21); // 21 de janeiro como base
    // Esta é uma simplificação; na prática seria necessário um calendário lunar preciso
    return baseDate.toISOString().slice(0, 10);
}

/**
 * Calcula a data da Oktoberfest (tipicamente começa na última semana de setembro)
 * @param {number} ano - Ano para calcular
 * @returns {string} Data aproximada no formato YYYY-MM-DD
 */
function calculaOktoberfest(ano) {
    // Oktoberfest começa na última semana de setembro
    const set = new Date(ano, 8, 15); // 15 de setembro
    return set.toISOString().slice(0, 10);
}

/**
 * Calcula a data do Dia da Árvore (varia por região, assumindo primavera)
 * @param {number} ano - Ano para calcular
 * @returns {string} Data no formato YYYY-MM-DD
 */
function calculaDiaArvore(ano) {
    // Dia da Árvore varia, assumindo 21 de setembro (primavera no hemisfério sul)
    const out = new Date(ano, 8, 21);
    return out.toISOString().slice(0, 10);
}

/**
 * Verifica se uma data variável corresponde à data atual
 * @param {string} tipo - Tipo de data variável
 * @param {number} ano - Ano atual
 * @returns {string|null} Data calculada ou null se não reconhecida
 */
export function verificaDataVariavel(tipo, ano) {
    switch (tipo) {
        case 'variavel_carnaval':
            return calculaCarnaval(ano);
        case 'variavel_pascoa':
            return calculaPascoa(ano);
        case 'variavel_corpus':
            return calculaCorpusChristi(ano);
        case 'variavel_blackfriday':
            return calculaBlackFriday(ano);
        case 'segundo_domingo_maio':
            return calculaDiaMaes(ano);
        case 'segundo_domingo_novembro':
            return calculaDiaConscienciaNegra(ano);
        case 'variavel_thanksgiving':
            return calculaThanksgiving(ano);
        case 'variavel_chines_novo':
            return calculaAnoNovoChines(ano);
        case 'variavel_oktoberfest':
            return calculaOktoberfest(ano);
        case 'variavel_arvore':
            return calculaDiaArvore(ano);
        default:
            return null;
    }
}

// Teste das funções (descomente para debugar)
/*
console.log('Testes de cálculo de feriados:');
console.log('Carnaval 2026:', calculaCarnaval(2026));
console.log('Páscoa 2026:', calculaPascoa(2026));
console.log('Corpus Christi 2026:', calculaCorpusChristi(2026));
console.log('Black Friday 2026:', calculaBlackFriday(2026));
console.log('Dia das Mães 2026:', calculaDiaMaes(2026));
console.log('Dia da Consciência Negra 2026:', calculaDiaConscienciaNegra(2026));
*/