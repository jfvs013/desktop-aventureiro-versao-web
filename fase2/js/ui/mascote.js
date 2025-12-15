/**
 * js/ui/mascote.js
 * Controla as interações do personagem guia.
 * ATUALIZADO: Adicionadas animações de Reação (Pulo, Medo, Fala).
 */
import { $, on } from '../core/helpers.js';
import { GAME_CONFIG } from '../core/config.js';

const textElement = $(GAME_CONFIG.selectors.mascotText);
const container = $(GAME_CONFIG.selectors.mascotContainer);
const mascotImg = $('#mascot-img');

// INJEÇÃO DE ESTILOS DE ANIMAÇÃO DO MASCOTE
const mascotStyles = document.createElement('style');
mascotStyles.innerHTML = `
    /* Animação de falar (leve balanço) */
    @keyframes mascot-talk {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }
    /* Animação de celebração (Pulo elástico) */
    @keyframes mascot-jump {
        0% { transform: scale(1, 1) translateY(0); }
        30% { transform: scale(1.1, 0.9) translateY(5px); } /*Achata antes de pular*/
        60% { transform: scale(0.9, 1.1) translateY(-20px); } /*Estica no ar*/
        100% { transform: scale(1, 1) translateY(0); }
    }
    /* Animação de medo/erro (Tremor rápido) */
    @keyframes mascot-scared {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px) rotate(-5deg); }
        75% { transform: translateX(8px) rotate(5deg); }
    }

    .mascot-speaking #mascot-img { animation: mascot-talk 0.3s ease infinite; }
    .mascot-celebrating #mascot-img { animation: mascot-jump 0.6s ease; }
    .mascot-scared #mascot-img { animation: mascot-scared 0.4s ease infinite; }
`;
document.head.appendChild(mascotStyles);


export const MascotUI = {
    say(message) {
        if (!textElement || !mascotImg) return;
        textElement.innerHTML = message;
        
        // Remove classes anteriores
        mascotImg.parentElement.classList.remove('mascot-celebrating', 'mascot-scared');

        // Adiciona classe de fala temporária
        mascotImg.parentElement.classList.add('mascot-speaking');
        
        // Para de "falar" após um tempo estimado (baseado no tamanho do texto)
        const duration = Math.min(2000, message.length * 50);
        setTimeout(() => {
            mascotImg.parentElement.classList.remove('mascot-speaking');
        }, duration);
    },

    // Toca animação de pulo de alegria
    celebrate() {
        const parent = mascotImg.parentElement;
        parent.classList.remove('mascot-speaking', 'mascot-scared');
        
        // Hack para reiniciar a animação se já estiver tocando
        void parent.offsetWidth; 
        
        parent.classList.add('mascot-celebrating');
        // Remove após terminar
        setTimeout(() => parent.classList.remove('mascot-celebrating'), 600);
    },

    // Toca animação de tremor de susto
    scared() {
        const parent = mascotImg.parentElement;
        parent.classList.remove('mascot-speaking', 'mascot-celebrating');
        parent.classList.add('mascot-scared');
        
        // O susto dura um pouco mais
        setTimeout(() => parent.classList.remove('mascot-scared'), 1200);
    }
};