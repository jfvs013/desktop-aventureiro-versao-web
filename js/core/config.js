/**
 * config.js
 * Armazena constantes, textos do mascote e configurações do jogo.
 * Separação de dados e lógica.
 */

export const GAME_CONFIG = {
    // Textos falados pelo mascote
    mascotMessages: {
        welcome: "Olá! Eu sou o **Cãozinho Azul**. Vamos aprender a deixar seu computador seguro?",
        phase1Start: "Fase 1: Vamos organizar sua Área de Trabalho. Clique nos ícones para interagir!",
        genericError: "Ops! Isso não parece seguro. Tente novamente.",
        genericSuccess: "Muito bem! Você tomou a decisão certa."
    },
    
    // Configurações de pontuação e dificuldade
    settings: {
        maxErrors: 3,
        pointsPerAction: 10,
        penaltyPerError: 5
    },
    
    // Elementos DOM IDs (Mapeamento para facilitar manutenção)
    selectors: {
        mascotText: '#mascot-text',
        mascotContainer: '#mascot-hud',
        desktopArea: '#virtual-desktop',
        modal: '#game-overlay'
    }
};