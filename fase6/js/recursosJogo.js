// Vetor(array) de músicas.
const playlist = [
    "../../musics/Empire_City.mp3"
];

let index = 0; // Começa na primeira música.
const player = document.getElementById("musica");

// Função para tocar a música atual.
function tocarMusica() {
    player.src = playlist[index];
    player.play();
}

// Quando a música terminar, passa para a próxima.
player.addEventListener("ended", 
    () => {
        index++;
        if (index <= playlist.length) {
            index = 0; // Volta para o início (loop infinito).
        }
        tocarMusica();
    }
);

// O navegador não permite que a música execute automaticamente, sem algum evento ser detectado.
function iniciarMusica() {
        document.addEventListener("click", 
        ()=> {
            tocarMusica();
        }, { once: true} // O once: true é uma opção que executa o evento apenas uma vez e depois o deleta.
    );
}

function exibirPontuacao(pontuacaoGlobal) { // Use ao terminar a fase 4.
    const main = document.querySelector("main");
    const divGenerica = document.createElement("div");

    main.innerHTML = ""; // Esvazia a página.

    divGenerica.setAttribute("id", "exibirPontuacao");
    divGenerica.innerHTML = `<strong>Pontos</strong>: ${pontuacaoGlobal}`; // O innerHTML permite usar tags HTML, diferente do innerText.
    
    if(pontuacaoGlobal > 0) {
        divGenerica.append(
            Object.assign(
                document.createElement("div"), 
                { 
                    id: "mensagem-pontos",
                    innerText: "Parabéns, você concluiu a fase"
                }
            )
        );

        const reiniciarFaseBotao = Object.assign(
            document.createElement("button"), 
            { 
                id: "botaoReiniciarFase",
                innerText: "Reiniciar"
            }
        );

        reiniciarFaseBotao.addEventListener("click", 
            () => {
                window.location.reload(); // Este método recarrega a página.
            }
        );

        // Aqui é criado o botao que avanca para próxima fase.
        const botaoAvancar = Object.assign(
            document.createElement("button"), 
            { 
                id: "botaoAvancarFase",
                innerText: "Avançar"
            }
        );

        botaoAvancar.addEventListener("click", 
            () => {
                window.location.href = "../../fase7/fase7.html"; // Este método recarrega a página.
            }
        );

        const divBotoes = document.createElement("div");
        divBotoes.setAttribute("id", "divBotoesPontuacao");

        divBotoes.append(reiniciarFaseBotao);
        divBotoes.append(botaoAvancar);

        divGenerica.append(divBotoes);
    }
    else {
        divGenerica.append(
            Object.assign(
                document.createElement("div"), 
                { 
                    id: "mensagem-pontos",
                    innerHTML: "Ops... <br>" + 
                               "É melhor tentar novamente."
                }
            )
        );

        const reiniciarFaseBotao = Object.assign(
            document.createElement("button"), 
            { 
                id: "botaoReiniciarFase",
                innerText: "Reiniciar"
            }
        );

        reiniciarFaseBotao.addEventListener("click", 
            () => {
                window.location.reload(); // Este método recarrega a página.
            }
        );

        const divBotoes = document.createElement("div");
        divBotoes.setAttribute("id", "divBotoesPontuacao");

        divBotoes.append(reiniciarFaseBotao);

        divGenerica.append(divBotoes);
    }

    main.appendChild(divGenerica); // Adiciona a div dentro do <main>.
}

function pontuacaoAtual(pontuacaoGlobal) {
    const divId = document.getElementById("pontuacaoEstilo");
    const divGenerica = document.createElement("div");
    const main = document.querySelector("main");
    
    if(divId === null) {
        divGenerica.innerHTML = `<strong>Pontos:</strong> ${pontuacaoGlobal}`;
        divGenerica.setAttribute("id", "pontuacaoEstilo");

        main.appendChild(divGenerica);
    }
    else {
        divId.innerHTML = `<strong>Pontos:</strong> ${pontuacaoGlobal}`
    }
}
export { iniciarMusica, exibirPontuacao, pontuacaoAtual }; // Exportando a função iniciar música, dessa forma pode ser usado o import em outros arquivos (.js).  


