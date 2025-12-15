/**
 * js/main.js
 * Ponto de entrada PRINCIPAL.
 * ATUALIZADO: Injeção de estilos globais para polimento visual (Cursor e Fundo).
 */

import { $, on } from './core/helpers.js';
import { GameState } from './core/state.js';
import { PopupUI } from './ui/popup.js';
import { MascotUI } from './ui/mascote.js';

// Importação dinâmica das fases
import { Phase1 } from './game/fase1.js';
import { Phase2 } from './game/fase2.js';

// --- INJEÇÃO DE ESTILOS GLOBAIS (POLIMENTO FINAL) ---
const globalStyles = document.createElement('style');
globalStyles.innerHTML = `
    /* 1. CURSOR PERSONALIZADO (Luva Mágica) */
    body {
        cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="%2340a0ff" stroke="%23ffffff" stroke-width="2" d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>') 16 16, auto;
    }
    
    /* Cursor para links e botões (Mãozinha clicando) */
    button, a, .desktop-icon {
        cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="%23ffeb3b" stroke="%23000000" stroke-width="1" d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zM17.37 14.36l-.17-.11-1.2-1.6c-.46-.61-1.19-.97-1.95-1.18.06-.23.09-.46.09-.7 0-1.21-.83-2.22-1.94-2.45-.41 1.04-1.19 1.91-2.2 2.45V7.5a2.5 2.5 0 0 0-5 0v8.59l-2.54-.98c-.14-.05-.3-.08-.46-.08-.43 0-.83.19-1.09.52L.4 16.2l5.75 5.75c.94.94 2.19 1.45 3.49 1.45h6.61c1.88 0 3.47-1.25 3.91-2.93l.92-3.54c.09-.36.13-.74.13-1.12 0-.87-.33-1.69-.92-2.32z"/></svg>') 6 2, pointer !important;
    }

    /* 2. FUNDO DINÂMICO (Padrão Digital que se move) */
    @keyframes moveBackground {
        from { background-position: 0 0; }
        to { background-position: 50px 50px; }
    }
    #virtual-desktop {
        background-color: #0a2342; /* Cor base escura */
        background-image: 
            radial-gradient(circle at 20% 20%, rgba(64, 160, 255, 0.05) 0%, transparent 20%),
            radial-gradient(circle at 80% 80%, rgba(64, 160, 255, 0.05) 0%, transparent 20%),
            linear-gradient(0deg, rgba(64, 160, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(64, 160, 255, 0.02) 1px, transparent 1px);
        background-size: 100% 100%, 100% 100%, 30px 30px, 30px 30px;
        animation: moveBackground 10s linear infinite;
    }
`;
document.head.appendChild(globalStyles);


const PHASES = { 1: Phase1, 2: Phase2 };

const initGame = () => {
    console.log("Sistema: Inicializando Desktop Aventureiro (Versão Final Polida)...");
    GameState.reset();
    setupGlobalInteractions();

    // Modal Inicial
    PopupUI.show(
        "Desktop Aventureiro",
        "Prepare sua luva mágica! Ajude o Cãozinho Azul a limpar e proteger o computador.",
        "Começar Aventura!",
        () => startGame(1)
    );
};

const startGame = (phaseNumber) => {
    const PhaseModule = PHASES[phaseNumber];
    if (PhaseModule) {
        PhaseModule.init();
    }
};

const setupGlobalInteractions = () => {
    const desktop = $('#virtual-desktop');
    const mascotBtn = $('#next-instruction-btn');

    if (mascotBtn) {
        on(mascotBtn, 'click', () => {
            const currentPhaseObj = PHASES[GameState.getPhase()];
            if (currentPhaseObj && currentPhaseObj.handleMascotNext) {
                currentPhaseObj.handleMascotNext();
            }
        });
    }

    if (desktop) {
        on(desktop, 'click', (e) => {
            const targetIcon = e.target.closest('.desktop-icon');
            const targetAction = e.target.closest('[data-action]');
            const currentPhaseObj = PHASES[GameState.getPhase()];

            if (!currentPhaseObj) return;

            if (targetIcon) {
                currentPhaseObj.handleInteraction('click-icon', targetIcon.dataset.id);
            }
            if (targetAction) {
                currentPhaseObj.handleInteraction(targetAction.dataset.action, targetAction.dataset.id);
            }
        });
    }

    document.addEventListener('game:change-phase', (e) => startGame(e.detail));
};

on(document, 'DOMContentLoaded', initGame);