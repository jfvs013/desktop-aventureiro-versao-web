/**
 * js/main.js
 * Ponto de entrada PRINCIPAL.
 * AJUSTADO: Sincronizado com o tema do Laboratório de Poções.
 */

import { $, on } from './core/helpers.js';
import { GameState } from './core/state.js';
import { PopupUI } from './ui/popup.js';
import { MascotUI } from './ui/mascote.js';

import { Phase1 } from './game/fase1.js';
import { Phase2 } from './game/fase2.js';
import { Phase3 } from './game/fase3.js';

// --- ESTILOS GLOBAIS ---
const globalStyles = document.createElement('style');
globalStyles.innerHTML = `
    body {
        cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="%2340a0ff" stroke="%23ffffff" stroke-width="2" d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>') 16 16, auto;
    }
    button, a, .desktop-icon, .flask {
        cursor: pointer !important;
    }
    #virtual-desktop {
        background-color: #0a2342;
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

const PHASES = { 1: Phase1, 2: Phase2, 3: Phase3 };

const initGame = () => {
    console.log("Sistema: Inicializando Desktop Aventureiro...");
    GameState.reset();
    setupGlobalInteractions();

    PopupUI.show(
        "Desktop Aventureiro",
        "Prepare sua luva mágica! Ajude o Cãozinho Azul a limpar e proteger o computador.",
        "Começar Aventura!",
        () => startGame(1)
    );
};

const startGame = (phaseNumber) => {
    // --- AJUSTE 1: Nome do ID alterado para #phase3-lab ---
    if (phaseNumber === 3) {
        const desktop = $('#virtual-desktop');
        const lab = $('#phase3-lab'); 
        if (desktop) desktop.classList.add('hidden');
        if (lab) lab.classList.remove('hidden');
    }

    const PhaseModule = PHASES[phaseNumber];
    if (PhaseModule) {
        PhaseModule.init();
    }
};

const setupGlobalInteractions = () => {
    const desktop = $('#virtual-desktop');
    const lab = $('#phase3-lab'); // --- AJUSTE 2: Referência correta ---
    const mascotBtn = $('#next-instruction-btn');

    if (mascotBtn) {
        on(mascotBtn, 'click', () => {
            const currentPhaseObj = PHASES[GameState.getPhase()];
            if (currentPhaseObj && currentPhaseObj.handleMascotNext) {
                currentPhaseObj.handleMascotNext();
            }
        });
    }

    const handleGeneralInteraction = (e) => {
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
    };

    if (desktop) on(desktop, 'click', handleGeneralInteraction);
    if (lab) on(lab, 'click', handleGeneralInteraction); // --- AJUSTE 3: Eventos no Laboratório ---

    document.addEventListener('game:change-phase', (e) => startGame(e.detail));
};

on(document, 'DOMContentLoaded', initGame);