/**
 * state.js
 * Gerencia o estado global do jogo (Fase atual, Pontos, Erros).
 * Padrão Singleton simples.
 */

const initialState = {
    currentPhase: 0, // 0 = Intro, 1 = Fase 1, 2 = Fase 2
    score: 0,
    errors: 0,
    isGameActive: false,
    completedActions: [] // IDs de ações já realizadas
};

// Objeto reativo (simplificado)
const state = { ...initialState };

export const GameState = {
    // Inicia/Reinicia o estado
    reset() {
        Object.assign(state, initialState);
        state.isGameActive = true;
        console.log("Estado do jogo reiniciado.");
    },

    // Getters (para ler dados)
    getPhase() { return state.currentPhase; },
    getScore() { return state.score; },
    getErrors() { return state.errors; },
    
    // Setters (para alterar dados com segurança)
    setPhase(phaseNumber) {
        state.currentPhase = phaseNumber;
    },

    addScore(points) {
        state.score += points;
        console.log(`Pontuação: ${state.score}`);
    },

    addError() {
        state.errors += 1;
        console.warn(`Erro registrado. Total: ${state.errors}`);
        return state.errors;
    }
};