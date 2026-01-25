/**
 * Gerenciador de Efeitos Sonoros com Arquivos de Áudio
 * Toca efeitos sonoros de arquivos na pasta musics/
 */

window.soundEffects = (function() {
    let soundVolume = 0.5; // Volume padrão para efeitos sonoros

    // Detectar nível atual para caminho correto
    function getSoundsPath() {
        const path = window.location.pathname;
        if (path.includes('/fase') || path.includes('/tutorial')) {
            return '../musics/';
        }
        return './musics/';
    }

    // Definir volume dos efeitos sonoros
    function setVolume(volume) {
        soundVolume = Math.max(0, Math.min(1, volume));
    }

    // Criar elemento de áudio e tocar
    function playSound(filename) {
        try {
            const audio = new Audio(getSoundsPath() + filename);
            audio.volume = soundVolume * 0.5; // Volume moderado para não sobrepor música
            audio.play().catch(e => {
                console.log('Arquivo não encontrado, usando síntese:', filename);
                playFallbackSound(filename);
            });
        } catch (e) {
            console.log('Erro ao criar áudio:', e);
            playFallbackSound(filename);
        }
    }

    // Fallback: síntese de áudio se arquivo não existir
    function playFallbackSound(soundType) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;

            switch(soundType) {
                case 'click.mp3':
                    playClickFallback(ctx, now);
                    break;
                case 'fail.mp3':
                    playFailFallback(ctx, now);
                    break;
                case 'success.mp3':
                    playSuccessFallback(ctx, now);
                    break;
                case 'levelup.mp3':
                    playLevelUpFallback(ctx, now);
                    break;
                case 'warning.mp3':
                    playWarningFallback(ctx, now);
                    break;
            }
        } catch (e) {
            console.log('Erro ao sintetizar som:', e);
        }
    }

    // Fallbacks de síntese
    function playClickFallback(ctx, now) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0.3 * soundVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    }

    function playFailFallback(ctx, now) {
        for (let i = 0; i < 2; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            const startTime = now + (i * 0.15);
            osc.frequency.setValueAtTime(400 - (i * 100), startTime);
            gain.gain.setValueAtTime(0.2 * soundVolume, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
            osc.start(startTime);
            osc.stop(startTime + 0.1);
        }
    }

    function playSuccessFallback(ctx, now) {
        const frequencies = [523.25, 659.25, 783.99];
        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            const startTime = now + (i * 0.1);
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.2 * soundVolume, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
            osc.start(startTime);
            osc.stop(startTime + 0.3);
        });
    }

    function playLevelUpFallback(ctx, now) {
        const frequencies = [392, 494, 587, 784];
        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            const startTime = now + (i * 0.08);
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.25 * soundVolume, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
            osc.start(startTime);
            osc.stop(startTime + 0.4);
        });
    }

    function playWarningFallback(ctx, now) {
        for (let i = 0; i < 3; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            const startTime = now + (i * 0.1);
            osc.frequency.setValueAtTime(600, startTime);
            gain.gain.setValueAtTime(0.15 * soundVolume, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.08);
            osc.start(startTime);
            osc.stop(startTime + 0.08);
        }
    }

    return {
        click: () => playSound('click.mp3'),
        fail: () => playSound('fail.mp3'),
        success: () => playSound('success.mp3'),
        levelUp: () => playSound('levelup.mp3'),
        warning: () => playSound('warning.mp3'),
        setVolume: setVolume
    };
})();

console.log('🔊 Efeitos sonoros carregados (com fallback de síntese)');
console.log('Para usar arquivos de áudio, coloque: click.mp3, fail.mp3, success.mp3, levelup.mp3, warning.mp3 em /musics/');

