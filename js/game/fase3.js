/**
 * js/game/fase3.js
 * Fase 3: Escudo de Senhas (Versão Blindada)
 * Correção: Popup integrado para garantir que o fim de jogo apareça.
 */
import { $, on } from '../core/helpers.js';
import { GameState } from '../core/state.js';
import { MascotUI } from '../ui/mascote.js';

// --- CONFIGURAÇÕES ---
const CONFIG = {
    spawnRate: 1300,
    gravity: 3.5,
    winScore: 300,      // Pontos para passar de fase
    chargeRequired: 3,
    timeLimit: 60,      // Tempo de jogo
    penaltyWeak: 20,
    penaltyStrong: 30
};

const DATA = {
    weak: ["12345", "admin", "senha", "amor", "1111", "gato", "abcde", "data123"],
    strong: ["S3nh@!", "G@to#99", "P@ss12", "Vid@$10", "R4io!", "Lu@#77", "Azul*5", "Key$9"]
};

let state = {
    active: false,
    lives: 100,
    charge: 0,
    hits: 0,
    time: CONFIG.timeLimit,
    timerInterval: null,
    timers: [],
    dom: {}
};

export const Phase3 = {
    init() {
        console.log("🛡️ Iniciando Fase 3 (Modo Seguro)...");
        GameState.setPhase(3);

        state.dom = {
            arena: $('#game-arena'),
            shield: $('#player-shield'),
            score: $('#arcade-score'),
            livesBar: $('#arcade-lives-bar'),
            hudRight: $('.hud-right')
        };

        if (!state.dom.arena) return;

        this.injectTimerUI();

        // Limpeza Visual
        state.dom.arena.innerHTML = '';
        if (state.dom.shield) state.dom.arena.appendChild(state.dom.shield);

        // Reset
        state.active = true;
        state.lives = 100;
        state.charge = 0;
        state.hits = 0;
        state.time = CONFIG.timeLimit;

        this.clearTimers();
        this.updateUI();

        this.setupControls();
        this.gameLoop();
        this.startTimer();

        this.safeMascotSay("O tempo está correndo! Filtre os dados!");
    },

    // --- SISTEMA DE PONTOS ---
    addSafeScore(amount) {
        if (amount > 0) {
            GameState.addScore(amount);
        } else {
            const current = GameState.getScore();
            // Evita pontuação negativa
            if (current + amount < 0) GameState.addScore(-current);
            else GameState.addScore(amount);
        }
        this.updateUI();
    },

    // --- RELÓGIO ---
    injectTimerUI() {
        let timerEl = $('#arcade-timer');
        if (timerEl) {
            state.dom.timerDisplay = timerEl;
            return;
        }
        const container = document.createElement('div');
        container.innerHTML = `<span style="font-size:1.2rem;margin-right:5px;">⏳</span><span id="arcade-timer" style="font-family:monospace;font-size:1.5rem;color:#ffcc00;">${CONFIG.timeLimit}</span>`;
        Object.assign(container.style, { display: 'flex', alignItems: 'center', marginLeft: '20px', background: 'rgba(0,0,0,0.5)', padding: '5px 12px', borderRadius: '6px', border: '1px solid #ffcc00' });

        const hud = document.querySelector('.arcade-hud') || document.body;
        hud.appendChild(container);

        // Fix para caso não tenha HUD
        if (hud === document.body) {
            container.style.position = 'fixed'; container.style.top = '10px'; container.style.right = '10px'; container.style.zIndex = '1000';
        }

        state.dom.timerDisplay = $('#arcade-timer');
    },

    startTimer() {
        if (state.timerInterval) clearInterval(state.timerInterval);

        state.timerInterval = setInterval(() => {
            if (!state.active) { clearInterval(state.timerInterval); return; }

            state.time--;
            this.updateUI();

            // CHECAGEM DE FIM DE TEMPO
            if (state.time <= 0) {
                clearInterval(state.timerInterval);
                state.time = 0; // Trava no zero visualmente
                this.updateUI();
                this.handleTimeOut(); // Chama o fim de jogo
            }
            else if (state.time === 10) {
                if (state.dom.timerDisplay) state.dom.timerDisplay.style.color = "#ff4444";
                this.safeMascotSay("Reta final! 10 segundos!");
            }
        }, 1000);
    },

    handleTimeOut() {
        console.log("Tempo esgotado! Verificando vitória...");
        state.active = false;
        this.clearTimers();

        const finalScore = GameState.getScore();

        if (finalScore >= CONFIG.winScore) {
            this.showCustomModal(true, finalScore);
        } else {
            this.showCustomModal(false, finalScore);
        }
    },

    // --- POPUP MANUAL (GARANTIA DE FUNCIONAMENTO) ---
    showCustomModal(victory, score) {
        // Remove modal antigo se existir
        const old = document.getElementById('custom-modal-overlay');
        if (old) old.remove();

        const title = victory ? "PARABÉNS! FASE CONCLUÍDA 🚀" : "GAME OVER 💀";
        const message = victory
            ? `Você protegeu o sistema!\nPontuação Final: <strong style="color:#00ff88; font-size:1.5rem">${score}</strong>`
            : `Tempo esgotado!\nPontuação: ${score} (Meta: ${CONFIG.winScore})`;

        const btnText = victory ? "IR PARA FASE 4 ➡️" : "TENTAR DE NOVO 🔄";
        const btnAction = victory
            ? () => window.location.href = "../fase4/fase4.html" // Ajuste o caminho aqui se precisar (ex: ../fase4/fase4.html)
            : () => location.reload();

        // Cria o HTML do Modal na força bruta
        const overlay = document.createElement('div');
        overlay.id = 'custom-modal-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 9999, backdropFilter: 'blur(5px)'
        });

        const box = document.createElement('div');
        Object.assign(box.style, {
            background: '#0a1525', border: `2px solid ${victory ? '#00ff88' : '#ff4444'}`,
            padding: '40px', borderRadius: '15px', textAlign: 'center', color: 'white',
            boxShadow: `0 0 30px ${victory ? 'rgba(0,255,136,0.3)' : 'rgba(255,68,68,0.3)'}`,
            maxWidth: '400px', width: '90%'
        });

        box.innerHTML = `
            <h1 style="margin-top:0; color:${victory ? '#00ff88' : '#ff4444'}">${title}</h1>
            <p style="font-size:1.2rem; line-height:1.6; white-space: pre-line;">${message}</p>
            <button id="modal-btn" style="
                margin-top:20px; padding:15px 30px; font-size:1.2rem; font-weight:bold; cursor:pointer;
                background:${victory ? '#00ff88' : '#ff4444'}; color:#000; border:none; borderRadius:8px;
                transition: transform 0.2s;
            ">${btnText}</button>
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        // Adiciona evento ao botão
        document.getElementById('modal-btn').onclick = btnAction;
    },

    // --- CONTROLES E LOOP ---
    setupControls() {
        const { arena, shield } = state.dom;
        if (!shield) return;
        shield.style.transition = 'transform 0.05s linear';

        const newArena = arena.cloneNode(true);
        arena.parentNode.replaceChild(newArena, arena);
        state.dom.arena = newArena;
        state.dom.shield = newArena.querySelector('#player-shield');

        on(newArena, 'mousemove', (e) => {
            if (!state.active) return;
            const s = state.dom.shield;
            const r = newArena.getBoundingClientRect();
            let x = e.clientX - r.left - (s.offsetWidth / 2);
            x = Math.max(0, Math.min(x, r.width - s.offsetWidth));
            s.style.transform = `translateX(${x}px)`;

            if (state.charge >= CONFIG.chargeRequired) s.classList.add('shield-ready');
            else s.classList.remove('shield-ready');
        });
    },

    gameLoop() {
        const spawner = setInterval(() => {
            if (state.active) this.spawnItem();
        }, CONFIG.spawnRate);
        state.timers.push(spawner);
    },

    spawnItem() {
        const { arena } = state.dom;
        const isWeak = Math.random() > 0.4;

        const item = document.createElement('div');
        const type = isWeak ? 'weak' : 'strong';
        const list = isWeak ? DATA.weak : DATA.strong;
        item.innerText = list[Math.floor(Math.random() * list.length)];
        item.className = isWeak ? 'falling-rock' : 'falling-chip';
        item.dataset.type = type;

        const maxPos = arena.offsetWidth - 160;
        item.style.left = `${Math.random() * maxPos}px`;
        item.style.top = '-60px';

        arena.appendChild(item);

        let posY = -60;
        const speed = isWeak ? CONFIG.gravity : (CONFIG.gravity + 0.5);

        const fallTimer = setInterval(() => {
            if (!state.active || !document.body.contains(item)) {
                clearInterval(fallTimer);
                if (item.parentNode) item.remove();
                return;
            }

            posY += speed;
            item.style.top = `${posY}px`;

            // COLISÃO
            if (this.checkCollision(item, state.dom.shield)) {
                if (type === 'weak') this.handleGoodBlock(item);
                else this.handleBadBlock(item);
                clearInterval(fallTimer);
                item.remove();
            }
            // PASSOU DIRETO
            else if (posY > arena.offsetHeight) {
                if (type === 'weak') this.handleBadPass(item);
                else this.handleGoodPass(item);
                clearInterval(fallTimer);
                item.remove();
            }
        }, 16);
    },

    checkCollision(item, shield) {
        if (!item || !shield) return false;
        const r1 = item.getBoundingClientRect();
        const r2 = shield.getBoundingClientRect();
        return !(r1.right < r2.left + 5 || r1.left > r2.right - 5 ||
            r1.bottom < r2.top + 5 || r1.top > r2.bottom - 5);
    },

    // --- EVENTOS DE JOGO ---
    handleGoodBlock(item) {
        this.addSafeScore(10);
        state.hits++;
        this.createExplosion(parseFloat(item.style.left), parseFloat(item.style.top), '#aaaaaa');
        this.showFloatingText(parseFloat(item.style.left), parseFloat(item.style.top), "Bloqueado!", "#fff");
    },
    handleBadBlock(item) {
        this.addSafeScore(-CONFIG.penaltyStrong);
        this.createExplosion(parseFloat(item.style.left), parseFloat(item.style.top), '#ff4444');
        this.showFloatingText(parseFloat(item.style.left), parseFloat(item.style.top), `-${CONFIG.penaltyStrong}`, "#ff4444");
        this.safeMascotSay("Não bloqueie chips verdes!");
    },
    handleBadPass(item) {
        this.takeDamage(20);
        this.addSafeScore(-CONFIG.penaltyWeak);
        this.showFloatingText(parseFloat(item.style.left), state.dom.arena.offsetHeight - 50, "Invasão!", "#ff0000");
        this.safeMascotScared();
    },
    handleGoodPass(item) {
        state.charge++;
        state.hits++;
        this.addSafeScore(30);
        this.createExplosion(parseFloat(item.style.left), state.dom.arena.offsetHeight - 20, '#00ff88');
        this.showFloatingText(parseFloat(item.style.left), state.dom.arena.offsetHeight - 60, "Segura!", "#00ff88");

        if (state.charge >= CONFIG.chargeRequired) this.activateSuperLaser();
        else this.safeMascotCelebrate();
    },

    activateSuperLaser() {
        this.safeMascotSay("SUPER LASER!");
        const { arena, shield } = state.dom;
        const laser = document.createElement('div');
        laser.className = 'super-laser';

        const sRect = shield.getBoundingClientRect();
        const aRect = arena.getBoundingClientRect();
        laser.style.left = `${sRect.left - aRect.left + (sRect.width / 2) - 10}px`;
        arena.appendChild(laser);

        const rocks = document.querySelectorAll('.falling-rock');
        rocks.forEach(rock => {
            this.createExplosion(rock.offsetLeft, rock.offsetTop, '#fff');
            rock.remove();
            this.addSafeScore(10);
        });

        setTimeout(() => { laser.remove(); state.charge = 0; }, 1500);
    },

    takeDamage(amount) {
        state.lives -= amount;
        if (state.dom.arena) {
            state.dom.arena.classList.add('shake-anim');
            setTimeout(() => state.dom.arena.classList.remove('shake-anim'), 300);
        }
        this.updateUI();

        if (state.lives <= 0) {
            state.active = false;
            this.clearTimers();
            this.showCustomModal(false, GameState.getScore()); // Chama o novo modal
        }
    },

    // --- VISUAL ---
    createExplosion(x, y, color) {
        for (let i = 0; i < 6; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.backgroundColor = color;
            p.style.left = `${x}px`;
            p.style.top = `${y}px`;
            document.body.appendChild(p);
            const dX = (Math.random() - 0.5) * 100;
            const dY = (Math.random() - 0.5) * 100;
            p.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${dX}px, ${dY}px) scale(0)`, opacity: 0 }], { duration: 500 }).onfinish = () => p.remove();
        }
    },

    showFloatingText(x, y, text, color) {
        const el = document.createElement('div');
        el.innerText = text;
        Object.assign(el.style, { position: 'fixed', left: `${x}px`, top: `${y}px`, color: color, fontWeight: 'bold', fontSize: '1.4rem', textShadow: '0 0 4px black', pointerEvents: 'none', zIndex: '1000' });
        document.body.appendChild(el);
        el.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: `translateY(-50px)`, opacity: 0 }], { duration: 1000 }).onfinish = () => el.remove();
    },

    updateUI() {
        if (state.dom.score) state.dom.score.innerText = GameState.getScore();
        if (state.dom.timerDisplay) state.dom.timerDisplay.innerText = state.time;
        if (state.dom.livesBar) {
            const w = Math.max(0, state.lives);
            state.dom.livesBar.style.width = w + '%';
            state.dom.livesBar.style.background = w < 30 ? '#ff4444' : '#00ff88';
        }
    },

    clearTimers() {
        state.timers.forEach(clearInterval);
        state.timers = [];
        if (state.timerInterval) clearInterval(state.timerInterval);
    },

    safeMascotSay(text) { try { MascotUI.say(text); } catch (e) { } },
    safeMascotCelebrate() { try { MascotUI.celebrate(); } catch (e) { } },
    safeMascotScared() { try { MascotUI.scared(); } catch (e) { } }
};