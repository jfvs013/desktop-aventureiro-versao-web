// Fase 1: triagem de emails
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

    let player = localStorage.getItem('da_player') || 'Gerente';
    playerDisplay.textContent = 'Jogador: ' + player;

    // configuração inicial
    let score = 0;
    let timeLeft = 60; // segundos
    scoreDisplay.textContent = 'Pontos: ' + score;
    timerEl.textContent = 'Tempo: ' + timeLeft;

    // exemplos de emails (alguns legítimos, outros phishing)
    const emails = [
        { id: 'e1', title: 'Atualize sua senha', sender: 'suporte@banco-seguro.com', phishing: true, hint: 'Domínio estranho e urgência excessiva' },
        { id: 'e2', title: 'Fatura do cartão', sender: 'cartoes@meubanco.com', phishing: false, hint: 'Domínio oficial, sem pedido de dados' },
        { id: 'e3', title: 'Você ganhou um prêmio!', sender: 'promo@oferta-top.com', phishing: true, hint: 'Prêmios inesperados são suspeitos' },
        { id: 'e4', title: 'Confirmação de entrega', sender: 'noreply@loja-confiavel.com', phishing: false, hint: 'Envio legítimo de loja' },
        { id: 'e5', title: 'Verifique seus dados agora', sender: 'security@servico.com', phishing: true, hint: 'Solicitação de dados pessoais' },
        { id: 'e6', title: 'Atualização do app', sender: 'noreply@appstore.com', phishing: false, hint: 'Mensagens de serviço confiáveis' }
    ];

    // embaralhar e renderizar
    shuffleArray(emails).forEach(mail => {
        const el = createMailElement(mail);
        mailList.appendChild(el);
    });

    // drag & drop handlers
    let dragged = null;

    document.querySelectorAll('.mail-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
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

    [inbox, trash].forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('over');
        });
        zone.addEventListener('dragleave', () => zone.classList.remove('over'));

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('over');
            const id = e.dataTransfer.getData('text/plain');
            const mailEl = document.querySelector(`.mail-item[data-id="${id}"]`);
            if (!mailEl) return;

            const mailData = JSON.parse(mailEl.dataset.meta);
            handleDrop(mailData, mailEl, zone.id);
        });
    });

    // Lupa Segura -> revela hint (pontos extras)
    inspectBtn.addEventListener('click', () => {
        const first = document.querySelector('.mail-item');
        if (!first) { flashFeedback('Nenhum e-mail disponível', 'danger'); return; }
        const mail = JSON.parse(first.dataset.meta);
        flashFeedback(`Lupa: ${mail.hint} (Próximo e-mail revelado)`, 'hint');
        // dar bônus visual (sem remover)
        score += 2;
        updateScore();
    });

    // timer
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = 'Tempo: ' + timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishGame();
        }
    }, 1000);

    // end modal buttons
    retryBtn.addEventListener('click', () => {
        window.location.reload();
    });
    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // helpers
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
        // zoneId: 'inbox' or 'trash'
        const correctForInbox = !mail.phishing;
        const droppedInbox = (zoneId === 'inbox');

        // pontuação e feedback
        if ((correctForInbox && droppedInbox) || (!correctForInbox && !droppedInbox)) {
            // correto
            score += 10;
            flashFeedback('✔ Ação correta! Você neutralizou a ameaça.', 'success');
            animateMascote('happy');
        } else {
            // errado
            score -= 5;
            if (score < 0) score = 0;
            flashFeedback('✖ Cuidado! Essa ação não foi segura.', 'danger');
            animateMascote('alert');
        }
        updateScore();

        // remover item visualmente
        el.remove();

        // se acabar os e-mails, finalizar
        if (document.querySelectorAll('.mail-item').length === 0) {
            finishGame();
        }
    }

    function updateScore() {
        scoreDisplay.textContent = 'Pontos: ' + score;
    }

    function finishGame() {
        endText.textContent = `Você fez ${score} pontos`;
        endModal.classList.remove('hidden');
        // pequeno efeito final
        if (score >= 30) flashFeedback('Missão bem sucedida! Sistema seguro ✔', 'success');
        else flashFeedback('Missão incompleta. Tente novamente para melhorar sua pontuação.', 'danger');
    }

    function flashFeedback(text, type) {
        feedbackBox.textContent = text;
        feedbackBox.style.border = '2px solid rgba(255,255,255,0.04)';
        if (type === 'success') feedbackBox.style.background = 'linear-gradient(90deg, rgba(46,204,113,0.08), rgba(0,0,0,0.12))';
        else if (type === 'danger') feedbackBox.style.background = 'linear-gradient(90deg, rgba(255,92,92,0.06), rgba(0,0,0,0.12))';
        else feedbackBox.style.background = 'rgba(255,255,255,0.02)';
        // limpa depois de 3s
        setTimeout(() => {
            feedbackBox.textContent = '';
            feedbackBox.style.background = '';
        }, 3000);
    }

    // mascote simples: troca de imagem / classes (você pode trocar por sprites animadas mais tarde)
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

    // util: embaralhar
    function shuffleArray(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

});
