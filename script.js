let timesBrasileirao = new Set();
let dadosPartidas = [];
let divResultados = document.getElementById("resultados");
let divExplicacao1 = document.getElementById("explicacao-1");
const ITERACOES_VALOR_ALEATORIO = 10;

function lerCSV(file, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const linhas = e.target.result.split('\n');
        const dados = linhas.map(linha => linha.split(','));
        callback(dados);
    };
    reader.readAsText(file);
}

function carregarDados() {
    const file = document.getElementById('csvFile').files[0];
    if (!file) {
        alert("Por favor, carregue um arquivo CSV primeiro.");
        return;
    }

    lerCSV(file, dados => {
        dadosPartidas = [];
        dados.forEach(dado => {
            timesBrasileirao.add(dado[1]);
            timesBrasileirao.add(dado[2]);
            dadosPartidas.push({
                rodada: parseInt(dado[0]),
                mandante: dado[1],
                visitante: dado[2],
                golsMandante: parseInt(dado[3]),
                golsVisitante: parseInt(dado[4])
            })
        });
        preencherSelectTimes();
    });
}

function preencherSelectTimes() {
    const mandanteSelect = document.getElementById('mandante');
    const visitanteSelect = document.getElementById('visitante');
    mandanteSelect.innerHTML = "";
    visitanteSelect.innerHTML = "";

    timesBrasileirao.forEach(time => {
        const optionMandante = document.createElement("option");
        optionMandante.value = time;
        optionMandante.text = time;
        mandanteSelect.add(optionMandante);

        const optionVisitante = document.createElement("option");
        optionVisitante.value = time;
        optionVisitante.text = time;
        visitanteSelect.add(optionVisitante);
    });
}

function predizerResultado() {
    divResultados.innerHTML = "";
    divExplicacao1.innerHTML = "";

    const mandante = document.getElementById('mandante').value;
    const visitante = document.getElementById('visitante').value;

    const resultadoMetodo1 = metodoMediaGols(mandante, visitante);
    const resultadoMetodo2 = metodoHistoricoResultados(mandante, visitante);

    divResultados.innerHTML += `
        <h2>Resultado Método 1: Média de Gols</h2>
        ${resultadoMetodo1}<br>

        <h2>Resultado Método 2: Histórico de Resultados</h2>
        Predição: ${resultadoMetodo2}
    `;
}

function metodoMediaGols(mandante, visitante) {
    const rodada = encontrarRodada(mandante, visitante);

    const jogosMandante = dadosPartidas.filter(x => x.mandante === mandante && x.rodada < rodada);
    const golsFeitosMandante = parseFloat(jogosMandante.reduce((soma, jogo) => soma + jogo.golsMandante, 0));
    const golsSofridosMandante = parseFloat(jogosMandante.reduce((soma, jogo) => soma + jogo.golsVisitante, 0));

    const jogosVisitante = dadosPartidas.filter(x => x.visitante === visitante && x.rodada < rodada);
    const golsFeitosVisitante = parseFloat(jogosVisitante.reduce((soma, jogo) => soma + jogo.golsVisitante, 0));
    const golsSofridosVisitante = parseFloat(jogosVisitante.reduce((soma, jogo) => soma + jogo.golsMandante, 0));

    const rodadaDividir = rodada + 1;

    const fatorMandante = ((golsFeitosMandante + golsSofridosMandante) / rodadaDividir);
    const fatorVisitante = ((golsFeitosVisitante + golsSofridosVisitante) / rodadaDividir);

    divExplicacao1.innerHTML += `<br> Fator mandante: ${fatorMandante.toFixed(4)}`;
    divExplicacao1.innerHTML += `<br> Fator visitante: ${fatorVisitante.toFixed(4)}`;

    var probabilidadesMandante = calcularProbabilidadesLambda(fatorMandante);
    divExplicacao1.innerHTML += `<br> Intervalos mandante: `;
    mostrarProbabilidades(probabilidadesMandante);

    var probabilidadesVisitante = calcularProbabilidadesLambda(fatorVisitante);
    divExplicacao1.innerHTML += `<br> Intervalos visitante: `;
    mostrarProbabilidades(probabilidadesVisitante);

    let valorAleatorioMandante = valorAleatorio();
    divExplicacao1.innerHTML += `<br> Valor sorteado para o mandante: ${valorAleatorioMandante.toFixed(4)}`;
    var golsMandante = pegarIndiceProbabilidades(probabilidadesMandante, valorAleatorioMandante);

    let valorAleatorioVisitante = valorAleatorio();
    divExplicacao1.innerHTML += `<br> Valor sorteado para o visitante: ${valorAleatorioVisitante.toFixed(4)}`;
    var golsVisitante = pegarIndiceProbabilidades(probabilidadesVisitante, valorAleatorioVisitante);

    return `${mandante} ${golsMandante} X  ${golsVisitante} ${visitante}`;
}

function metodoHistoricoResultados(mandante, visitante, rodada) {

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
        { inicial: 0, final: 0 }];

    const kValues = [0, 1, 2, 3, 4, 5];
    let acumulado = 0;
    divExplicacao1.innerHTML += `<br> Probabilidades para λ = ${lambda}:`;
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

function encontrarRodada(mandante, visitante) {
    const partida = dadosPartidas.find(x => x.mandante === mandante && x.visitante === visitante);
    return partida ? parseInt(partida.rodada) : "Partida não encontrada";
}

function calcularPoisson(lambda, k) {
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / fatorial(k);
}

function fatorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * fatorial(n - 1);
}

function valorAleatorio() {
    let totalAleatorio = 0;
    for (let i = 0; i < ITERACOES_VALOR_ALEATORIO; i++) {
        let valorAleatorio = Math.random();
        totalAleatorio += valorAleatorio;
    }

    let valorAleatorioFinal = totalAleatorio / ITERACOES_VALOR_ALEATORIO;
    return valorAleatorioFinal;
}

function pegarIndiceProbabilidades(probabilidades, valor) {
    const indice = probabilidades
        .findIndex(probabilidade => valor >= probabilidade.inicial && valor <= probabilidade.final);

    return indice;
}
