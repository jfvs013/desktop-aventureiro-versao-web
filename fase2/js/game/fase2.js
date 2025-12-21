/**
 * js/game/fase2.js
 * Lógica da Fase 2: Segurança Digital
 * ATUALIZADO: Visual "Scary/Glitch" para dar susto nas crianças.
 */
import { DesktopUI } from '../ui/desktop.js';
import { MascotUI } from '../ui/mascote.js';
import { GameState } from '../core/state.js';
import { PopupUI } from '../ui/popup.js';
import { $, $$ } from '../core/helpers.js';

// --- INJEÇÃO DE ESTILOS DE TERROR (CSS in JS) ---
// Adiciona animação de "tremor" para deixar as janelas nervosas
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
    .scary-shake {
        animation: glitch-shake 0.5s infinite;
    }
    .scary-text {
        font-family: 'Courier New', monospace;
        text-transform: uppercase;
        letter-spacing: 2px;
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

// Frases aleatórias para os pop-ups de terror
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
                    <button class="control-btn close" data-action="close-window" data-id="${challenge.id}" aria-label="Fechar Janela"></button>
                </div>
            </div>
            <div class="window-body">
                ${challenge.content}
            </div>
        `;

        windowsArea.appendChild(winEl);
        MascotUI.say("O que você faz com essa janela?");
    },

    // --- LÓGICA DO TERROR (BOSS BATTLE) ---

    triggerBossBattle() {
        const windowsArea = $('#windows-area');
        windowsArea.innerHTML = ''; 
        
        spamCount = 7; // Mais janelas para mais caos
        
        // 1. Cria o CHEFE (Cranio Vermelho) - Fica atrás (z-index menor)
        const boss = document.createElement('div');
        boss.className = 'window-card boss-virus scary-shake'; // Adiciona tremor
        boss.dataset.action = "kill-boss";
        
        boss.style.position = 'absolute';
        boss.style.width = '160px';
        boss.style.height = '160px';
        boss.style.zIndex = '100'; 
        
        // Visual Assustador do Chefe
        boss.style.border = '5px solid #ff0000';
        boss.style.borderRadius = '50%';
        boss.style.background = '#000';
        boss.style.display = 'flex';
        boss.style.alignItems = 'center';
        boss.style.justifyContent = 'center';
        boss.style.cursor = 'not-allowed';
        boss.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.8)'; // Brilho vermelho
        boss.style.transition = 'top 0.6s ease-out, left 0.6s ease-out'; // Movimento mais rápido e nervoso

        boss.innerHTML = `
            <div style="font-size: 5rem; pointer-events: none; filter: drop-shadow(0 0 10px red);" id="boss-face">💀</div>
        `;
        windowsArea.appendChild(boss);

        // 2. Cria os Pop-ups de Spam (Glitchy Style)
        for (let i = 0; i < spamCount; i++) {
            const spam = document.createElement('div');
            spam.className = 'window-card virus-spam';
            spam.dataset.action = "kill-spam"; 
            
            spam.style.position = 'absolute';
            spam.style.width = '240px';
            spam.style.minHeight = '140px';
            spam.style.zIndex = '200'; 
            
            // Estilo Hacker/Terminal
            spam.style.border = '2px solid #0f0'; // Verde Matrix
            spam.style.background = '#000';
            spam.style.color = '#0f0';
            spam.style.boxShadow = '0 0 10px #0f0';
            spam.style.transition = 'top 0.9s ease, left 0.9s ease';
            
            // Posição aleatória
            spam.style.top = Math.random() * 60 + 10 + '%';
            spam.style.left = Math.random() * 70 + '%';

            // Texto aleatório assustador
            const randomPhrase = scaryPhrases[Math.floor(Math.random() * scaryPhrases.length)];

            spam.innerHTML = `
                <div class="window-header" style="background: #000; border-bottom: 1px solid #0f0; padding: 5px;">
                    <span class="window-title scary-text" style="color: red;">☣️ ALERTA ☣️</span>
                </div>
                <div class="window-body scary-text" style="padding: 15px; font-size: 0.9rem; pointer-events: none; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                    <p style="font-weight:bold; font-size: 1.2rem; margin-bottom:10px;">${randomPhrase}</p>
                    <span style="font-size: 0.7rem; color: #666;">CLIQUE PARA DELETAR</span>
                </div>
            `;
            windowsArea.appendChild(spam);
        }
        
        MascotUI.say("O SISTEMA FOI INVADIDO! DELETE AS MENSAGENS PARA ACHAR O VÍRUS!");

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
        }, 800); // Movimento um pouco mais rápido para aumentar tensão
    },

    moveAllElements() {
        const boss = $('.boss-virus');
        if (boss) {
            this.moveElementRandomly(boss, 5, 80);
        }

        const spams = $$('.virus-spam');
        spams.forEach(spam => {
            this.moveElementRandomly(spam, 0, 75);
        });
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

    // --- INTERAÇÕES ---

    handleMascotNext() {
        MascotUI.say("Não posso fazer nada! Limpe o sistema!");
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
            // ERROU: Chama o terror
            MascotUI.say("NÃO!!! CUIDADO!!"); // Fala curta de susto
            GameState.addError();
            this.triggerBossBattle();
        }

        else if (action === 'kill-spam' || (action === undefined && event.target.closest('.virus-spam'))) {
            const spamEl = event.target.closest('.virus-spam');
            if (spamEl) {
                spamEl.remove();
                spamCount--;
                
                if (spamCount > 0) {
                    // Texto em caixa alta para urgência
                    MascotUI.say(`FALTAM ${spamCount}! ELIMINE ELES!`);
                } else {
                    this.makeBossVulnerable();
                }
            }
        }

        else if (action === 'kill-boss' || (action === undefined && event.target.closest('.boss-virus'))) {
            if (spamCount > 0) {
                MascotUI.say("ELE ESTÁ PROTEGIDO! DELETE AS JANELAS PRETAS!");
            } else {
                // VITÓRIA
                const boss = $('.boss-virus');
                
                // Animação de "explosão" do chefe
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
            boss.style.border = '5px solid #fff'; // Borda branca pisca
            boss.style.background = '#f00'; // Fundo Vermelho vivo
            boss.style.cursor = 'pointer';
            boss.classList.remove('scary-shake'); // Para de tremer para facilitar o clique
            
            $('#boss-face').innerText = '🤬'; // Demônio/Monstro
            
            MascotUI.say("AGORA!!! ACABE COM ELE!!!");
        }
    },

    nextLevel() {
        currentChallengeIndex++;
        setTimeout(() => this.spawnChallenge(), 3000);
    },

    finishPhase() {
        this.stopMovement();
        PopupUI.show(
            "Sistema Recuperado",
            `Você sobreviveu ao ataque!\nPontos: ${GameState.getScore()} | Erros: ${GameState.getErrors()}`,
            "Reiniciar",
            () => location.reload()
        );
    }
};