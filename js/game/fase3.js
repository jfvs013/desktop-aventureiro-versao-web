/**
 * js/game/fase3.js
 * Lógica da Fase 3: O Laboratório de Poções Mágicas
 * Foco: Drag & Drop, Feedback Visual e Educação sobre Senhas.
 */
import { $, $$, on } from '../core/helpers.js';
import { GameState } from '../core/state.js';
import { MascotUI } from '../ui/mascote.js';
import { PopupUI } from '../ui/popup.js';

// 1. Definição dos Ingredientes (O "Banco de Dados" da Fase)
const INGREDIENTS = [
    // Ingredientes Fortes (Aumentam a segurança)
    { id: 's1', emoji: '💎', label: '@#$', type: 'strong', msg: "Incrível! Símbolos tornam a poção indestrutível!" },
    { id: 's2', emoji: '🧬', label: 'AbC', type: 'strong', msg: "Misturar letras grandes e pequenas é pura magia!" },
    { id: 's3', emoji: '⚡', label: '789', type: 'strong', msg: "Números dão um choque de energia na segurança!" },
    { id: 's4', emoji: '🧪', label: '&!?', type: 'strong', msg: "Mais símbolos! O hacker não vai perceber nada!" },
    
    // Ingredientes Fracos (Diminuem a segurança)
    { id: 'w1', emoji: '🦴', label: '123', type: 'weak', msg: "Eca! Sequências como '123' são ingredientes estragados." },
    { id: 'w2', emoji: '👟', label: 'nome', type: 'weak', msg: "Usar o próprio nome? Isso é muito fácil de descobrir!" },
    { id: 'w3', emoji: '🎂', label: '2015', type: 'weak', msg: "Datas de nascimento? O vilão vai adivinhar num segundo!" }
];

let potionStrength = 15; // Começa com um pouco de base
let isPhaseActive = false;

export const Phase3 = {
    /**
     * Inicialização da Fase
     */
    init() {
        console.log("Laboratório de Alquimia Digital: Iniciado.");
        GameState.setPhase(3);
        
        isPhaseActive = true;
        potionStrength = 15;

        // Transição de ecrãs no HTML
        $('#virtual-desktop').classList.add('hidden');
        $('#phase3-lab').classList.remove('hidden');

        this.renderShelf();
        this.bindEvents();
        this.updateUI();

        MascotUI.celebrate();
        MascotUI.say("Bem-vindo ao meu laboratório! Arraste os ingredientes BRILHANTES para criar a poção secreta.");
    },

    /**
     * Renderiza os frascos na prateleira de forma aleatória
     */
    renderShelf() {
        const shelf = $('#ingredients-pool');
        if (!shelf) return;
        
        shelf.innerHTML = '';
        
        // Baralhar para cada jogo ser diferente
        const shuffled = [...INGREDIENTS].sort(() => Math.random() - 0.5);

        shuffled.forEach(item => {
            const flask = document.createElement('div');
            flask.className = 'flask';
            flask.setAttribute('draggable', 'true');
            flask.dataset.id = item.id;
            
            flask.innerHTML = `
                <div class="flask-icon">${item.emoji}</div>
                <small>${item.label}</small>
            `;
            
            shelf.appendChild(flask);
        });
    },

    /**
     * Configuração do Drag and Drop (API Nativa)
     */
    bindEvents() {
        const cauldron = $('#magic-cauldron');
        const flasks = $$('.flask');

        flasks.forEach(flask => {
            on(flask, 'dragstart', (e) => {
                e.dataTransfer.setData('text/plain', flask.dataset.id);
                flask.classList.add('dragging');
            });

            on(flask, 'dragend', () => {
                flask.classList.remove('dragging');
            });
        });

        // Eventos do Caldeirão (Zona de Drop)
        on(cauldron, 'dragover', (e) => {
            e.preventDefault(); // Necessário para permitir o drop
            cauldron.classList.add('drag-over');
        });

        on(cauldron, 'dragleave', () => {
            cauldron.classList.remove('drag-over');
        });

        on(cauldron, 'drop', (e) => {
            e.preventDefault();
            cauldron.classList.remove('drag-over');
            
            const ingredientId = e.dataTransfer.getData('text/plain');
            this.handleDrop(ingredientId);
        });
    },

    /**
     * Lógica disparada quando um item cai no caldeirão
     */
    handleDrop(id) {
        const item = INGREDIENTS.find(i => i.id === id);
        if (!item) return;

        if (item.type === 'strong') {
            this.onSuccess(item);
        } else {
            this.onError(item);
        }

        this.updateUI();
        this.checkVictory();
    },

    onSuccess(item) {
        potionStrength += 20;
        GameState.addScore(25);
        
        this.playEffect('stars');
        MascotUI.celebrate();
        
        this.setFeedback(item.msg, '#00ffcc');
    },

    onError(item) {
        potionStrength = Math.max(0, potionStrength - 15);
        GameState.addError(); // Registamos o erro no estado global
        
        this.playEffect('smoke');
        MascotUI.scared();
        
        this.setFeedback(item.msg, '#ff4040');
    },

    /**
     * Efeitos Visuais (Partículas de Emojis)
     */
    playEffect(type) {
        const container = $('#cauldron-fx');
        const particle = document.createElement('div');
        particle.className = 'effect-particle';
        particle.innerText = type === 'stars' ? '✨' : '💨';
        
        container.appendChild(particle);

        // Animação via código para ser dinâmica
        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 50;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${Math.cos(angle)*dist}px, ${-dist}px) scale(2)`, opacity: 0 }
        ], { duration: 1000, easing: 'ease-out' }).onfinish = () => particle.remove();
    },

    setFeedback(text, color) {
        const log = $('#alchemy-feedback');
        log.innerText = text;
        log.style.color = color;
        log.style.fontWeight = 'bold';
    },

    updateUI() {
        const bar = $('#potion-strength-bar');
        const status = $('#potion-status-text');
        
        const displayWidth = Math.min(100, potionStrength);
        bar.style.width = displayWidth + '%';

        // Atualiza o texto semântico
        if (displayWidth < 40) status.innerText = "POÇÃO VULNERÁVEL";
        else if (displayWidth < 80) status.innerText = "POÇÃO EM PREPARO";
        else status.innerText = "POÇÃO MESTRE ATIVADA!";
    },

    checkVictory() {
        if (potionStrength >= 100 && isPhaseActive) {
            isPhaseActive = false; // Evita disparar múltiplos popups
            
            setTimeout(() => {
                PopupUI.show(
                    "MESTRE DA SEGURANÇA!",
                    "Incrível! Criaste uma poção de invisibilidade contra hackers. O teu computador está agora totalmente seguro!",
                    "VER CERTIFICADO",
                    () => {
                        this.showFinalScore();
                    }
                );
            }, 800);
        }
    },

    showFinalScore() {
        const finalScore = GameState.getScore();
        PopupUI.show(
            "MISSÃO CUMPRIDA!",
            `Pontuação Total: ${finalScore} pontos.\nObrigado por ajudares o Cãozinho Azul!`,
            "JOGAR NOVAMENTE",
            () => location.reload()
        );
    }
};