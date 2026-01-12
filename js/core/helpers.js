/**
 * helpers.js - Versão Final Otimizada
 * Funções utilitárias para seleção de elementos e manipulação segura.
 */

// 1. Seleciona um único elemento no DOM
// Retorna null se não encontrar, evitando erros silenciosos.
export const $ = (selector) => document.querySelector(selector);

// 2. Seleciona múltiplos elementos e CONVERTE para Array
// Isso é CRUCIAL para que você possa usar .map(), .filter() e .reduce()
// sem o erro de "undefined" ou "is not a function".
export const $$ = (selector) => {
    const elements = document.querySelectorAll(selector);
    return Array.from(elements); // Converte NodeList em Array real
};

// 3. Adiciona um evento de forma segura
// Verifica se o elemento existe antes de tentar pendurar o evento.
export const on = (element, event, callback) => {
    if (element) {
        element.addEventListener(event, callback);
    } else {
        // Apenas um aviso no console para debug, sem travar o código.
        console.warn(`Aviso: Elemento para o evento '${event}' não foi encontrado.`);
    }
};

// 4. Função de atraso (sleep) baseada em Promises
// Útil para sequenciar falas do mascote ou animações.
export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));