/**
 * desktop.js
 * Manipula a renderização de ícones e janelas no Desktop Virtual.
 */
import { $, $$ } from '../core/helpers.js';

const desktopArea = $('#desktop-icons-area');

export const DesktopUI = {
    /**
     * Limpa e renderiza os ícones da fase atual.
     * @param {Array} iconsData - Lista de objetos de ícones
     */
    renderIcons(iconsData) {
        if (!desktopArea) return;
        desktopArea.innerHTML = ''; // Limpa desktop

        iconsData.forEach(icon => {
            const iconBtn = document.createElement('button');
            iconBtn.className = 'desktop-icon';
            iconBtn.setAttribute('aria-label', icon.label);
            iconBtn.dataset.id = icon.id;
            
            // Estrutura HTML interna do ícone (criada via JS)
            // Em um projeto real, usaríamos imagens reais. Aqui usaremos emojis ou placeholders.
            iconBtn.innerHTML = `
                <div style="font-size: 2rem;">${icon.iconEmoji || '📁'}</div>
                <span style="display:block; margin-top:5px; color: white; font-size: 0.8rem;">${icon.name}</span>
            `;

            desktopArea.appendChild(iconBtn);
        });
    },

    clearWindows() {
        const windowsArea = $('#windows-area');
        if (windowsArea) windowsArea.innerHTML = '';
    }
};