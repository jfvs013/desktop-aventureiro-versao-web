import { $, $$, on } from '../core/helpers.js';
import { GameState } from '../core/state.js';
import { MascotUI } from '../ui/mascote.js';
import { PopupUI } from '../../fase3/js/ui/popup.js';

const ARCADE_SETTINGS = {
    weakPasswords: ['12345', 'senha123', 'admin', 'qwerty'],
    strongChars: ['@', '#', '$', '!', '&', 'K', '9'],
    spawnRate: 1200,
    itemSpeed: 4
};

let gameActive = false;
let arcadeInterval = null;
let itemsInField = [];
let strengthLevel = 50;

export const Phase3 = {
    init() {
        GameState.setPhase(3);
        $('#virtual-desktop').classList.add('hidden');
        $('#phase3-arcade').classList.remove('hidden');

        strengthLevel = 50;
        gameActive = true;
        itemsInField = [];
        
        this.updateHUD();
        this.setupControls();
        
        MascotUI.say("FASE FINAL! Bloqueie as senhas fracas e pegue os símbolos brilhantes com o ESCUDO!");

        arcadeInterval = setInterval(() => {
            if (gameActive) this.spawnItem();
        }, ARCADE_SETTINGS.spawnRate);

        this.gameLoop();
    },

    setupControls() {
        const shield = $('#player-shield');
        const gameArea = $('#arcade-game-area');
        on(document, 'mousemove', (e) => {
            if (!gameActive) return;
            const rect = gameArea.getBoundingClientRect();
            let x = e.clientX - rect.left;
            x = Math.max(40, Math.min(x, rect.width - 40));
            shield.style.left = x + 'px';
        });
    },

    spawnItem() {
        const area = $('#arcade-game-area');
        const isStrong = Math.random() > 0.6;
        const item = document.createElement('div');
        item.className = `falling-item ${isStrong ? 'good-char' : 'bad-pass'}`;
        item.innerText = isStrong ? ARCADE_SETTINGS.strongChars[Math.floor(Math.random() * ARCADE_SETTINGS.strongChars.length)] : ARCADE_SETTINGS.weakPasswords[Math.floor(Math.random() * ARCADE_SETTINGS.weakPasswords.length)];
        item.style.left = (Math.random() * 80 + 10) + '%';
        item.style.top = '-50px';
        area.appendChild(item);
        itemsInField.push({ el: item, y: -50, type: isStrong ? 'good' : 'bad' });
    },

    gameLoop() {
        if (!gameActive) return;
        const shield = $('#player-shield');
        const shieldRect = shield.getBoundingClientRect();

        for (let i = itemsInField.length - 1; i >= 0; i--) {
            const item = itemsInField[i];
            item.y += ARCADE_SETTINGS.itemSpeed;
            item.el.style.top = item.y + 'px';
            const itemRect = item.el.getBoundingClientRect();

            if (this.checkCollision(shieldRect, itemRect)) {
                this.handleCollision(item, i);
            } else if (item.y > window.innerHeight - 150) {
                this.handleMiss(item, i);
            }
        }
        requestAnimationFrame(() => this.gameLoop());
    },

    checkCollision(rect1, rect2) {
        return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
    },

    handleCollision(item, index) {
        if (item.type === 'bad') {
            MascotUI.celebrate();
            GameState.addScore(10);
            strengthLevel = Math.min(100, strengthLevel + 5);
        } else {
            strengthLevel = Math.max(0, strengthLevel - 10);
            MascotUI.scared();
        }
        this.removeItem(item, index);
        this.updateHUD();
    },

    handleMiss(item, index) {
        if (item.type === 'bad') {
            strengthLevel = Math.max(0, strengthLevel - 15);
            MascotUI.scared();
        }
        this.removeItem(item, index);
        this.updateHUD();
    },

    removeItem(item, index) {
        item.el.remove();
        itemsInField.splice(index, 1);
    },

    updateHUD() {
        const bar = $('#password-strength-bar');
        const text = $('#strength-text');
        bar.style.width = strengthLevel + '%';
        text.textContent = strengthLevel < 40 ? "FRACA" : strengthLevel < 80 ? "MÉDIA" : "FORTE";
        if (strengthLevel <= 0) this.endGame(false);
        if (strengthLevel >= 100) this.endGame(true);
    },

    endGame(win) {
        gameActive = false;
        clearInterval(arcadeInterval);
        PopupUI.show(win ? "SENHA MESTRE!" : "SISTEMA INVADIDO!", win ? "Sua senha é indestrutível!" : "As senhas fracas quebraram sua defesa.", "Reiniciar", () => location.reload());
    }
};