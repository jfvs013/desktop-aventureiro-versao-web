/**
 * Bloqueia navegação para trás usando os botões do navegador
 * O usuário não pode voltar para páginas anteriores - bloqueio muito agressivo
 */

(function() {
    let clickCount = 0;

    // Função para criar múltiplas camadas de proteção
    function createProtectionLayers() {
        // Usar location.replace para substituir o histórico
        window.history.replaceState(null, null, window.location.href);
        
        // Adicionar 50 entradas fictícias de uma vez para criar barreira massiva
        for (let i = 0; i < 50; i++) {
            window.history.pushState(
                { protectionLayer: i },
                null,
                window.location.href
            );
        }
    }

    // Inicializar proteção ao carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createProtectionLayers);
    } else {
        createProtectionLayers();
    }

    // Listener muito agressivo para popstate
    window.addEventListener('popstate', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Se tentou voltar, recrear proteção e voltar para frente
        setTimeout(() => {
            window.history.forward();
            // Recriar camadas extras
            for (let i = 0; i < 20; i++) {
                window.history.pushState(
                    { protection: true },
                    null,
                    window.location.href
                );
            }
        }, 100);
    }, true);

    // Listeners para atalhos de teclado perigosos
    document.addEventListener('keydown', function(e) {
        // Alt + Left (voltar)
        if (e.altKey && e.key === 'ArrowLeft') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        // Ctrl/Cmd + [ (voltar em navegadores)
        if ((e.ctrlKey || e.metaKey) && (e.key === '[' || e.keyCode === 219)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        // Ctrl/Cmd + H (histórico)
        if ((e.ctrlKey || e.metaKey) && (e.key === 'h' || e.key === 'H')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);

    // Bloquear também em outros eventos
    document.addEventListener('keyup', function(e) {
        if (e.altKey && e.key === 'ArrowLeft') {
            e.preventDefault();
            return false;
        }
    }, true);

    // Proteção extra: a cada 2 segundos garantir que há muitas camadas
    setInterval(() => {
        window.history.pushState(
            { timestamp: Date.now() },
            null,
            window.location.href
        );
    }, 2000);

    // Proteção contra mudança de URL
    window.addEventListener('hashchange', function(e) {
        e.preventDefault();
        window.history.forward();
    }, true);
})();
