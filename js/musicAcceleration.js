// Sistema de aceleração gradual de música
// Dobra a velocidade da música quando o timer começa a contar

const MusicAccelerator = {
    audio: null,
    isAccelerating: false,
    targetPlaybackRate: 1.0,
    currentPlaybackRate: 1.0,
    accelerationStartTime: null,
    accelerationDuration: 8000, // 8 segundos para acelerar
    
    init() {
        this.audio = document.getElementById('bgMusic');
        if (!this.audio) {
            console.warn('MusicAccelerator: bgMusic não encontrado');
            return;
        }
    },
    
    startAcceleration(targetRate = 2.0) {
        if (!this.audio || this.isAccelerating) return;
        
        this.isAccelerating = true;
        this.targetPlaybackRate = targetRate;
        this.currentPlaybackRate = this.audio.playbackRate || 1.0;
        this.accelerationStartTime = Date.now();
        
        // Usar requestAnimationFrame para aceleração suave
        this.accelerate();
    },
    
    accelerate() {
        if (!this.isAccelerating) return;
        
        const elapsed = Date.now() - this.accelerationStartTime;
        const progress = Math.min(elapsed / this.accelerationDuration, 1);
        
        // Easing função - acelera suavemente
        const easeProgress = progress < 0.5 
            ? 2 * progress * progress 
            : -1 + (4 - 2 * progress) * progress;
        
        this.audio.playbackRate = this.currentPlaybackRate + 
            (this.targetPlaybackRate - this.currentPlaybackRate) * easeProgress;
        
        if (progress < 1) {
            requestAnimationFrame(() => this.accelerate());
        } else {
            this.audio.playbackRate = this.targetPlaybackRate;
            this.isAccelerating = false;
        }
    },
    
    reset() {
        this.isAccelerating = false;
        if (this.audio) {
            this.audio.playbackRate = 1.0;
        }
    }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    MusicAccelerator.init();
});
