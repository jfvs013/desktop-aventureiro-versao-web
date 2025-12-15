/**
 * helpers.js
 * Funções utilitárias para seleção de elementos e manipulação básica.
 */

// Seleciona um único elemento no DOM
export const $ = (selector) => document.querySelector(selector);

// Seleciona múltiplos elementos no DOM (retorna NodeList)
export const $$ = (selector) => document.querySelectorAll(selector);

// Adiciona um evento a um elemento de forma segura
export const on = (element, event, callback) => {
    if (element) {
        element.addEventListener(event, callback);
    } else {
        console.warn(`Elemento não encontrado para evento: ${event}`);
    }
};

// Função de atraso (sleep) para animações ou fluxo
export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));