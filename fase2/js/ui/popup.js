/**
 * js/ui/popup.js
 * Gerencia a exibição de modais e overlays.
 * CORRIGIDO: Seleção de elementos feita dentro do método para evitar referências mortas.
 */
import { $, on } from '../core/helpers.js';

export const PopupUI = {
    /**
     * Exibe um modal centralizado.
     * @param {string} title - Título do modal
     * @param {string} message - Mensagem explicativa
     * @param {string} btnText - Texto do botão
     * @param {Function} callback - Ação ao clicar no botão
     */
    show(title, message, btnText, callback) {
        // SELEÇÃO EM TEMPO REAL (Obrigatório para evitar o erro de referência morta)
        const overlay = $('#game-overlay');
        const titleEl = $('#overlay-title');
        const msgEl = $('#overlay-message');
        const currentBtn = $('#overlay-action-btn'); // Seleciona o botão ATUAL do DOM

        if (!overlay || !currentBtn) return;

        // Atualiza textos
        titleEl.textContent = title;
        msgEl.textContent = message;
        currentBtn.textContent = btnText;

        // CLONAGEM PARA REMOVER LISTENERS ANTIGOS
        // Como o botão é substituído, precisamos clonar o que acabamos de selecionar
        const newBtn = currentBtn.cloneNode(true);
        currentBtn.parentNode.replaceChild(newBtn, currentBtn);

        // Adiciona o novo evento
        on(newBtn, 'click', () => {
            this.hide();
            if (callback) callback();
        });

        // Exibe o modal e ajusta acessibilidade
        overlay.classList.remove('hidden');
        overlay.setAttribute('aria-hidden', 'false');
        
        // Foca no botão novo para acessibilidade
        newBtn.focus();
    },

    hide() {
        const overlay = $('#game-overlay');
        if (!overlay) return;
        
        overlay.classList.add('hidden');
        overlay.setAttribute('aria-hidden', 'true');
        
        // Devolve o foco para o corpo do jogo (opcional, mas boa prática)
        $('#game-app')?.focus();
    }
};