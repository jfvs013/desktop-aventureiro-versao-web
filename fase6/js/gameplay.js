import { iniciarMusica, exibirPontuacao, pontuacaoAtual } from "./recursosJogo.js"; // O (./) indica que está na mesma pasta.

var pontuacaoGlobal = 0;

function subtrairPontos(pontuacaoGlobal, condicao) {
    let pontuacaoPunitiva = { // Variável que referencia um objeto.
        // Os índices são 1 e 2 desse objeto.
        1: -200, //Deixar que todas as divs sejam criptografadas.
        2: -20 // Aceitar permissões estranhas, spywareEmAcao().
    }

    return pontuacaoGlobal + pontuacaoPunitiva[condicao];
}

function verificarCriptografia() {
    let verificando = setInterval(
        ()=> {
            const areaGameplay = document.getElementById("area-gameplay");
            const divsDeAreaGameplay = areaGameplay.querySelectorAll("div");

            let contador = 0;

            for(let i = 0; i <= divsDeAreaGameplay.length -1; i++) {
                if(divsDeAreaGameplay[i].innerText === "\u{1F512}") {
                    contador++;

                    if(contador >= divsDeAreaGameplay.length -1) {
                        pontuacaoGlobal = subtrairPontos(pontuacaoGlobal, 1);
                        
                        console.log("Todas as divs criptografadas.");
                        alert("Lembre-se de descriptografar, clique no antivírus.");
                    }
                }    
            }
            console.log(`${contador}: valor de verificarCriptografia.`);
        }, 45000 // Chama-se a cada 45 segundos.
    );
    return verificando; // Lembre-se de fechar o setInterval(), use clearInterval(nomeDaVariavel).
}

function mascoteConversando(condicao) { // Pertence ao mascote do jogo.
    const spanMascote = document.getElementById("falas-mascote");

    let indice = 0; // Começa na primeira fala.
    
    return new Promise( // Essa função promete futuramente o retorno de algo.
        (resolve) => {
            // Lembre-se de criar algo que representa o progresso na fase, para usar o parâmetro de condicao.
            
            const botaoContinuar = document.getElementById("continuar");
            const dialogoDiv = dialogo(condicao);
            const falas = dialogoDiv.querySelectorAll("p"); // Pega todas as tags <p> dentro da div dialogoDiv.
            const dialogoMascote = document.getElementById("dialogo-mascote");

            dialogoMascote.hidden = false;

            botaoContinuar.addEventListener("click", // Toda vez que botao continuar for clicado essa função é chamada.
                function handler() {
                    console.log(falas.length);
                    if(indice < falas.length) {
                        const dialogoMascote = document.getElementById("dialogo-mascote");

                        dialogoMascote.hidden = false;
                        spanMascote.textContent = falas[indice].textContent;
                        indice++; 
                    }
                    else {
                        console.log("Entrou em fim fala parte 1."); 
                        const dialogoMascote = document.getElementById("dialogo-mascote");
                        
                        dialogoMascote.hidden = true;
                         /* Funciona, pois redefini a prioridade do hidden com o !important no css.
                                                            Além do display: flex que sobrepõe à minha definição, sem a definição do [hidden] como !important no css
                                                            não funciona.*/
                        /* 
                        O removeEventListner() serve para remover o evento anterior, para cada clique um novo evento é criado,
                        portanto deve-se remover o anterior.
                        */
                        botaoContinuar.removeEventListener("click", handler);

                        resolve(true);    
                    }                    
                }
            );

            if(condicao) {
                spanMascote.textContent = "Bem vindo a fase 4, para continuar pressione o botão abaixo.";
            }
            else {
                botaoContinuar.click(); // Avança + 1, impedindo a aparição da última fala anterior. 
                // Aviso: isso somente funciona pois só temos duas falas separadas para o mascote, sendo a fala 1 representada pelo true e a segunda fala como false.
            }
        }
    );
}        

function dialogo(condicao) { // Pertence ao mascote do jogo.
    let dialogo_1;
    let dialogo_2;

    dialogo_1= document.getElementById("dialogo-mascote_1"); 
    dialogo_2 = document.getElementById("dialogo-mascote_2");

    if(condicao) { // Caso verdadeiro
        return dialogo_1; // Retorna uma div com suas tags <p> aninhadas.
    }
    else{
        return dialogo_2; // Retorna uma div com suas tags <p> aninhadas.
    }
}

function iconesAleatorios(){
    /*
    Caracteres Unicode e suas representações
        "\u{1F4C1}" // 📁 Pasta
        "\u{1F4C4}" // 📄 Documento
        "\u{1F310}" // 🌐 Globo
        "\u{1F4E7}" // 📧 E-mail
        "\u{1F4DE}" // 📞 Telefone
        "\u{1F517}" // 🔗 Link
        "\u2699"    // ⚙️ Engrenagem
        "\u{1F3AC}" // 🎬 Filme
        "\u{1F4F7}" // 📷 Câmera fotográfica
        "\u{1F3B5}" // 🎵 Nota musical
        "\u{1F6E0}" // 🛠️ Martelo e chave inglesa
        "\u{1F9F0}" // 🧰 Caixa de ferramentas
    */
    const iconesVetor = [
        "\u{1F4C1}",
        "\u{1F4C4}",
        "\u{1F310}",
        "\u{1F4E7}",
        "\u{1F4DE}",
        "\u{1F517}",
        "\u2699",
        "\u{1F3AC}",
        "\u{1F4F7}",
        "\u{1F3B5}",
        "\u{1F6E0}",
        "\u{1F9F0}"
    ]
    
    // Os ícones podem se repetir, impossível dizer quais serão escolhidos.
    const iconesEscolhidos = [];
    
    let i = 0;
    
    while(i < iconesVetor.length) {
        // Math.floor converte para inteiro.
        let numeroSorteado = Math.floor(Math.random() * iconesVetor.length) // Será sorteado de 0 até o tamanho do vetor(iconesVetor).
        
        iconesEscolhidos.push(iconesVetor[numeroSorteado]);

        i++;
    }

    return iconesEscolhidos; // retorna uma lista que contem os icones
}

function carregarObjetos() {
    const selecionarContainer = document.getElementById("area-gameplay");

    let divsCriadas = 0;
    
    for(let i = 0; i < 162; i++) {
        const icones = iconesAleatorios(); // É armazenado um vetor.
        const div = document.createElement("div");

        let j = 0; //Sempre tem seu valor reiniciado dentro do for.
       
        div.textContent = icones[j];
        selecionarContainer.append(div);
        
        j++;
        divsCriadas++;
    }               
   
}

function ransowareEmAcao() {
    // Lembre-se de chamar carregarObjetos() primeiro.
    const areaGameplayContainer = document.getElementById("area-gameplay");
    const divsAninhadasAreaGameplay = areaGameplayContainer.querySelectorAll("div");
    const copiaIcones = Array.from(divsAninhadasAreaGameplay).map(div => div.textContent); // Função de lambda no map.

    let indice = -1; // Para que comece em 0 ao somar +1; 

    const intervalo = setInterval( 
        () => {
            if(indice < divsAninhadasAreaGameplay.length -1) { 
                indice++;
                divsAninhadasAreaGameplay[indice].textContent = "\u{1F512}"; // Caractere Unicode do cadeado.
            }
            else if(indice > divsAninhadasAreaGameplay.length) {
                clearInterval(intervalo);
            }
            
            //callback(copiaIcones); // Retorna um vetor assim que terminar a execução do código, com uma cópia de cada div antes da substituição ou "criptografia".
        }, 20 // Este codigo é executado a cada 900 milisegundos.
    );
    return copiaIcones; // Retorna um vetor com os ícones originais.
}

function spywareEmAcao() {
    let numeroSorteado = Math.floor(Math.random() * 5); // Será sorteado de 0 a 4.
    let resultado;

    switch (numeroSorteado) {
        // Cada confirm gera uma notificação com mensagem a ser respondidada pelo usuário: ok === true, cancelar === false.
        case 0: resultado = confirm("Para continuar é precisar captar aúdio. "); break;
        case 1: resultado = confirm("Para continuar é precisar captar vídeo. "); break;
        case 2: resultado = confirm("Para continuar é preciso gravar tela. "); break;
        case 3: resultado = confirm("Para continuar é preciso instalar isso. "); break;
        case 4: resultado = confirm("Para continuar é preciso instalar isso. "); break;
    }

    if(resultado) { // Se for verdadeiro.
        console.log("O usuário fracassou ao aceitar a permissão.");
        pontuacaoGlobal = subtrairPontos(pontuacaoGlobal, 2); // Retira 20 pontos adquiridos.
    }
    else {
        pontuacaoGlobal = pontuacao(pontuacaoGlobal, 3); // Adicionando pontos adequados.
        console.log(`${pontuacaoGlobal} é o valor de pontos atualmente.`);
    }
    return resultado; // Retorna true se resultado for false (e vice-versa)
}

function pontuacao(pontuacaoRegistrada, condicao) {
    const descriptografar = 10;
    const parte_1_Completa = 20;
    const impedirSpyware = 15;
    const parte_2_Completa = 30;

    let pontuacaoFinal = pontuacaoRegistrada;

    if(condicao == 1){
        return pontuacaoFinal + descriptografar;
    }
    else if(condicao == 2){
        return pontuacaoFinal + parte_1_Completa;
    }
    else if(condicao == 3){
        return pontuacaoFinal + impedirSpyware;
    }
    else if(condicao == 4){
        return pontuacaoFinal + parte_2_Completa;
        
    }
    else {
        return false;
    }
}

function antivirus(descriptografar) {
    const iconesSalvos = descriptografar;
    const divGenerica = document.createElement("div");
    const conteudoPrincipal = document.querySelector("main");
    const botaoAntivirus = document.createElement("button");
    const selecionarContainer = document.getElementById("area-gameplay");
    
    botaoAntivirus.addEventListener("click", // Pode ser cansativo para o jogador clicar diversas vezes, mas não é impedido.
        () => { // Está função anônima é chamada todas vez que o botaoAntivirus for clicado.
            const descriptografandoIcones = selecionarContainer.querySelectorAll("div"); // Retorna um NodeList (semelhante a vetor) com todas as <div>
            
            // O Array.from converte a NodeList vinda de descriptografandoIcones para vetor.
            const haviaCriptografia = Array.from(descriptografandoIcones).some(div => div.textContent === "\u{1F512}");
            // A função .some() usada acima usa uma função de lambda dentro de si.
            // O método .some() retorna true se pelo menos um elemento atender à condição.

            descriptografandoIcones.forEach( 
                (div, indice) => { // Fução anônima neste forEach().
                    div.textContent = iconesSalvos[indice]; // Substituí os criptografados pelos ícones originais.
                }
            );
            
            if (haviaCriptografia) {
                // Lógica de pontuação.
                pontuacaoGlobal = pontuacao(pontuacaoGlobal, 1);
                console.log("Pontuação Atualizada:", pontuacaoGlobal);
            }
        }
    );
    
    botaoAntivirus.setAttribute("id", "botaoAntivirus"); // Cria um id para botaoAntivirus.
    divGenerica.setAttribute("id", "botaoAntivirusDiv"); // Cria um id para a div que contém o botaoAntivirus.
    
    divGenerica.append(botaoAntivirus);
    conteudoPrincipal.appendChild(divGenerica);
}

async function parte_1_Gameplay() {
    return new Promise(
        (resolve) => {
            carregarObjetos();

            let iconesSalvos = ransowareEmAcao();
            antivirus(iconesSalvos); // Dessa forma restaura cada icone criptografado pelo "ransowareEmAcao()".

            const adormecer = setTimeout(
                () => {
                    console.log("O setTimeout() de parte_1_Gameplay() funcionou.");
                    resolve(true);
                }, 10000 // Espera-se 10 segundos.
            );
        }
    );
}

function firewall(spywareIntervalo) { // Uma investida para parar o spyware.
    clearInterval(spywareIntervalo); // Finaliza o setInterval contindo em uma variável.
    console.log("Firewall chamado.");
}

function parte_2_Gameplay() {    
    const areaGameplayDiv = document.getElementById("area-gameplay");
    
    areaGameplayDiv.innerText = "";
    
    const main = document.querySelector("main");
    const divGenerica = document.createElement("div");
    const botaoFirewall = document.createElement("button");

    divGenerica.setAttribute("id", "firewallDiv"); // Definindo id para esse elemento criado.
    botaoFirewall.setAttribute("id", "firewallBotao"); // Definindo id para esse elemento criado.

    divGenerica.append(botaoFirewall);
    main.appendChild(divGenerica);
}

async function firewallRecarregando(state) { // state é um objeto que é passado como parâmetro e state em inglês significa estado (status, neste contexto).
    if(state.firewallCooldown) {
        setTimeout(
            () => {
                state.spywareIntervalo = setInterval(
                    () => {
                        state.firewallCooldown = false;
                        state.contadorSpyware++;
                        spywareEmAcao();
                        console.log(`O spyware foi executado: ${state.contadorSpyware} vez(es). \n`);
                        console.log(`O cooldown do Firewall se passou.`);
                    }, 10000
                );
            }, 14000
        );
    }
}
async function estagiosGameplay() {
    // O await para a execução naquela linha, até que uma condição anterior seja satisfeita.
    iniciarMusica(); // Chamando a função vinda de ./recursosJogo.js .
    // Parte 1 da gameplay.
    const atualizarPontosAtuais = setInterval(
        ()=> {
            pontuacaoAtual(pontuacaoGlobal);
        }, 3000
    );

    await mascoteConversando(true); // Remove essa linhas para testar a promisse.
    await parte_1_Gameplay(); // Remove estas linhas para testar a promisse.
    const intervaloVerificacao = verificarCriptografia(); // É chamado constantemente a cada 15 segundos, precisa fechar ao finalizar a fase 4.

    let state = { // Criando um objeto. Para criar um objeto usa-se chaves, à esquerda dos :(dois pontos), está o atributo e à direita o valor armazenado nele.
        contadorSpyware: 0,
        firewallCooldown: false,
        spywareIntervalo: null
    };

    // Parte 2.
    async function parte_2() {
        console.log("Entrou na parte_2().");
        const areaGameplayDiv = document.getElementById("area-gameplay");

        areaGameplayDiv.innerText = "";
        
        pontuacaoGlobal = pontuacao(pontuacaoGlobal, 2); // Adicionando pontos adequados.
        
        console.log("Pontuação Atualizada:", pontuacaoGlobal);

        await mascoteConversando(false); // Começa a parte 2 do diálogo, sendo este o último.
        
        console.log("1 minuto se passou, iniciando a fase 2");
        
        parte_2_Gameplay(); // Aqui é criado o firewallBotao.
        await parte_1_Gameplay();

        const botaoFirewall = document.getElementById("firewallBotao");

        state.spywareIntervalo = setInterval(
            () => {
                state.contadorSpyware++;
                spywareEmAcao();
                console.log(`O spyware foi executado: ${state.contadorSpyware} vez(es). \n`);
            }, 10000
        );

        botaoFirewall.addEventListener("click", 
            () => {
                firewall(state.spywareIntervalo);
                state.firewallCooldown = true;
                firewallRecarregando(state);
            }
        );
    }

    async function parteFinal() {
        return new Promise ( 
            (resolve) => {
                setTimeout( 
                    async () => {
                        await parte_2();
                        resolve(true);        
                    }, 1000
                );
            }
        );
    }

    setTimeout(
        async () => {
            await parteFinal();
        }, 30000

    );

    setTimeout(
        ()=> {
            pontuacaoGlobal = pontuacao(pontuacaoGlobal, 4);
            exibirPontuacao(pontuacaoGlobal);
            clearInterval(state.spywareIntervalo); // Limpa o setInterval() dentro do atributo do objeto state.
            clearInterval(intervaloVerificacao);
            clearInterval(atualizarPontosAtuais);
            
            console.log("A fase 4 terminou.");
            console.log("exibirPontuacao(pontuacaoGlobal) deve criar elementos html para redirecionar a página, avançando para a fase seguinte.");
        }, (2* 60000) // A fase dura 2:00 (2 minutos).
    );
}

estagiosGameplay(); 

// Dicas:
/*
    Ao usar funções nomeadas em botões, não é necessário fechar o addEventListener(),
    pois somente uma instância de addEventListener() é criada.
*/
