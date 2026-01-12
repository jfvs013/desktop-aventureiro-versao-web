document.addEventListener('DOMContentLoaded', () => {
    const mailList = document.getElementById('mailList');
    const inbox = document.getElementById('inbox');
    const trash = document.getElementById('trash');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const playerDisplay = document.getElementById('playerDisplay');
    const feedbackBox = document.getElementById('feedbackBox');
    const timerEl = document.getElementById('timer');
    const endModal = document.getElementById('endModal');
    const endText = document.getElementById('endText');
    const retryBtn = document.getElementById('retryBtn');
    const backBtn = document.getElementById('backBtn');
    const inspectBtn = document.getElementById('inspectBtn');
    const nextPhaseBtn = document.getElementById('nextPhaseBtn');

    let player = localStorage.getItem('da_player') || 'Gerente';
    playerDisplay.textContent = 'Jogador: ' + player;

    let score = 0;
    let timeLeft = 60;
    let lupaUsedCount = 0; // Contador de usos da lupa

    scoreDisplay.textContent = 'Pontos: ' + score;
    timerEl.textContent = 'Tempo: ' + timeLeft;

    const emails = [
        { id: 'e1', title: 'URGENTE! Sua conta vai ser BLOQUEADA!', sender: 'SuporteTecnico123@hotmal.com', phishing: true, hint: 'Domínio estranho (hotmal.com) e urgência excessiva' },
        { id: 'e2', title: 'Você GANHOU um Super Console de Jogos!', sender: 'LojaDosSonhos@gmail.co', phishing: true, hint: 'Domínio suspeito (.co) e oferta falsa cobrando taxa' },
        { id: 'e3', title: 'Oi, sou seu amigo! Preciso de ajuda RÁPIDA!', sender: 'amigo-verdadeiro@serverX.net', phishing: true, hint: 'Remetente genérico e pedido suspeito de dados' },
        { id: 'e4', title: 'Sua Fatura do Mês Venceu! Clique Aqui!', sender: 'Conta-Falsa-2025@empresas.br', phishing: true, hint: 'Nome suspeito (Conta-Falsa) e link duvidoso' },
        { id: 'e5', title: 'VOCÊ GANHOU GIROS GRÁTIS!!!', sender: 'tigrinhocorp@gmail.com', phishing: true, hint: 'Promessa de prêmio pedindo depósito - golpe comum' },
        { id: 'e6', title: 'NOTÍCIA INACREDITÁVEL! O que aconteceu?', sender: 'noticias-urgente@news-br.xyz', phishing: true, hint: 'Clickbait + domínio .xyz suspeito' },
        { id: 'e7', title: 'Seu AntiVírus VENCEU! Instale este NOVO!', sender: 'SegurancaOficial@seguro.com', phishing: true, hint: 'Falso antivírus com anexo executável malicioso' },
        { id: 'e8', title: 'Dica de Segurança da Semana!', sender: 'AntivírusMentor@Desktop.com', phishing: false, hint: 'Email oficial de segurança do sistema' },
        { id: 'e9', title: 'Nova Tarefa: Verificar as Notas Escolares', sender: 'ListaDeTarefas@Desktop.com', phishing: false, hint: 'Solicitação legítima e segura de rotina' },
        { id: 'e10', title: 'Seu Pedido Chegou! (Ícone Novo)', sender: 'LojaDoJogo@Shop.com', phishing: false, hint: 'Confirmação legítima de entrega de produto' },
        { id: 'e11', title: 'Você viu o novo vídeo do Super Gato?', sender: 'AmigoVirtual@Desktop.com', phishing: false, hint: 'Link seguro de contato conhecido' },
        { id: 'e12', title: 'Confirmação: Lixeira Esvaziada', sender: 'LixeiraEsvaziada@Sistema.com', phishing: false, hint: 'Notificação legítima do sistema' },
        { id: 'e13', title: 'Atualização de Segurança - Necessária!', sender: 'SistemaOperacional@Desktop.com', phishing: false, hint: 'Atualização legítima do sistema operacional' },
        { id: 'e14', title: 'Lembrete: Festa de Aniversário Amanhã!', sender: 'Calendario@App.com', phishing: false, hint: 'Lembrete legítimo do aplicativo de agenda' },
        { id: 'e15', title: 'Seu Desenho da Semana foi Aprovado!', sender: 'ClubeDeDesenho@App.com', phishing: false, hint: 'Confirmação segura de criação artística' }
    ];

    // Embaralhar e criar elementos de e-mail
    shuffleArray(emails).forEach(mail => {
        mailList.appendChild(createMailElement(mail));
    });

    // Sistema de Drag and Drop
    let dragged = null;
    document.querySelectorAll('.mail-item').forEach(item => {
        item.addEventListener('dragstart', e => {
            dragged = item;
            item.classList.add('dragging');
            e.dataTransfer.setData('text/plain', item.dataset.id);
            setTimeout(() => item.style.display = 'none', 0);
        });
        item.addEventListener('dragend', () => {
            if (dragged) {
                dragged.style.display = 'flex';
                dragged.classList.remove('dragging');
                dragged = null;
            }
        });
    });

    // Zonas de drop (inbox e trash)
    [inbox, trash].forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('over');
        });
        zone.addEventListener('dragleave', () => zone.classList.remove('over'));
        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('over');
            const id = e.dataTransfer.getData('text/plain');
            const mailEl = document.querySelector(`.mail-item[data-id="${id}"]`);
            if (!mailEl) return;
            handleDrop(JSON.parse(mailEl.dataset.meta), mailEl, zone.id);
        });
    });

    // Botão de Lupa (CORRIGIDO - agora desconta pontos)
    inspectBtn.addEventListener('click', () => {
        const first = document.querySelector('.mail-item');
        if (!first) {
            flashFeedback('❌ Nenhum e-mail disponível para analisar', 'danger');
            return;
        }

        const mail = JSON.parse(first.dataset.meta);
        lupaUsedCount++;

        // PENALIDADE: Desconta 3 pontos por usar a lupa
        score -= 3;
        if (score < 0) score = 0;

        updateScore();

        // Mostrar dica com indicação de penalidade
        flashFeedback(`🔍 Dica (-3 pts): ${mail.hint}`, 'hint');

        // Destacar o primeiro e-mail brevemente
        first.style.border = '3px solid #ffc107';
        first.style.backgroundColor = 'rgba(255, 193, 7, 0.1)';

        setTimeout(() => {
            first.style.border = '';
            first.style.backgroundColor = '';
        }, 2000);
    });

    // Timer do jogo
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = 'Tempo: ' + timeLeft;

        // Alerta visual quando falta pouco tempo
        if (timeLeft <= 10) {
            timerEl.style.color = '#ff3b3b';
            timerEl.style.fontWeight = 'bold';
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishGame();
        }
    }, 1000);

    // Botões do modal final
    retryBtn.addEventListener('click', () => window.location.reload());
    backBtn.addEventListener('click', () => {
        const confirmExit = confirm('Deseja voltar ao menu principal? Seu progresso será salvo.');
        if (confirmExit) {
            window.location.href = '../index.html';
        }
    });

    // Botão para avançar para Fase 2 (se existir no HTML)
    if (nextPhaseBtn) {
        nextPhaseBtn.addEventListener('click', () => {
            // Salvar progresso antes de avançar
            const progress = JSON.parse(localStorage.getItem('da_game_progress') || '{}');
            progress.phase1Completed = true;
            progress.phase1Score = score;
            progress.currentPhase = 2;
            localStorage.setItem('da_game_progress', JSON.stringify(progress));

            // Navegar para Fase 2
            window.location.href = '/../fase2/fase2.html';
        });
    }

    // ========================================
    // FUNÇÕES AUXILIARES
    // ========================================

    function createMailElement(meta) {
        const el = document.createElement('div');
        el.className = 'mail-item';
        el.draggable = true;
        el.dataset.id = meta.id;
        el.dataset.meta = JSON.stringify(meta);
        el.innerHTML = `
            <div class="mail-title">${meta.title}</div>
            <div class="mail-sender">${meta.sender}</div>
        `;
        return el;
    }

    function handleDrop(mail, el, zoneId) {
        const correctForInbox = !mail.phishing; // Email seguro vai para inbox
        const droppedInbox = (zoneId === 'inbox');

        if ((correctForInbox && droppedInbox) || (!correctForInbox && !droppedInbox)) {
            // ACERTOU!
            score += 10;
            flashFeedback('✔ Ação correta! Você neutralizou a ameaça.', 'success');
            animateMascote('happy');
        } else {
            // ERROU!
            score -= 5;
            if (score < 0) score = 0;
            flashFeedback('✖ Cuidado! Essa ação não foi segura.', 'danger');
            animateMascote('alert');
        }

        updateScore();
        el.remove();

        // Verificar se acabaram os e-mails
        if (document.querySelectorAll('.mail-item').length === 0) {
            finishGame();
        }
    }

    function updateScore() {
        scoreDisplay.textContent = 'Pontos: ' + score;
    }

    function finishGame() {
        clearInterval(timerInterval);

        // Salvar pontuação final
        const progress = JSON.parse(localStorage.getItem('da_game_progress') || '{}');
        progress.phase1Completed = true;
        progress.phase1Score = score;
        progress.totalScore = (progress.totalScore || 0) + score;
        localStorage.setItem('da_game_progress', JSON.stringify(progress));

        // Mensagem personalizada baseada na pontuação
        let message = '';
        if (score >= 100) {
            message = '🏆 PERFEITO! Você é um mestre da segurança digital!';
        } else if (score >= 70) {
            message = '⭐ Muito bem! Você tem ótimo discernimento!';
        } else if (score >= 50) {
            message = '✅ Bom trabalho! Continue praticando!';
        } else {
            message = '⚠️ Você pode melhorar! Tente novamente.';
        }

        endText.innerHTML = `
            <strong>Fase 1 Concluída!</strong><br>
            Pontuação: ${score} pontos<br>
            Lupas usadas: ${lupaUsedCount}x (-${lupaUsedCount * 3} pts)<br>
            <br>${message}
        `;

        endModal.classList.remove('hidden');

        if (score >= 50) {
            flashFeedback('✅ Missão bem sucedida! Sistema seguro.', 'success');
        } else {
            flashFeedback('⚠️ Missão incompleta. Tente novamente para melhorar!', 'danger');
        }
    }

    function flashFeedback(text, type) {
        feedbackBox.textContent = text;
        feedbackBox.style.border = '2px solid rgba(255,255,255,0.04)';

        if (type === 'success') {
            feedbackBox.style.background = 'linear-gradient(90deg, rgba(46,204,113,0.08), rgba(0,0,0,0.12))';
            feedbackBox.style.color = '#2ecc71';
        } else if (type === 'danger') {
            feedbackBox.style.background = 'linear-gradient(90deg, rgba(255,92,92,0.06), rgba(0,0,0,0.12))';
            feedbackBox.style.color = '#ff5c5c';
        } else if (type === 'hint') {
            feedbackBox.style.background = 'linear-gradient(90deg, rgba(255,193,7,0.08), rgba(0,0,0,0.12))';
            feedbackBox.style.color = '#ffc107';
        } else {
            feedbackBox.style.background = 'rgba(255,255,255,0.02)';
            feedbackBox.style.color = '#ffffff';
        }

        setTimeout(() => {
            feedbackBox.textContent = '';
            feedbackBox.style.background = '';
            feedbackBox.style.color = '';
        }, 3000);
    }

    function animateMascote(state) {
        const m = document.getElementById('mascote-small');
        if (!m) return;

        if (state === 'happy') {
            m.style.transform = 'translateY(-6px) scale(1.03)';
            setTimeout(() => m.style.transform = '', 700);
        } else if (state === 'alert') {
            m.style.transform = 'translateX(6px) rotate(3deg)';
            setTimeout(() => m.style.transform = '', 700);
        }
    }

    function shuffleArray(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
});