
function metodoMediaGols(mandante, visitante) {
    const rodada = encontrarRodada(mandante, visitante);

    divExplicacao1.innerHTML += `<br> VARIÁVEIS`;
    divExplicacao1.innerHTML += `<br> Média de gols feitos pelo mandante: GFM`;
    divExplicacao1.innerHTML += `<br> Média de gols sofridos pelo mandante: GSM`;
    divExplicacao1.innerHTML += `<br> Média de gols feitos pelo visitante: GFV`;
    divExplicacao1.innerHTML += `<br> Média de gols sofridos pelo visitante: GSV`;
    divExplicacao1.innerHTML += `<br> Rodada: r`;

    const jogosMandante = dadosPartidas.filter(x => x.mandante === mandante && x.rodada < rodada);
    const mediaGolsFeitosMandante = parseFloat(jogosMandante.reduce((soma, jogo) => soma + jogo.golsMandante, 0)) / (jogosMandante.length + 1);
    const mediaGolsSofridosMandante = parseFloat(jogosMandante.reduce((soma, jogo) => soma + jogo.golsVisitante, 0)) / (jogosMandante.length + 1);

    const jogosVisitante = dadosPartidas.filter(x => x.visitante === visitante && x.rodada < rodada);
    const mediaGolsFeitosVisitante = parseFloat(jogosVisitante.reduce((soma, jogo) => soma + jogo.golsVisitante, 0)) / (jogosVisitante.length + 1);
    const mediaGolsSofridosVisitante = parseFloat(jogosVisitante.reduce((soma, jogo) => soma + jogo.golsMandante, 0)) / (jogosVisitante.length + 1);

    divExplicacao1.innerHTML += `<br> GFM = ${mediaGolsFeitosMandante.toFixed(4)} GSM = ${mediaGolsSofridosMandante.toFixed(4)}`;
    divExplicacao1.innerHTML += `<br> GFV = ${mediaGolsFeitosVisitante.toFixed(4)} GSV = ${mediaGolsSofridosVisitante.toFixed(4)}`;

    const fatorMandante = ((mediaGolsFeitosMandante + mediaGolsSofridosVisitante) / 2);
    const fatorVisitante = ((mediaGolsFeitosVisitante + mediaGolsSofridosMandante) / 2);

    divExplicacao1.innerHTML += `<br> Fator mandante: ((GFM + GSV) / 2) ${fatorMandante.toFixed(4)}`;
    divExplicacao1.innerHTML += `<br> Fator visitante: ((GFV + GSM) / 2) ${fatorVisitante.toFixed(4)}`;

    var probabilidadesMandante = calcularProbabilidadesLambda(fatorMandante);
    divExplicacao1.innerHTML += `<br> Intervalos mandante: `;
    mostrarProbabilidades(probabilidadesMandante);

    var probabilidadesVisitante = calcularProbabilidadesLambda(fatorVisitante);
    divExplicacao1.innerHTML += `<br> Intervalos visitante: `;
    mostrarProbabilidades(probabilidadesVisitante);

    const simulacoes = [];

    for (let i = 0; i < ITERACOES_HISTORICO_GOLS; i++) {
        let valorAleatorioMandante = Math.random();
        var golsMandante = pegarIndiceProbabilidades(probabilidadesMandante, valorAleatorioMandante);

        let valorAleatorioVisitante = Math.random();
        var golsVisitante = pegarIndiceProbabilidades(probabilidadesVisitante, valorAleatorioVisitante);
        simulacoes.push({ mandante: golsMandante, visitante: golsVisitante })
    }

    const chanceVitoriaMandante = simulacoes.filter(simulacao => simulacao.mandante > simulacao.visitante).length / 10000;
    const chanceEmpate = simulacoes.filter(simulacao => simulacao.mandante == simulacao.visitante).length / 10000;
    const chanceVitoriaVisitante = simulacoes.filter(simulacao => simulacao.mandante < simulacao.visitante).length / 10000;

    return {
        chanceVitoriaMandante,
        chanceEmpate,
        chanceVitoriaVisitante
    }
}

function mostrarProbabilidades(probabilidades) {
    divExplicacao1.innerHTML += "(";
    probabilidades.forEach(probabilidade => {
        divExplicacao1.innerHTML += `[${probabilidade.inicial.toFixed(4)},${probabilidade.final.toFixed(4)}]`;
    });
    divExplicacao1.innerHTML += ")";
}

function calcularProbabilidadesLambda(lambda) {
    const probabilidades = [
        { inicial: 0, final: 0 },
        { inicial: 0, final: 0 },
        { inicial: 0, final: 0 },
        { inicial: 0, final: 0 },
        { inicial: 0, final: 0 },
        { inicial: 0, final: 0 },
        { inicial: 0, final: 0 },
        { inicial: 0, final: 0 },
        { inicial: 0, final: 0 },
        { inicial: 0, final: 0 },
        { inicial: 0, final: 0 }];

    const kValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let acumulado = 0;
    divExplicacao1.innerHTML += `<br> Probabilidades para λ = ${lambda.toFixed(4)}:`;
    for (let i = 0; i < kValues.length; i++) {
        const k = kValues[i];
        const probabilidade = calcularPoisson(lambda, k);
        acumulado += probabilidade;
        divExplicacao1.innerHTML += `<br> P(X = ${k}) = ${probabilidade.toFixed(4)} | acumulado =  ${acumulado.toFixed(4)} `;
        if (probabilidade == 0) {
            probabilidades[i].inicial = probabilidades[i - 1].final;
            probabilidades[i].final = 1;
            break;
        }
        if (i == 0) {
            probabilidades[i].final = acumulado;
        }
        else if (i == kValues.length - 1) {
            probabilidades[i].inicial = probabilidades[i - 1].final;
            probabilidades[i].final = 1;
        }
        else {
            probabilidades[i].inicial = probabilidades[i - 1].final;
            probabilidades[i].final = acumulado;
        }
    }

    return probabilidades;
}

function calcularPoisson(lambda, k) {
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / fatorial(k);
}

function fatorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * fatorial(n - 1);
}

function pegarIndiceProbabilidades(probabilidades, valor) {
    const indice = probabilidades
        .findIndex(probabilidade => valor >= probabilidade.inicial && valor <= probabilidade.final);

    return indice;
}
