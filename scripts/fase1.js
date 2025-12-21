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

    let score = 0;
    let timeLeft = 60;
    scoreDisplay.textContent = 'Pontos: ' + score;
    timerEl.textContent = 'Tempo: ' + timeLeft;

    const emails = [
        { id: 'e1', title: 'URGENTE! Sua conta vai ser BLOQUEADA!', sender: 'SuporteTecnico123@hotmal.com', phishing: true, hint: 'Domínio estranho e urgência excessiva' },
        { id: 'e2', title: 'Você GANHOU um Super Console de Jogos!', sender: 'LojaDosSonhos@gmail.co', phishing: true, hint: 'Oferta falsa e cobrança de taxa' },
        { id: 'e3', title: 'Oi, sou seu amigo! Preciso de ajuda RÁPIDA!', sender: 'amigo-verdadeiro@serverX.net', phishing: true, hint: 'Pedido suspeito de dados financeiros' },
        { id: 'e4', title: 'Sua Fatura do Mês Venceu! Clique Aqui!', sender: 'Conta-Falsa-2025@empresas.br', phishing: true, hint: 'Boleto falso, link suspeito' },
        { id: 'e5', title: 'VOCÊ GANHOU GIROS GRÁTIS!!!', sender: 'tigrinhocorp@gmail.com', phishing: true, hint: 'Depósito suspeito para prêmio' },
        { id: 'e6', title: 'NOTÍCIA INACREDITÁVEL! O que aconteceu com o Antivírus?', sender: 'noticias-urgente@news-br.xyz', phishing: true, hint: 'Clickbait e link suspeito' },
        { id: 'e7', title: 'Seu AntiVírus VENCEU! Instale este NOVO!', sender: 'SegurancaOficial@seguro.com', phishing: true, hint: 'Anexo executável malicioso' },
        { id: 'e8', title: 'Dica de Segurança da Semana!', sender: 'AntivírusMentor@Desktop.com', phishing: false, hint: 'Email oficial de segurança' },
        { id: 'e9', title: 'Nova Tarefa: Verificar as Notas Escolares', sender: 'ListaDeTarefas@Desktop.com', phishing: false, hint: 'Solicitação segura de rotina' },
        { id: 'e10', title: 'Seu Pedido Chegou! (Ícone Novo)', sender: 'LojaDoJogo@Shop.com', phishing: false, hint: 'Confirmação legítima de entrega' },
        { id: 'e11', title: 'Você viu o novo vídeo do Super Gato?', sender: 'AmigoVirtual@Desktop.com', phishing: false, hint: 'Link seguro de amigo' },
        { id: 'e12', title: 'Confirmação: Lixeira Esvaziada', sender: 'LixeiraEsvaziada@Sistema.com', phishing: false, hint: 'Sistema legítimo de feedback' },
        { id: 'e13', title: 'Atualização de Segurança - Necessária!', sender: 'SistemaOperacional@Desktop.com', phishing: false, hint: 'Notificação de atualização legítima' },
        { id: 'e14', title: 'Lembrete: Festa de Aniversário Amanhã!', sender: 'Calendario@App.com', phishing: false, hint: 'Lembrete legítimo de agenda' },
        { id: 'e15', title: 'Seu Desenho da Semana foi Aprovado!', sender: 'ClubeDeDesenho@App.com', phishing: false, hint: 'Confirmação segura de criação' }
    ];

    shuffleArray(emails).forEach(mail => {
        mailList.appendChild(createMailElement(mail));
    });

    let dragged = null;
    document.querySelectorAll('.mail-item').forEach(item => {
        item.addEventListener('dragstart', e => {
            dragged = item;
            item.classList.add('dragging');
            e.dataTransfer.setData('text/plain', item.dataset.id);
            setTimeout(() => item.style.display = 'none', 0);
        });
        item.addEventListener('dragend', () => {
            if (dragged) { dragged.style.display = 'flex'; dragged.classList.remove('dragging'); dragged = null; }
        });
    });

    [inbox, trash].forEach(zone => {
        zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('over'));
        zone.addEventListener('drop', e => {
            e.preventDefault(); zone.classList.remove('over');
            const id = e.dataTransfer.getData('text/plain');
            const mailEl = document.querySelector(`.mail-item[data-id="${id}"]`);
            if (!mailEl) return;
            handleDrop(JSON.parse(mailEl.dataset.meta), mailEl, zone.id);
        });
    });

    inspectBtn.addEventListener('click', () => {
        const first = document.querySelector('.mail-item');
        if (!first) { flashFeedback('Nenhum e-mail disponível', 'danger'); return; }
        const mail = JSON.parse(first.dataset.meta);
        flashFeedback(`Lupa: ${mail.hint} (Próximo e-mail revelado)`, 'hint');
        score += 2; updateScore();
    });

    const timerInterval = setInterval(() => {
        timeLeft--; timerEl.textContent = 'Tempo: ' + timeLeft;
        if (timeLeft <= 0) { clearInterval(timerInterval); finishGame(); }
    }, 1000);

    retryBtn.addEventListener('click', () => window.location.reload());
    backBtn.addEventListener('click', () => window.location.href = 'index.html');

    function createMailElement(meta) {
        const el = document.createElement('div');
        el.className = 'mail-item'; el.draggable = true;
        el.dataset.id = meta.id;
        el.dataset.meta = JSON.stringify(meta);
        el.innerHTML = `<div class="mail-title">${meta.title}</div><div class="mail-sender">${meta.sender}</div>`;
        return el;
    }

    function handleDrop(mail, el, zoneId) {
        const correctForInbox = !mail.phishing;
        const droppedInbox = (zoneId === 'inbox');
        if ((correctForInbox && droppedInbox) || (!correctForInbox && !droppedInbox)) {
            score += 10; flashFeedback('✔ Ação correta! Você neutralizou a ameaça.', 'success'); animateMascote('happy');
        } else { score -= 5; if (score < 0) score = 0; flashFeedback('✖ Cuidado! Essa ação não foi segura.', 'danger'); animateMascote('alert'); }
        updateScore(); el.remove();
        if (document.querySelectorAll('.mail-item').length === 0) finishGame();
    }

    function updateScore() { scoreDisplay.textContent = 'Pontos: ' + score; }

    function finishGame() {
        endText.textContent = `Você fez ${score} pontos`;
        endModal.classList.remove('hidden');
        if (score >= 50) flashFeedback('Missão bem sucedida! Sistema seguro ✔', 'success');
        else flashFeedback('Missão incompleta. Tente novamente para melhorar sua pontuação.', 'danger');
    }

    function flashFeedback(text, type) {
        feedbackBox.textContent = text;
        feedbackBox.style.border = '2px solid rgba(255,255,255,0.04)';
        if (type === 'success') feedbackBox.style.background = 'linear-gradient(90deg, rgba(46,204,113,0.08), rgba(0,0,0,0.12))';
        else if (type === 'danger') feedbackBox.style.background = 'linear-gradient(90deg, rgba(255,92,92,0.06), rgba(0,0,0,0.12))';
        else feedbackBox.style.background = 'rgba(255,255,255,0.02)';
        setTimeout(() => { feedbackBox.textContent = ''; feedbackBox.style.background = ''; }, 3000);
    }

    function animateMascote(state) {
        const m = document.getElementById('mascote-small'); if (!m) return;
        if (state === 'happy') { m.style.transform = 'translateY(-6px) scale(1.03)'; setTimeout(() => m.style.transform = ' ', 700); }
        else if (state === 'alert') { m.style.transform = 'translateX(6px) rotate(3deg)'; setTimeout(() => m.style.transform = ' ', 700); }
    }

    function shuffleArray(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
});
