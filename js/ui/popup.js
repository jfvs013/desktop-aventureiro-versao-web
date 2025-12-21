import { $, on } from '../core/helpers.js';

export const PopupUI = {
    show(title, message, btnText, callback) {
        const overlay = $('#game-overlay');
        const titleEl = $('#overlay-title');
        const msgEl = $('#overlay-message');
        const currentBtn = $('#overlay-action-btn');

        if (!overlay || !currentBtn) return;

        titleEl.textContent = title;
        msgEl.textContent = message;
        currentBtn.textContent = btnText;

        // Limpa eventos antigos clonando o botão
        const newBtn = currentBtn.cloneNode(true);
        currentBtn.parentNode.replaceChild(newBtn, currentBtn);

        on(newBtn, 'click', () => {
            this.hide();
            if (callback) callback();
        });

        overlay.classList.remove('hidden');
        overlay.setAttribute('aria-hidden', 'false');
        newBtn.focus();
    },

    hide() {
        const overlay = $('#game-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            overlay.setAttribute('aria-hidden', 'true');
        }
    }
};