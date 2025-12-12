// Salvar nome e navegar para fase1
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const playerName = document.getElementById('playerName');

    // permitir Enter
    playerName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') startGame();
    });

    startBtn.addEventListener('click', startGame);

    // recuperar nome se existir
    const stored = localStorage.getItem('da_player');
    if (stored) playerName.value = stored;

    function startGame() {
        const name = playerName.value.trim() || 'Gerente';
        localStorage.setItem('da_player', name);
        // navegar para fase1
        window.location.href = 'fase1.html';
    }
});
