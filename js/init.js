/**
 * js/fase3-init.js
 * Inicializador exclusivo para a Fase 3 isolada.
 */
import { Phase3 } from './game/fase3.js';
import { GameState } from './core/state.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Iniciando Fase 3 em modo isolado...");
    
    // Inicializa o estado se ele não existir
    if (!GameState.getPhase()) {
        GameState.setPhase(3);
    }

    // Remove a classe hidden manualmente já que estamos na página direta
    const labSection = document.querySelector('#phase3-lab');
    if (labSection) {
        labSection.classList.remove('hidden');
        labSection.setAttribute('aria-hidden', 'false');
    }

    // Inicia a lógica da fase
    Phase3.init();
});