function metodoHistoricoResultados(mandante, visitante) {
    const rodada = encontrarRodada(mandante, visitante);

    divExplicacao2.innerHTML += "<br> VARIÁVEIS"
    divExplicacao2.innerHTML += "<br> Média de vitórias do mandante = Vm"
    divExplicacao2.innerHTML += "<br> Média de vmpates do mandante = Em"
    divExplicacao2.innerHTML += "<br> Média de verrotas do mandante = Dm"
    divExplicacao2.innerHTML += "<br> Média de vitórias do visitante = Vv"
    divExplicacao2.innerHTML += "<br> Média de vmpates do visitante = Ev"
    divExplicacao2.innerHTML += "<br> Média de verrotas do visitante = Dv"

    const jogosMandante = dadosPartidas.filter(x => x.mandante === mandante && x.rodada < rodada);
    const percentualVitoriasMandante = (jogosMandante.filter(x => x.golsMandante > x.golsVisitante).length / (jogosMandante.length)) * 100;
    const percentualEmpatesMandante = (jogosMandante.filter(x => x.golsMandante == x.golsVisitante).length / (jogosMandante.length)) * 100;
    const percentualDerrotasMandante = (jogosMandante.filter(x => x.golsMandante < x.golsVisitante).length / (jogosMandante.length)) * 100;

    divExplicacao2.innerHTML += `<br> Vm: ${percentualVitoriasMandante.toFixed(4)}`;
    divExplicacao2.innerHTML += `<br> Em: ${percentualEmpatesMandante.toFixed(4)}`;
    divExplicacao2.innerHTML += `<br> Dm: ${percentualDerrotasMandante.toFixed(4)}`;

    const jogosVisitante = dadosPartidas.filter(x => x.visitante === visitante && x.rodada < rodada);
    const percentualVitoriasVisitante = (jogosVisitante.filter(x => x.golsVisitante > x.golsMandante).length / (jogosVisitante.length)) * 100;
    const percentualEmpatesVisitante = (jogosVisitante.filter(x => x.golsVisitante == x.golsMandante).length / (jogosVisitante.length)) * 100;
    const percentualDerrotasVisitante = (jogosVisitante.filter(x => x.golsVisitante < x.golsMandante).length / (jogosVisitante.length)) * 100;

    divExplicacao2.innerHTML += `<br> Vv: ${percentualVitoriasVisitante.toFixed(4)}`;
    divExplicacao2.innerHTML += `<br> Ev: ${percentualEmpatesVisitante.toFixed(4)}`;
    divExplicacao2.innerHTML += `<br> Dv: ${percentualDerrotasVisitante.toFixed(4)}`;

    const chanceVitoriaMandante = (percentualVitoriasMandante + percentualDerrotasVisitante) / 2;
    const chanceEmpate = (percentualEmpatesMandante + percentualEmpatesVisitante) / 2;
    const chanceVitoriaVisitante = (percentualVitoriasVisitante + percentualDerrotasMandante) / 2;

    divExplicacao2.innerHTML += `<br> Chance de vitória do mandante: (Vm+Dv)/2`;
    divExplicacao2.innerHTML += `<br> Chance de empate: (Em+Ev)/2`;
    divExplicacao2.innerHTML += `<br> Chance de vitória do visitante: (Dm+Vv)/2`;

    return {
        chanceVitoriaMandante,
        chanceEmpate,
        chanceVitoriaVisitante
    }
}