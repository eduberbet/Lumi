const CONFIG = {
    WS_URL: 'ws://localhost:8000/ws',
    MAX_HISTORICO_DICAS: 10,
    TEMPOS: {
        inatividade: 15000,
        respiro: 2500,
        abandono: 10000,
        social: 3,
        contexto: 45000,
        typing_speed: 30 
    },
    GATILHOS: {
        dor: ["triste", "sozinho", "chorar", "medo", "ruim", "morreu", "machucou", "odeio", "mal", "perdi", "gato", "cachorro"],
        vitoria: ["consegui", "entendi", "venci", "acertei", "terminei", "finalizei"],
        alegria: ["feliz", "legal", "amei", "uhu", "eba", "divertido", "top", "maravilha", "bem", "nasceu"],
        saudacoes: ["oi", "ola", "bom dia", "boa tarde", "boa noite", "tudo bem", "tudo bom", "tudo bao", "eai"]
    }
};

let socket;
let bufferMensagens = [];
let historicoDicas = []; 
let ultimaMensagemEnviada = ""; 
let jaTentouReenviar = false;
let recognition;
let estaGravando = false;

let timerEnvioCerebro, timerAbandono, timerInatividade;
let contadorPapoSocial = 0;
let momentoEnvio = 0;
let contextoUltimaInteracao = { tipo: "idle", timestamp: 0 };

const UI = {
    focus: document.getElementById('lumi-focus'),
    status: document.getElementById('lumi-status'),
    input: document.getElementById('user-input'),
    messages: document.getElementById('messages'),
    sendBtn: document.getElementById('send-btn'), // Botão de clique/Enter
    sttBtn: document.getElementById('stt-btn'),   // Botão Irradiar (Voz)
    
    setEstado(classe, texto) {
        if (this.focus) this.focus.className = classe;
        if (texto) this.status.innerText = texto;
    },

    escrever(texto, classeCss = "dica-lumi") {
        this.messages.innerHTML = `<div class="${classeCss}"><strong>LUMI:</strong> <span id="typing"></span></div>`;
        const span = document.getElementById('typing');
        let i = 0;
        const intervalo = setInterval(() => {
            if (i < texto.length) {
                span.textContent += texto[i];
                i++;
            } else {
                clearInterval(intervalo);
                this.falar(texto);
            }
        }, CONFIG.TEMPOS.typing_speed);
    },

    falar(texto) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(texto);
            utterance.lang = 'pt-BR';
            utterance.rate = 1.1;
            window.speechSynthesis.speak(utterance);
        }
    }
};

// --- CONFIGURAÇÃO DO RECONHECIMENTO DE VOZ (STT) ---
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const textoTranscrito = event.results[0][0].transcript;
        UI.input.value = textoTranscrito;
        console.log("[LUMI] Irradiação captada:", textoTranscrito);
        processarEntrada(); // Envia automaticamente ao transcrever
    };

    recognition.onend = () => {
        estaGravando = false;
        if (UI.status.innerText === "Irradiando...") UI.setEstado('lumi-idle', "Em sintonia");
    };
}

// --- MOTOR DE FLUXO ---

function processarEntrada() {
    const texto = UI.input.value.trim();
    if (!texto) return;

    clearTimeout(timerAbandono);
    clearTimeout(timerEnvioCerebro);

    bufferMensagens.push(texto);
    UI.input.value = '';
    UI.setEstado('lumi-captando', "Em escuta...");

    timerEnvioCerebro = setTimeout(dispararMensagem, CONFIG.TEMPOS.respiro);
}

function dispararMensagem(isRetry = false) {
    if (bufferMensagens.length === 0 && !isRetry) return;
    const mensagem = isRetry ? ultimaMensagemEnviada : bufferMensagens.join(" ");
    if (!isRetry) { ultimaMensagemEnviada = mensagem; bufferMensagens = []; }
    if (analisarBorda(mensagem)) return;
    if (socket && socket.readyState === WebSocket.OPEN) {
        momentoEnvio = Date.now();
        UI.setEstado('lumi-captando', isRetry ? "Re-sintonizando..." : "Processando...");
        socket.send(JSON.stringify({ texto: mensagem, retry: isRetry }));
    }
}

// --- ANÁLISE DE BORDA (NEUTRA) ---

function analisarBorda(mensagem) {
    const input = normalizar(mensagem);
    const agora = Date.now();
    const emJanela = (agora - contextoUltimaInteracao.timestamp < CONFIG.TEMPOS.contexto);

    const gatilhos = {
        temDor: CONFIG.GATILHOS.dor.some(p => input.includes(p)),
        temVitoria: CONFIG.GATILHOS.vitoria.some(p => input.includes(p)),
        temAlegria: CONFIG.GATILHOS.alegria.some(p => input.includes(p)),
        ehSaudacao: CONFIG.GATILHOS.saudacoes.some(s => input.includes(s)),
        ehPq: (input.includes("pq") || input.includes("porque") || input.includes("por que"))
    };

    if (gatilhos.ehPq && emJanela && contextoUltimaInteracao.tipo === "acolhimento") {
        UI.setEstado('lumi-acolhimento', "Explicação");
        UI.escrever("Existe o desejo de ajudar, mas este é um sistema de código. O apoio humano do seu professor ou professora é o caminho ideal agora.", "msg-acolhimento");
        return true;
    }
    if (gatilhos.temDor) {
        UI.setEstado('lumi-acolhimento', "Acolhendo");
        UI.escrever("Sinto muito por este momento. Saiba que o seu professor ou professora está por perto para te ouvir.", "msg-acolhimento");
        contextoUltimaInteracao = { tipo: "acolhimento", timestamp: agora };
        return true;
    }
    if (gatilhos.ehSaudacao) {
        contadorPapoSocial++;
        if (contadorPapoSocial > CONFIG.TEMPOS.social) {
            UI.setEstado('lumi-drible', "Foco no tema");
            UI.escrever("Vamos focar no que estamos aprendendo agora?", "msg-drible");
        } else {
            UI.setEstado('lumi-idle', "Em sintonia");
            UI.escrever("Olá! O sistema está pronto. O que vamos descobrir em conjunto?");
        }
        return true;
    }
    return false;
}

// --- COMUNICAÇÃO ---

function conectar() {
    socket = new WebSocket(CONFIG.WS_URL);
    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (!data.corpo_da_dica) throw new Error("Dado incompleto");
            jaTentouReenviar = false;
            historicoDicas.push(data.corpo_da_dica);
            if (historicoDicas.length > CONFIG.MAX_HISTORICO_DICAS) historicoDicas.shift();
            UI.setEstado('lumi-idle', "Conectado");
            UI.escrever(data.corpo_da_dica);
            contextoUltimaInteracao = { tipo: "aula", timestamp: Date.now() };
        } catch (err) { tentarRecuperar(); }
    };
    socket.onclose = () => { UI.setEstado('lumi-off', "Desconectado"); setTimeout(conectar, 3000); };
    socket.onopen = () => { UI.setEstado('lumi-idle', "Em sintonia"); };
}

function tentarRecuperar() {
    if (!jaTentouReenviar) {
        jaTentouReenviar = true;
        UI.setEstado('lumi-drible', "Re-sintonizando");
        setTimeout(() => dispararMensagem(true), 1500);
    } else {
        UI.escrever("Houve uma pequena falha de sinal. Pode repetir a última frase?");
        jaTentouReenviar = false;
    }
}

// --- EVENTOS DE INTERAÇÃO ---

// Botão Tradicional (Clique)
UI.sendBtn.onclick = processarEntrada;

// Botão Irradiar (Segurar para falar)
if (UI.sttBtn) {
    UI.sttBtn.onmousedown = () => {
        if (recognition && !estaGravando) {
            estaGravando = true;
            window.speechSynthesis.cancel();
            UI.input.value = "";
            UI.setEstado('lumi-captando', "Irradiando..."); // Estado especial de escuta
            recognition.start();
        }
    };
    UI.sttBtn.onmouseup = () => { if (recognition && estaGravando) recognition.stop(); };
    UI.sttBtn.onmouseleave = () => { if (recognition && estaGravando) recognition.stop(); }; // Segurança se sair do botão
    // Touch
    UI.sttBtn.ontouchstart = (e) => { e.preventDefault(); UI.sttBtn.onmousedown(); };
    UI.sttBtn.ontouchend = (e) => { e.preventDefault(); UI.sttBtn.onmouseup(); };
}

UI.input.oninput = () => {
    clearTimeout(timerEnvioCerebro);
    clearTimeout(timerAbandono);
    timerAbandono = setTimeout(() => {
        if (UI.input.value.trim() !== "") {
            UI.input.value = '';
            if (bufferMensagens.length > 0) dispararMensagem();
            else UI.setEstado('lumi-idle', "Em sintonia");
        }
    }, CONFIG.TEMPOS.abandono);
};

UI.input.onkeydown = (e) => { if (e.key === "Enter") processarEntrada(); };

function normalizar(txt) { return txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim(); }

conectar();