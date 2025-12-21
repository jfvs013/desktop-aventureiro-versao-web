/**
 * js/main.js (Para o Index)
 * Sistema de navegação inicial - Captura nome e redireciona para tutorial
 */

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const playerName = document.getElementById('playerName');

    // Recuperar nome se existir
    const stored = localStorage.getItem('da_player');
    if (stored) {
        playerName.value = stored;
    }

    // Verificar se já completou o tutorial
    const tutorialCompleted = localStorage.getItem('da_tutorial_completed');

    // Permitir Enter para iniciar
    playerName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            startGame();
        }
    });

    startBtn.addEventListener('click', startGame);

    function startGame() {
        const name = playerName.value.trim();

        if (!name) {
            // Animação de shake se não digitou nome
            playerName.classList.add('shake');
            playerName.placeholder = 'Por favor, digite seu nome!';
            playerName.style.borderColor = '#ff6b35';

            setTimeout(() => {
                playerName.classList.remove('shake');
                playerName.style.borderColor = '';
            }, 500);
            return;
        }

        // Salvar nome do jogador
        localStorage.setItem('da_player', name);

        // Inicializar progresso do jogo se não existir
        if (!localStorage.getItem('da_game_progress')) {
            localStorage.setItem('da_game_progress', JSON.stringify({
                currentPhase: 0,
                phase1Completed: false,
                phase2Completed: false,
                tutorialCompleted: false,
                totalScore: 0
            }));
        }

        // Redirecionar para tutorial ou fase correspondente
        if (tutorialCompleted === 'true') {
            // Se já fez o tutorial, vai direto para a última fase acessada
            const progress = JSON.parse(localStorage.getItem('da_game_progress'));
            if (progress.phase1Completed && !progress.phase2Completed) {
                window.location.href = 'fase2.html';
            } else if (!progress.phase1Completed) {
                window.location.href = 'fase1/fase1.html';
            } else {
                window.location.href = 'tutorial.html';
            }
        } else {
            // Primeira vez: vai para o tutorial
            window.location.href = 'tutorial/tutorial.html';
        }
    }

    // Adicionar animação de shake
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        .shake {
            animation: shake 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});