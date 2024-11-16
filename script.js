let timesBrasileirao = new Set();
let dadosPartidas = [];
let divResultados = document.getElementById("resultados");
let divExplicacao1 = document.getElementById("texto-explicacao-1");
let divExplicacao2 = document.getElementById("texto-explicacao-2");

const ITERACOES_VALOR_ALEATORIO = 10;
const ITERACOES_HISTORICO_GOLS = 100;

function lerCSV(file, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const linhas = e.target.result.split('\n');
        const dados = linhas.map(linha => linha.split(','));
        callback(dados);
    };
    reader.readAsText(file);
}

document.getElementById("csvFile").addEventListener("change", function (event) {
    carregarDados();
});

function carregarDados() {
    const file = document.getElementById('csvFile').files[0];

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
    divExplicacao2.innerHTML = "";

    const mandante = document.getElementById('mandante').value;
    const visitante = document.getElementById('visitante').value;

    const resultadoMetodo1 = metodoMediaGols(mandante, visitante);
    const resultadoMetodo2 = metodoHistoricoResultados(mandante, visitante);

    divResultados.innerHTML += `
        <h2>Resultado Método 1: Média de Gols: Mandante: ${resultadoMetodo1.chanceVitoriaMandante.toFixed(4)}% Empate: ${resultadoMetodo1.chanceEmpate.toFixed(4)}% Visitante: ${resultadoMetodo1.chanceVitoriaVisitante.toFixed(4)}%</h2>
        <h2>Resultado Método 2: Histórico de Resultados: Mandante: ${resultadoMetodo2.chanceVitoriaMandante.toFixed(4)}% Empate: ${resultadoMetodo2.chanceEmpate.toFixed(4)}% Visitante: ${resultadoMetodo2.chanceVitoriaVisitante.toFixed(4)}%</h2>
    `;
}

function encontrarRodada(mandante, visitante) {
    const partida = dadosPartidas.find(x => x.mandante === mandante && x.visitante === visitante);
    return partida ? parseInt(partida.rodada) : "Partida não encontrada";
}