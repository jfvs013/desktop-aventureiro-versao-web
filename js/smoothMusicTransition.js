/**
 * Gerenciador de Música com Fade
 * Sincroniza com volumeControl para aplicar o volume do usuário
 */

(function() {
    const musicMap = {
        'index.html': { src: 'musics/Aspertia City.mp3', volume: 0.50, playbackRate: 1.0 },
        'tutorial': { src: 'musics/Aspertia City.mp3', volume: 0.50, playbackRate: 1.0 },
        'fase1': { src: 'musics/Empire_City.mp3', volume: 0.35, playbackRate: 1.0 },
        'fase2': { src: 'musics/Empire_City.mp3', volume: 0.35, playbackRate: 1.0 },
        'fase3': { src: 'musics/Mii_Maker.mp3', volume: 0.50, playbackRate: 2.0 },
        'fase4': { src: 'musics/Empire_City.mp3', volume: 0.35, playbackRate: 1.0 },
        'fase5': { src: 'musics/Empire_City.mp3', volume: 0.35, playbackRate: 1.0 },
        'fase6': { src: 'musics/Empire_City.mp3', volume: 0.35, playbackRate: 1.0 }
    };

    let lastMusic = null;

    function getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('tutorial')) return 'tutorial';
        if (path.includes('fase1')) return 'fase1';
        if (path.includes('fase2')) return 'fase2';
        if (path.includes('fase3')) return 'fase3';
        if (path.includes('fase4') || path.includes('fase6')) return 'fase4';
        if (path.includes('fase5')) return 'fase5';
        return 'index.html';
    }

    function adjustMusicPath(musicSrc) {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/fase') || currentPath.includes('/tutorial')) {
            if (!musicSrc.startsWith('../')) {
                return '../' + musicSrc;
            }
        }
        return musicSrc;
    }

    // Obter volume do usuário do localStorage
    function getUserVolume() {
        const saved = localStorage.getItem('gameVolume');
        return saved !== null ? parseFloat(saved) : null;
    }

    async function initMusic() {
        let audio = document.getElementById('globalMusicPlayer') || 
                   document.getElementById('bgMusic') ||
                   document.getElementById('musica');

        if (!audio) {
            audio = document.createElement('audio');
            audio.id = 'globalMusicPlayer';
            audio.loop = true;
            audio.style.display = 'none';
            document.body.appendChild(audio);
        }

        const page = getCurrentPage();
        const config = musicMap[page] || musicMap['index.html'];
        const musicPath = adjustMusicPath(config.src);
        
        // Sempre buscar volume do usuário ANTES de tocar
        const userVolume = getUserVolume();
        const finalVolume = userVolume !== null ? userVolume : config.volume;

        // Se é música diferente, fazer fade transition
        if (lastMusic && lastMusic !== config.src && audio.src) {
            console.log('🎵 Trocando música: ' + lastMusic + ' → ' + config.src);
            await window.fadeAudio.fadeOut(audio, 1000);
            audio.src = musicPath;
            audio.currentTime = 0;
            audio.playbackRate = config.playbackRate;
            audio.volume = finalVolume;
            audio.setAttribute('data-user-volume', finalVolume);
            
            await window.fadeAudio.fadeIn(audio, finalVolume, 1500);
        } else {
            // Mesma música ou primeira vez - apenas carregar
            if (!audio.src.includes(config.src)) {
                audio.src = musicPath;
                audio.currentTime = 0;
            }
            
            // Definir volume ANTES de tocar
            audio.volume = finalVolume;
            audio.setAttribute('data-user-volume', finalVolume);
            audio.playbackRate = config.playbackRate;
            
            if (audio.paused) {
                try {
                    audio.play().catch(e => console.log('Autoplay prevenido'));
                } catch (e) {}
            }
        }

        lastMusic = config.src;
        window.musicManager = window.musicManager || {};
        window.musicManager.audio = audio;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Delay pequeno para garantir que volumeControl foi inicializado
            setTimeout(initMusic, 100);
        });
    } else {
        // Delay para sincronizar com volumeControl
        setTimeout(initMusic, 100);
    }

    window.addEventListener('pageshow', () => {
        // Delay ao trocar página para sincronizar volume
        setTimeout(initMusic, 100);
    });
})();
