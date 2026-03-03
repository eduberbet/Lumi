/**
 * LUMI - Script de Borda (Versão 2.9.5)
 * Lógica: Conquista condicionada ao histórico do Cérebro.
 */

const CONFIG = {
    WS_URL: 'ws://localhost:8000/ws',
    LIMITES: { inatividade: 10000, social: 3, latenciaMin: 1500, contexto: 45000 },
    GATILHOS: {
        dor: ["triste", "sozinho", "chorar", "medo", "ruim", "morreu", "machucou", "odeio", "mal", "gato", "perdi"],
        vitoria: ["consegui", "entendi", "venci", "acertei", "terminei", "finalizei"],
        alegria: ["feliz", "legal", "amei", "uhu", "eba", "divertido", "top", "maravilha", "bem"],
        saudacoes: ["oi", "ola", "bom dia", "boa tarde", "boa noite", "tudo bem", "tudo bom", "tudo bao", "eai"]
    }
};

let socket;
let timerInatividade;
let contadorPapoSocial = 0;
let momentoEnvio = 0;
// contextoUltimaInteracao.tipo pode ser: 'idle', 'aula', 'acolhimento', 'social'
let contextoUltimaInteracao = { tipo: "idle", timestamp: 0 }; 

const UI = {
    focus: document.getElementById('lumi-focus'),
    status: document.getElementById('lumi-status'),
    input: document.getElementById('user-input'),
    messages: document.getElementById('messages'),
    sendBtn: document.getElementById('send-btn'),
    setEstado(classe, texto, htmlMsg = null) {
        if (!this.focus) return;
        this.focus.className = classe;
        if (texto) this.status.innerText = texto;
        if (htmlMsg) this.messages.innerHTML = htmlMsg;
    }
};

function normalizar(txt) {
    return txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function conectar() {
    socket = new WebSocket(CONFIG.WS_URL);
    socket.onopen = () => { UI.setEstado('lumi-idle', "Sintonizada"); resetarTemporizador(); };
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const espera = Math.max(0, CONFIG.LIMITES.latenciaMin - (Date.now() - momentoEnvio));
        setTimeout(() => {
            processarRespostaCerebro(data);
            // MARCA QUE A ÚLTIMA INTERAÇÃO VEIO DO CÉREBRO (CONTEÚDO)
            contextoUltimaInteracao = { tipo: "aula", timestamp: Date.now() };
        }, espera);
    };
    socket.onclose = () => { UI.setEstado('lumi-off', "Sintonizando..."); setTimeout(conectar, 3000); };
}

function analisarBorda(textoOriginal) {
    const input = normalizar(textoOriginal);
    const agora = Date.now();
    const emJanela = (agora - contextoUltimaInteracao.timestamp < CONFIG.LIMITES.contexto);

    // 1. GATILHOS BÁSICOS
    const temDor = CONFIG.GATILHOS.dor.some(p => input.includes(p));
    const temVitoria = CONFIG.GATILHOS.vitoria.some(p => input.includes(p));
    const temAlegria = CONFIG.GATILHOS.alegria.some(p => input.includes(p));
    const ehSaudacao = CONFIG.GATILHOS.saudacoes.some(s => input.includes(s));
    const ehPq = (input.includes("pq") || input.includes("porque"));

    // 2. LOGICA DE CONTEXTO (POR QUE?)
    if (ehPq && emJanela) {
        if (contextoUltimaInteracao.tipo === "acolhimento") {
            UI.setEstado('lumi-acolhimento', "Lumi explica...", `<div style="color: #d199ff; font-style: italic;">Porque eu me importo com você, mas sou apenas código. Seu professor tem o acolhimento humano que você precisa agora.</div>`);
            return true;
        }
    }

    // 3. VITÓRIA OU ALEGRIA? (O SEU PONTO!)
    if (temVitoria || temAlegria) {
        // Se houve um input do cérebro recentemente E o aluno disse que "conseguiu" ou está "feliz"
        if (emJanela && contextoUltimaInteracao.tipo === "aula" && temVitoria) {
            UI.setEstado('lumi-entusiasmo', "Lumi celebra!", `<div style="color: #2ecc71; font-weight: bold;">Uhu! Parabéns por ter conseguido aplicar a dica! Você está brilhando!</div>`);
        } else {
            // Caso contrário, é apenas um estado de humor
            UI.setEstado('lumi-entusiasmo', "Lumi brilha!", `<div style="color: #2ecc71; font-weight: bold;">Que energia maravilhosa! Adoro te ver assim, vamos manter esse brilho na aula?</div>`);
        }
        contextoUltimaInteracao = { tipo: "social", timestamp: agora };
        agendarReset(5000);
        return true;
    }

    // 4. ACOLHIMENTO
    if (temDor) {
        UI.setEstado('lumi-acolhimento', "Lumi te ouve...", `<div style="color: #d199ff; font-style: italic;">Sinto muito. Lembre-se que seu professor(a) está aqui por você.</div>`);
        contextoUltimaInteracao = { tipo: "acolhimento", timestamp: agora };
        agendarReset(7000);
        return true;
    }

    // 5. SAUDAÇÕES
    if (ehSaudacao) {
        contadorPapoSocial++;
        if (contadorPapoSocial > CONFIG.LIMITES.social) {
            UI.setEstado('lumi-drible', "Foco na aula!", `<div style="color: #ff6666;">Vamos focar no conteúdo?</div>`);
            agendarReset(3000);
        } else {
            UI.setEstado('lumi-idle', "Sintonizada", `<div class="dica-lumi">Olá! Tudo pronto por aqui. O que vamos descobrir?</div>`);
            resetarTemporizador();
        }
        return true;
    }

    return false;
}

function enviarMensagem() {
    const text = UI.input.value;
    if (!text || (socket && socket.readyState !== WebSocket.OPEN)) return;
    if (analisarBorda(text)) { UI.input.value = ''; return; }
    momentoEnvio = Date.now();
    UI.setEstado('lumi-captando', "Processando...");
    socket.send(JSON.stringify({ texto: text }));
    UI.input.value = '';
}

function processarRespostaCerebro(data) {
    if (data.status_progresso === "DRIBLE") {
        UI.setEstado('lumi-drible', "Foco!", `<div style="color: #ff6666; font-weight: bold;">${data.corpo_da_dica}</div>`);
        agendarReset(2500);
    } else {
        UI.setEstado('lumi-idle', "Sintonizada", `<div class="dica-lumi"><strong>LUMI:</strong> ${data.corpo_da_dica}</div>`);
        resetarTemporizador();
    }
}

function resetarTemporizador() {
    clearTimeout(timerInatividade);
    timerInatividade = setTimeout(() => {
        if (socket && socket.readyState === WebSocket.OPEN) UI.setEstado('lumi-waiting', "Aguardando...");
    }, CONFIG.LIMITES.inatividade);
}

function agendarReset(ms) {
    clearTimeout(timerInatividade);
    setTimeout(() => { UI.setEstado('lumi-idle', "Sintonizada"); resetarTemporizador(); }, ms);
}

UI.sendBtn.onclick = enviarMensagem;
UI.input.onkeydown = (e) => { if (e.key === "Enter") enviarMensagem(); };
conectar();