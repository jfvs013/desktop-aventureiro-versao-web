/**
 * js/game/fase1.js
 * Lógica da Fase 1: Ambientação e Organização
 * ATUALIZADO: Integração com animações do Mascote e mais efeitos visuais.
 */
import { DesktopUI } from '../ui/desktop.js';
import { MascotUI } from '../ui/mascote.js';
import { GameState } from '../core/state.js';
import { PopupUI } from '../ui/popup.js';
import { $, $$ } from '../core/helpers.js';

// (Estilos CSS de partículas e timer permanecem os mesmos do código anterior, omitidos para brevidade, mas necessários)
// --- INJEÇÃO DE ESTILOS VISUAIS DA FASE 1 ---
const styles = document.createElement('style');
styles.innerHTML = `
    @keyframes floatUp { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-50px); opacity: 0; } }
    .floating-text { position: absolute; font-weight: bold; font-size: 1.5rem; color: #ffeb3b; z-index: 1000; animation: floatUp 1s ease-out forwards; pointer-events: none; text-shadow: 2px 2px 0 #000; }
    
    /* Partículas mais divertidas (Círculos e Estrelas girando) */
    @keyframes spin { 100% { transform: rotate(360deg); } }
    .particle { position: absolute; width: 12px; height: 12px; pointer-events: none; z-index: 999; background-size: contain; }
    .particle.star { clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); animation: spin 0.5s linear infinite; }
    .particle.circle { border-radius: 50%; }

    .file-locked { filter: grayscale(100%) brightness(0.7); cursor: not-allowed !important; opacity: 0.6; }
    .file-locked:after { content: '🔒'; position: absolute; top: -10px; right: -10px; font-size: 1.5rem; }
    #timer-container { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 300px; height: 20px; background: #0a2342; border: 2px solid #40a0ff; border-radius: 10px; overflow: hidden; z-index: 500; box-shadow: 0 0 10px #40a0ff; }
    #timer-bar { width: 100%; height: 100%; background: linear-gradient(90deg, #00ff00, #ffff00, #ff0000); transition: width 1s linear; }
`;
document.head.appendChild(styles);

// Configuração
const TRASH_ITEMS = ['🍌', '🥤', '🧦', '🦴', '🕸️', '🍟', '🦠', '💩']; // Mais itens nojentos
const FILE_ITEMS = ['📁', '📃', '📊', '📷'];

let trashLeft = 0;
let filesLeft = 0;
let timerInterval = null;
let timeLeft = 0;
const MAX_TIME = 50; 

export const Phase1 = {
    init() {
        console.log("Fase 1 Iniciada: Polished Mode");
        GameState.setPhase(1);
        $('#desktop-icons-area').innerHTML = ''; 
        $('#windows-area').innerHTML = ''; 

        if (!$('#timer-container')) {
            const timerDiv = document.createElement('div');
            timerDiv.id = 'timer-container';
            timerDiv.innerHTML = '<div id="timer-bar"></div>';
            $('#game-app').appendChild(timerDiv);
        }

        MascotUI.say("REGRA DE OURO: Primeiro jogue o LIXO fora, DEPOIS salve os arquivos!");
        setTimeout(() => this.spawnMess(), 1000);
    },

    spawnMess() {
        const desktop = $('#desktop-icons-area');
        desktop.innerHTML = ''; 
        trashLeft = 10; 
        filesLeft = 5;  
        this.startTimer();

        for (let i = 0; i < filesLeft; i++) {
            const fileEmoji = FILE_ITEMS[Math.floor(Math.random() * FILE_ITEMS.length)];
            this.createItem(fileEmoji, 'file', `Documento ${i}`, true); 
        }
        for (let i = 0; i < trashLeft; i++) {
            const trashEmoji = TRASH_ITEMS[Math.floor(Math.random() * TRASH_ITEMS.length)];
            this.createItem(trashEmoji, 'trash', `Lixo ${i}`, false);
        }
    },

    createItem(emoji, type, label, isLocked) {
        const desktop = $('#desktop-icons-area');
        const btn = document.createElement('button');
        btn.className = 'desktop-icon';
        if (isLocked) btn.classList.add('file-locked');
        btn.dataset.type = type;
        btn.dataset.id = label;
        
        btn.style.position = 'absolute';
        btn.style.fontSize = '3.5rem'; // Ícones ainda maiores
        btn.style.top = Math.floor(Math.random() * 75) + 10 + '%';
        btn.style.left = Math.floor(Math.random() * 88) + 2 + '%';
        btn.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        // Efeito visual ao passar o mouse (Hover Scale mais forte)
        btn.onmouseenter = () => { if(!btn.classList.contains('file-locked')) btn.style.transform = 'scale(1.2) rotate(5deg)'; };
        btn.onmouseleave = () => { if(!btn.classList.contains('file-locked')) btn.style.transform = 'scale(1) rotate(0deg)'; };

        btn.innerHTML = `<div style="pointer-events: none; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.4));">${emoji}</div>`;
        
        btn.animate([{ transform: 'scale(0) rotate(-180deg)' }, { transform: 'scale(1) rotate(' + (Math.random()*20-10) + 'deg)' }], { duration: 500, easing: 'ease-out' });
        desktop.appendChild(btn);
    },

    startTimer() {
        timeLeft = MAX_TIME;
        const timerBar = $('#timer-bar');
        timerBar.style.width = '100%';
        if (timerInterval) clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            timeLeft--;
            timerBar.style.width = `${(timeLeft / MAX_TIME) * 100}%`;
            if (timeLeft <= 10) {
                timerBar.style.background = '#ff0000';
                if (timeLeft % 2 === 0) MascotUI.scared(); // Mascote treme no final do tempo
            }
            if (timeLeft <= 0) this.gameOver();
        }, 1000);
    },

    gameOver() {
        clearInterval(timerInterval);
        MascotUI.scared();
        PopupUI.show("Tempo Esgotado!", "A bagunça venceu! Vamos tentar ser mais rápidos.", "Reiniciar Fase", () => this.init());
    },

    handleMascotNext() { /* Lógica do botão continuar (opcional na fase 1) */ },

    handleInteraction(action, id) {
        const element = document.querySelector(`.desktop-icon[data-id="${id}"]`);
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const type = element.dataset.type;

        if (type === 'trash') {
            this.cleanTrash(element, x, y);
        } else if (type === 'file') {
            if (trashLeft > 0) this.rejectFileInteraction(element);
            else this.organizeFile(element, x, y);
        }
    },

    rejectFileInteraction(element) {
        element.animate([
            { transform: 'translateX(0)' }, { transform: 'translateX(-10px) rotate(-5deg)' }, 
            { transform: 'translateX(10px) rotate(5deg)' }, { transform: 'translateX(0)' }
        ], { duration: 300 });
        
        MascotUI.scared(); // MASCOTE TREME DE MEDO DO ERRO
        MascotUI.say("Não! O ambiente está sujo. Limpe o LIXO primeiro!");
    },

    cleanTrash(element, x, y) {
        // Efeito sonoro visual (Screen Shake leve)
        document.getElementById('game-app').animate([{transform: 'translate(0,0)'}, {transform: 'translate(2px, 3px)'}, {transform: 'translate(-2px, -1px)'}, {transform: 'translate(0,0)'}], {duration: 100});
        
        this.spawnParticles(x, y, ['#8d6e63', '#ff5722', '#795548']); // Cores de sujeira
        this.spawnFloatingText(x, y, "Faxina!");
        GameState.addScore(10);
        element.remove();
        trashLeft--;

        if (trashLeft <= 0) this.unlockFiles();
        else if (Math.random() > 0.7) MascotUI.say("Isso! Fora sujeira!");
    },

    unlockFiles() {
        MascotUI.celebrate(); // MASCOTE PULA DE ALEGRIA
        MascotUI.say("Limpeza concluída! AGORA SALVE OS ARQUIVOS!");
        const files = $$('.desktop-icon[data-type="file"]');
        files.forEach(file => {
            file.classList.remove('file-locked');
            file.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }], { duration: 400 });
        });
    },

    organizeFile(element, x, y) {
        if (element.classList.contains('organized')) return;
        this.spawnParticles(x, y, ['#00ffff', '#ffffff', '#40a0ff'], true); // Partículas brilhantes (estrelas)
        this.spawnFloatingText(x, y, "Salvo!", '#00ffff');

        const organizedCount = document.querySelectorAll('.organized').length;
        element.classList.add('organized');
        element.style.transition = "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"; // Pulo elástico forte
        element.style.top = '20px';
        element.style.left = (30 + (organizedCount * 100)) + 'px'; 
        element.style.transform = 'scale(0.9)';
        element.innerHTML = `<div style="pointer-events: none; filter: drop-shadow(0 0 10px #00ffff);">✅</div>`;

        GameState.addScore(20);
        filesLeft--;
        
        MascotUI.celebrate(); // PULA A CADA ARQUIVO SALVO
        
        if (filesLeft <= 0) this.finishPhase();
    },

    finishPhase() {
        clearInterval(timerInterval);
        $('#timer-container').remove();
        setTimeout(() => {
            // Chuva de confete final
            for(let i=0;i<8;i++) setTimeout(() => this.spawnParticles(Math.random()*window.innerWidth, window.innerHeight, null, true), i*150);
            
            PopupUI.show("Fase 1 Concluída!", `Você organizou tudo com ${timeLeft}s sobrando!`, "Ir para o Desafio Real", () => {
                document.dispatchEvent(new CustomEvent('game:change-phase', { detail: 2 }));
            });
        }, 1000);
    },

    // --- EFEITOS VISUAIS MELHORADOS ---
    spawnParticles(x, y, colors, useStars) {
        const container = document.body; // Partículas globais para não ficarem presas no container do desktop
        for (let i = 0; i < 10; i++) {
            const p = document.createElement('div');
            p.className = `particle ${useStars ? 'star' : 'circle'}`;
            const color = colors ? colors[Math.floor(Math.random() * colors.length)] : `hsl(${Math.random() * 360}, 100%, 60%)`;
            p.style.backgroundColor = useStars ? color : color;
            if(useStars) p.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
            
            p.style.left = (x - 6) + 'px'; p.style.top = (y - 6) + 'px';
            container.appendChild(p);
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 80 + 40;
            p.animate([
                { transform: `translate(0,0) scale(1) rotate(0deg)`, opacity: 1 },
                { transform: `translate(${Math.cos(angle)*velocity}px, ${Math.sin(angle)*velocity}px) scale(0) rotate(${Math.random()*360}deg)`, opacity: 0 }
            ], { duration: 800, fill: 'forwards', easing: 'cubic-bezier(0, .9, .57, 1)' }).onfinish = () => p.remove();
        }
    },

    spawnFloatingText(x, y, text, color) {
        const container = document.body;
        const el = document.createElement('div');
        el.className = 'floating-text';
        el.innerText = text;
        if(color) el.style.color = color;
        el.style.left = (x - 20) + 'px'; el.style.top = (y - 20) + 'px';
        container.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    }
};