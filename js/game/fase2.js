/**
 * js/game/fase2.js
 * Lógica da Fase 2: Segurança Digital
 * ATUALIZADO: Botão de fechar (X) ultra-evidente e visual de terror.
 */
import { DesktopUI } from '../ui/desktop.js';
import { MascotUI } from '../ui/mascote.js';
import { GameState } from '../core/state.js';
import { PopupUI } from '../ui/popup.js';
import { $, $$ } from '../core/helpers.js';

// --- INJEÇÃO DE ESTILOS DE TERROR E UI ---
const scaryStyles = document.createElement('style');
scaryStyles.innerHTML = `
    @keyframes glitch-shake {
        0% { transform: translate(1px, 1px) rotate(0deg); }
        10% { transform: translate(-1px, -2px) rotate(-1deg); }
        20% { transform: translate(-3px, 0px) rotate(1deg); }
        30% { transform: translate(3px, 2px) rotate(0deg); }
        40% { transform: translate(1px, -1px) rotate(1deg); }
        50% { transform: translate(-1px, 2px) rotate(-1deg); }
        60% { transform: translate(-3px, 1px) rotate(0deg); }
        70% { transform: translate(3px, 1px) rotate(-1deg); }
        80% { transform: translate(-1px, -1px) rotate(1deg); }
        90% { transform: translate(1px, 2px) rotate(0deg); }
        100% { transform: translate(1px, -2px) rotate(-1deg); }
    }
    
    @keyframes pulse-red {
        0% { box-shadow: 0 0 0 0 rgba(255, 64, 64, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(255, 64, 64, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 64, 64, 0); }
    }

    .scary-shake {
        animation: glitch-shake 0.5s infinite;
    }

    .scary-text {
        font-family: 'Courier New', monospace;
        text-transform: uppercase;
        letter-spacing: 2px;
    }

    /* ESTILIZAÇÃO DO NOVO BOTÃO FECHAR (X) */
    .window-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #222;
        padding: 8px 12px !important;
        border-bottom: 2px solid #ff4040;
    }

    .window-controls {
        display: flex;
        align-items: center;
    }

    .control-btn.close {
        background: #ff4040 !important; /* Vermelho vibrante */
        width: 35px !important;
        height: 35px !important;
        border: 2px solid #fff !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        position: relative;
        transition: all 0.2s ease;
        animation: pulse-red 2s infinite;
        z-index: 10;
    }

    /* O caractere X dentro do botão */
    .control-btn.close::before {
        content: '✕';
        color: white !important;
        font-size: 24px !important;
        font-weight: bold !important;
        font-family: Arial, sans-serif !important;
    }

    .control-btn.close:hover {
        background: #ff0000 !important;
        transform: scale(1.15);
        box-shadow: 0 0 20px #ff0000;
    }

    .control-btn.close:active {
        transform: scale(0.9);
    }
`;
document.head.appendChild(scaryStyles);

const challenges = [
    {
        id: 'scam-popup',
        title: '⚠️ SISTEMA LENTO',
        content: `
            <div style="text-align:center;">
                <p style="color: #ff6b6b; font-weight:bold;">SEU PC ESTÁ EM PERIGO!</p>
                <p>Clique para resolver agora.</p>
                <br>
                <button class="primary-btn" data-action="download-virus" data-id="virus1" style="margin: 0 auto; background: #ff4040;">BAIXAR SOLUÇÃO</button>
            </div>
        `,
        correctAction: 'close-window',
        mascotCorrect: "Boa! Nunca baixe programas que prometem 'limpar' seu PC do nada.",
        mascotError: "NÃO! VÍRUS DETECTADO! O Sistema foi invadido!"
    },
    {
        id: 'email-phishing',
        title: '📧 Banco: Urgente',
        content: `
            <p>Sua conta será zerada em 24h.</p>
            <p>Clique para evitar o bloqueio.</p>
            <button class="primary-btn" data-action="open-link" data-id="phishing1">Evitar Bloqueio</button>
        `,
        correctAction: 'close-window',
        mascotCorrect: "Isso aí! O banco nunca te apressa desse jeito.",
        mascotError: "Cuidado! Links urgentes geralmente são golpe. O Vírus Mestre apareceu!"
    }
];

let currentChallengeIndex = 0;
let movementInterval = null;
let spamCount = 0;

const scaryPhrases = [
    "DADOS CORROMPIDOS",
    "FALHA NO SISTEMA",
    "HACKEADO...",
    "VOCÊ NÃO PODE FECHAR",
    "ERRO 404",
    "DELETANDO ARQUIVOS...",
    "PERIGO IMINENTE"
];

export const Phase2 = {
    init() {
        console.log("Fase 2 Iniciada: Scary Mode");
        GameState.setPhase(2);
        currentChallengeIndex = 0;

        MascotUI.say("Fase 2: Atenção! Vírus perigosos estão à solta.");

        $('#windows-area').innerHTML = '';
        this.stopMovement();

        setTimeout(() => this.spawnChallenge(), 2000);
    },

    spawnChallenge() {
        if (currentChallengeIndex >= challenges.length) {
            this.finishPhase();
            return;
        }

        const challenge = challenges[currentChallengeIndex];
        const windowsArea = $('#windows-area');
        windowsArea.innerHTML = '';

        const winEl = document.createElement('div');
        winEl.className = 'window-card';
        winEl.dataset.id = challenge.id;

        winEl.innerHTML = `
            <div class="window-header">
                <span class="window-title">${challenge.title}</span>
                <div class="window-controls">
                    <button class="control-btn close" 
                            data-action="close-window" 
                            data-id="${challenge.id}" 
                            aria-label="Fechar Janela">
                    </button>
                </div>
            </div>
            <div class="window-body">
                ${challenge.content}
            </div>
        `;

        windowsArea.appendChild(winEl);
        MascotUI.say("O que você faz com essa janela? Dica: Procure o botão de fechar!");
    },

    // --- LÓGICA DO TERROR (BOSS BATTLE) ---

    triggerBossBattle() {
        const windowsArea = $('#windows-area');
        windowsArea.innerHTML = '';

        spamCount = 7;

        const boss = document.createElement('div');
        boss.className = 'window-card boss-virus scary-shake';
        boss.dataset.action = "kill-boss";

        boss.style.position = 'absolute';
        boss.style.width = '160px';
        boss.style.height = '160px';
        boss.style.zIndex = '100';

        boss.style.border = '5px solid #ff0000';
        boss.style.borderRadius = '50%';
        boss.style.background = '#000';
        boss.style.display = 'flex';
        boss.style.alignItems = 'center';
        boss.style.justifyContent = 'center';
        boss.style.cursor = 'not-allowed';
        boss.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.8)';
        boss.style.transition = 'top 0.6s ease-out, left 0.6s ease-out';

        boss.innerHTML = `
            <div style="font-size: 5rem; pointer-events: none; filter: drop-shadow(0 0 10px red);" id="boss-face">💀</div>
        `;
        windowsArea.appendChild(boss);

        for (let i = 0; i < spamCount; i++) {
            const spam = document.createElement('div');
            spam.className = 'window-card virus-spam';
            spam.dataset.action = "kill-spam";

            spam.style.position = 'absolute';
            spam.style.width = '240px';
            spam.style.minHeight = '140px';
            spam.style.zIndex = '200';

            spam.style.border = '2px solid #0f0';
            spam.style.background = '#000';
            spam.style.color = '#0f0';
            spam.style.boxShadow = '0 0 10px #0f0';
            spam.style.transition = 'top 0.9s ease, left 0.9s ease';

            spam.style.top = Math.random() * 60 + 10 + '%';
            spam.style.left = Math.random() * 70 + '%';

            const randomPhrase = scaryPhrases[Math.floor(Math.random() * scaryPhrases.length)];

            spam.innerHTML = `
                <div class="window-header" style="background: #000; border-bottom: 1px solid #0f0; padding: 5px;">
                    <span class="window-title scary-text" style="color: red;">☣️ ALERTA ☣️</span>
                    <button class="control-btn close" data-action="kill-spam" style="width:25px; height:25px;"></button>
                </div>
                <div class="window-body scary-text" style="padding: 15px; font-size: 0.9rem; pointer-events: none; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                    <p style="font-weight:bold; font-size: 1.2rem; margin-bottom:10px;">${randomPhrase}</p>
                    <span style="font-size: 0.7rem; color: #666;">CLIQUE NO X PARA DELETAR</span>
                </div>
            `;
            windowsArea.appendChild(spam);
        }

        MascotUI.say("O SISTEMA FOI INVADIDO! FECHE AS JANELAS PARA ACHAR O VÍRUS!");
        this.startChaosMovement();
    },

    startChaosMovement() {
        if (movementInterval) clearInterval(movementInterval);
        this.moveAllElements();
        movementInterval = setInterval(() => {
            if (!$('.boss-virus')) {
                this.stopMovement();
                return;
            }
            this.moveAllElements();
        }, 800);
    },

    moveAllElements() {
        const boss = $('.boss-virus');
        if (boss) this.moveElementRandomly(boss, 5, 80);

        const spams = $$('.virus-spam');
        spams.forEach(spam => this.moveElementRandomly(spam, 0, 75));
    },

    moveElementRandomly(el, min, max) {
        el.style.top = Math.floor(Math.random() * (max - min) + min) + '%';
        el.style.left = Math.floor(Math.random() * (max - min) + min) + '%';
    },

    stopMovement() {
        if (movementInterval) {
            clearInterval(movementInterval);
            movementInterval = null;
        }
    },

    handleMascotNext() {
        MascotUI.say("Não posso fazer nada! Limpe o sistema clicando no X das janelas!");
    },

    handleInteraction(action, id) {
        const challenge = challenges[currentChallengeIndex];

        if (action === 'close-window' && id === challenge.id) {
            $('#windows-area').innerHTML = '';
            MascotUI.say(challenge.mascotCorrect);
            GameState.addScore(20);
            this.nextLevel();
        }

        else if (['download-virus', 'open-link'].includes(action)) {
            MascotUI.say("NÃO!!! CUIDADO!!");
            GameState.addError();
            this.triggerBossBattle();
        }

        else if (action === 'kill-spam' || (action === undefined && event.target.closest('.virus-spam'))) {
            const spamEl = event.target.closest('.virus-spam');
            if (spamEl) {
                spamEl.remove();
                spamCount--;
                if (spamCount > 0) {
                    MascotUI.say(`FALTAM ${spamCount}! CONTINUE FECHANDO!`);
                } else {
                    this.makeBossVulnerable();
                }
            }
        }

        else if (action === 'kill-boss' || (action === undefined && event.target.closest('.boss-virus'))) {
            if (spamCount > 0) {
                MascotUI.say("ELE ESTÁ PROTEGIDO! FECHE AS JANELAS NO 'X' PRIMEIRO!");
            } else {
                const boss = $('.boss-virus');
                boss.style.transition = "all 0.5s";
                boss.style.transform = "scale(3)";
                boss.style.opacity = "0";
                setTimeout(() => boss.remove(), 500);
                this.stopMovement();
                MascotUI.say("UFA! VÍRUS ELIMINADO. ESSA FOI POR POUCO!");
                this.nextLevel();
            }
        }
    },

    makeBossVulnerable() {
        const boss = $('.boss-virus');
        if (boss) {
            boss.style.zIndex = '300';
            boss.style.border = '5px solid #fff';
            boss.style.background = '#f00';
            boss.style.cursor = 'pointer';
            boss.classList.remove('scary-shake');
            $('#boss-face').innerText = '🤬';
            MascotUI.say("AGORA!!! CLIQUE NO MONSTRO PARA ACABAR COM ELE!!!");
        }
    },

    nextLevel() {
        currentChallengeIndex++;
        setTimeout(() => this.spawnChallenge(), 3000);
    },

    finishPhase() {
        this.stopMovement();

        // Chamada do Popup de finalização configurado para avançar de fase
        PopupUI.show(
            "SISTEMA RECUPERADO! 🛡️",
            `Excelente! Você limpou todos os vírus e protegeu seus dados.\n\nPontos: ${GameState.getScore()} | Erros: ${GameState.getErrors()}`,
            "AVANÇAR PARA FASE 3 ➡️", // Texto do botão
            () => {
                // Ação: Redireciona para a Fase 3
                window.location.href = '../fase3/fase3.html';
            }
        );

        // Opcional: Uma comemoração visual final antes de sair
        MascotUI.celebrate();
    }
};