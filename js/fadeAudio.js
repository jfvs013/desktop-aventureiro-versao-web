/**
 * Fade Audio - Faz transições de volume suaves
 */

window.fadeAudio = {
    fadeOut: function(audio, duration = 1000) {
        return new Promise((resolve) => {
            if (!audio) {
                resolve();
                return;
            }
            
            const startVolume = audio.volume;
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                audio.volume = startVolume * (1 - progress);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    audio.volume = 0;
                    audio.pause();
                    resolve();
                }
            };
            
            animate();
        });
    },

    fadeIn: function(audio, targetVolume, duration = 1500) {
        return new Promise((resolve) => {
            if (!audio) {
                resolve();
                return;
            }
            
            audio.volume = 0;
            try {
                audio.play().catch(e => {});
            } catch (e) {}
            
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                audio.volume = targetVolume * progress;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    audio.volume = targetVolume;
                    resolve();
                }
            };
            
            animate();
        });
    }
};
