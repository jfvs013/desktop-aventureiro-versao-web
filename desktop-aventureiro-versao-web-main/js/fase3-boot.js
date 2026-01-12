/**
 * js/fase3-boot.js
 * Motor de inicialização EXCLUSIVO da Fase 3.
 * Ignora o main.js para evitar erros de outras pessoas.
 */
import { Phase3 } from './game/fase3.js';
import { GameState } from './core/state.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Boot da Fase 3: Iniciando em modo isolado...");

    // 1. Força o estado da fase 3 (já que o main.js não rodou)
    GameState.setPhase(3);

    // 2. Destrava a tela manualmente
    const arcadeSection = document.querySelector('#phase3-arcade');
    if (arcadeSection) {
        arcadeSection.classList.remove('hidden');
        arcadeSection.setAttribute('aria-hidden', 'false');
    }

    // 3. Inicia o seu jogo
    Phase3.init();
});