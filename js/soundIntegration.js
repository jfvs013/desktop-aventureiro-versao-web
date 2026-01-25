/**
 * Integração de Efeitos Sonoros
 * Adiciona sons aos cliques e eventos do jogo
 */

(function() {
    // Aguardar soundEffects carregar
    function initSoundEffects() {
        if (typeof soundEffects === 'undefined') {
            console.log('Aguardando soundEffects...');
            setTimeout(initSoundEffects, 100);
            return;
        }

        console.log('🔊 Inicializando integração de efeitos sonoros');

        // Adicionar click sound a todos os botões
        document.addEventListener('click', function(e) {
            const button = e.target.closest('button');
            if (button) {
                soundEffects.click();
            }
        });

        // Expor funções globalmente para fácil uso
        window.gameSound = {
            click: () => soundEffects.click(),
            fail: () => soundEffects.fail(),
            success: () => soundEffects.success(),
            levelUp: () => soundEffects.levelUp(),
            warning: () => soundEffects.warning(),

            // Funções customizadas comuns
            wrongAnswer: function() {
                soundEffects.fail();
            },
            correctAnswer: function() {
                soundEffects.success();
            },
            nextPhase: function() {
                soundEffects.levelUp();
            },
            playerLost: function() {
                soundEffects.fail();
                setTimeout(() => soundEffects.fail(), 200);
            },
            playerWon: function() {
                soundEffects.success();
                setTimeout(() => soundEffects.levelUp(), 500);
            }
        };

        console.log('✅ Efeitos sonoros prontos!');
        console.log('Use: gameSound.click(), gameSound.fail(), gameSound.success(), gameSound.levelUp(), gameSound.warning()');
        console.log('Ou: gameSound.wrongAnswer(), gameSound.correctAnswer(), gameSound.nextPhase(), gameSound.playerLost(), gameSound.playerWon()');
    }

    // Iniciar quando estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSoundEffects);
    } else {
        initSoundEffects();
    }
})();
