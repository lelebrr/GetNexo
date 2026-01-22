// Funções para calcular datas variáveis de feriados otimizadas

function calculaCarnaval(ano) {
    const pascoa = calculaPascoa(ano);
    const carnaval = new Date(pascoa);
    carnaval.setDate(carnaval.getDate() - 47);
    return carnaval.toISOString().slice(0, 10);
}

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
    return new Date(ano, mes - 1, dia);
}

function calculaCorpus(ano) {
    const pascoa = calculaPascoa(ano);
    const corpus = new Date(pascoa);
    corpus.setDate(corpus.getDate() + 60);
    return corpus.toISOString().slice(0, 10);
}

function blackFriday(ano) {
    const nov = new Date(ano, 10, 1);
    const diaSemana = nov.getDay();
    const ultimaSexta = new Date(nov);
    ultimaSexta.setDate(nov.getDate() + (5 - diaSemana + 26) % 7);
    return ultimaSexta.toISOString().slice(0, 10);
}

function segundoDomingo(mes, ano) {
    const primeiroDia = new Date(ano, mes, 1);
    const primeiroDomingo = new Date(primeiroDia);
    primeiroDomingo.setDate(primeiroDia.getDate() + (7 - primeiroDia.getDay()));
    const segundoDomingo = new Date(primeiroDomingo);
    segundoDomingo.setDate(primeiroDomingo.getDate() + 7);
    return segundoDomingo.toISOString().slice(0, 10);
}

function terceiroQuintaNovembro(ano) {
    const nov = new Date(ano, 10, 1);
    const primeiraQuinta = new Date(nov);
    primeiraQuinta.setDate(nov.getDate() + (4 - nov.getDay() + 7) % 7);
    const terceiraQuinta = new Date(primeiraQuinta);
    terceiraQuinta.setDate(primeiraQuinta.getDate() + 14);
    return terceiraQuinta.toISOString().slice(0, 10);
}

function terceiraSegundaAbril(ano) {
    const abr = new Date(ano, 3, 1);
    const primeiraSegunda = new Date(abr);
    primeiraSegunda.setDate(abr.getDate() + (1 - abr.getDay() + 7) % 7);
    const terceiraSegunda = new Date(primeiraSegunda);
    terceiraSegunda.setDate(primeiraSegunda.getDate() + 14);
    return terceiraSegunda.toISOString().slice(0, 10);
}

function sextaAntesPrimavera(ano) {
    const primavera = new Date(ano, 8, 22); // 22 de setembro
    if (primavera.getDay() === 5) primavera.setDate(primavera.getDate() - 7);
    while (primavera.getDay() !== 5) primavera.setDate(primavera.getDate() - 1);
    return primavera.toISOString().slice(0, 10);
}

function variavelOrgulho(ano) {
    // Junho é mês do orgulho LGBTQ+
    return `${ano}-06-28`; // Último dia de junho
}

function verificaDataVariavel(data, ano) {
    switch (data) {
        case 'variavel_carnaval': return calculaCarnaval(ano);
        case 'variavel_pascoa': return calculaPascoa(ano).toISOString().slice(0, 10);
        case 'variavel_corpus': return calculaCorpus(ano);
        case 'variavel_blackfriday': return blackFriday(ano);
        case 'segundo_domingo_maio': return segundoDomingo(4, ano);
        case 'segundo_domingo_agosto': return segundoDomingo(7, ano);
        case 'segundo_domingo_setembro': return segundoDomingo(8, ano);
        case 'primeiro_domingo_julho': return segundoDomingo(6, ano); // primeiro domingo julho
        case 'terceira_quinta_novembro': return terceiroQuintaNovembro(ano);
        case 'terceira_segunda_abril': return terceiraSegundaAbril(ano);
        case 'sexta_antes_primavera': return sextaAntesPrimavera(ano);
        case 'variavel_orgulho': return variavelOrgulho(ano);
        default: return data;
    }
}

export { verificaDataVariavel };