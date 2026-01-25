/**
 * Controle de Volume Global
 * Permite o jogador ajustar volume sem perder a configuração ao trocar página
 * Executa ANTES do smoothMusicTransition para sincronizar corretamente
 */

window.volumeControl = (function() {
    const STORAGE_KEY = 'gameVolume';
    let currentVolume = 0.5; // Padrão 50%

    // Carregar volume salvo
    function loadVolume() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
            currentVolume = parseFloat(saved);
        }
        return currentVolume;
    }

    // Salvar volume
    function saveVolume(volume) {
        currentVolume = Math.max(0, Math.min(1, volume));
        localStorage.setItem(STORAGE_KEY, currentVolume);
        
        // Aplicar também aos efeitos sonoros se existirem
        if (window.soundEffects && typeof window.soundEffects.setVolume === 'function') {
            window.soundEffects.setVolume(currentVolume);
        }
        
        return currentVolume;
    }

    // Aplicar volume a TODAS as tags de áudio na página
    function applyVolumeToAllAudio(volume) {
        const allAudio = document.querySelectorAll('audio');
        allAudio.forEach(audio => {
            audio.volume = volume;
            audio.setAttribute('data-user-volume', volume);
            // Desmutir depois de aplicar o volume
            if (audio.muted) {
                audio.muted = false;
                // Se tem autoplay, deixar tocar
                if (audio.autoplay && audio.paused) {
                    audio.play().catch(e => {
                        console.log('Autoplay prevenido pelo navegador');
                    });
                }
            }
        });
    }

    // Aplicar volume à música - sincroniza com o valor do slider
    function applyVolumeToMusic(volume) {
        const audio = document.getElementById('globalMusicPlayer') || 
                     document.getElementById('bgMusic') ||
                     document.getElementById('musica');
        if (audio) {
            // Armazenar o volume do usuário para não ser sobrescrito
            audio.setAttribute('data-user-volume', volume);
            audio.volume = volume;
            if (audio.muted) {
                audio.muted = false;
            }
        }
    }

    // Criar interface de controle
    function createVolumeControl() {
        // Verificar se já existe
        if (document.getElementById('gameVolumeControl')) {
            return;
        }

        const container = document.createElement('div');
        container.id = 'gameVolumeControl';
        container.innerHTML = `
            <div class="volume-panel">
                <div class="volume-label">🔊</div>
                <input 
                    type="range" 
                    id="volumeSlider" 
                    class="volume-slider" 
                    min="0" 
                    max="100" 
                    value="${Math.round(currentVolume * 100)}"
                    aria-label="Controle de Volume"
                >
                <div class="volume-value" id="volumeValue">${Math.round(currentVolume * 100)}%</div>
            </div>
        `;
        
        // Verificar se existe .game-topbar (como em fase4)
        const topbar = document.querySelector('.game-topbar');
        if (topbar) {
            container.id = 'gameVolumeControl-in-topbar';
            topbar.appendChild(container);
        } else {
            document.body.appendChild(container);
        }

        // Event listener do slider
        const slider = document.getElementById('volumeSlider');
        const valueDisplay = document.getElementById('volumeValue');

        slider.addEventListener('input', (e) => {
            const newVolume = e.target.value / 100;
            saveVolume(newVolume);
            applyVolumeToMusic(newVolume);
            valueDisplay.textContent = `${Math.round(newVolume * 100)}%`;
            
            // Feedback visual
            slider.classList.add('active');
            setTimeout(() => slider.classList.remove('active'), 300);
        });

        // Aplicar volume inicial à música
        applyVolumeToMusic(currentVolume);
    }

    // Inicializar quando documento carregar
    function init() {
        loadVolume();
        createVolumeControl();
        
        // Aplicar volume a TODOS os áudios imediatamente
        applyVolumeToAllAudio(currentVolume);
        
        // Garantir que o volume seja aplicado logo após o DOM estar pronto
        setTimeout(() => {
            applyVolumeToAllAudio(currentVolume);
        }, 50);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Reinicializar ao mudar página - aplicar volume ANTES de smoothMusicTransition iniciar
    window.addEventListener('pageshow', () => {
        loadVolume();
        
        // Aplicar volume a TODOS os áudios imediatamente
        applyVolumeToAllAudio(currentVolume);
        
        // Atualizar slider se existir
        const slider = document.getElementById('volumeSlider');
        if (slider) {
            slider.value = Math.round(currentVolume * 100);
            document.getElementById('volumeValue').textContent = `${Math.round(currentVolume * 100)}%`;
        }
        
        // Garantir que os efeitos sonoros também usem o volume correto
        if (window.soundEffects && typeof window.soundEffects.setVolume === 'function') {
            window.soundEffects.setVolume(currentVolume);
        }
    }, false);

    return {
        getVolume: () => currentVolume,
        setVolume: saveVolume,
        applyVolume: applyVolumeToMusic
    };
})();

console.log('🔊 Controle de Volume carregado');
