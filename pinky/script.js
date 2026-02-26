/* LUMI - Script de Borda (Fase 1: Alpha)
   Responsável pela conexão WebSocket e Resiliência de Rede.
*/

let socket;
const focus = document.getElementById('lumi-focus');
const statusText = document.getElementById('lumi-status');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const messages = document.getElementById('messages');

function conectar() {
    // Tenta abrir a sintonização com o Cérebro na porta 8000
    socket = new WebSocket('ws://localhost:8000/ws');

    socket.onopen = () => {
        console.log("Conectado ao Cérebro!");
        statusText.innerText = "Sintonizada";
        focus.className = 'lumi-idle';
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // Finaliza animação de processamento
        focus.className = 'lumi-idle';
        
        if (data.status_progresso === "DRIBLE") {
            // Feedback de ruído (não polui o histórico principal)
            statusText.innerText = "Ruído detectado!";
            messages.innerHTML = `<div style="color: #ffaa00; font-style: italic;">${data.corpo_da_dica}</div>`;
        } else {
            // Atualiza a dica socrática na tela
            messages.innerHTML = `<div class="dica-lumi"><strong>LUMI [${data.aluno_alvo}]:</strong> ${data.corpo_da_dica}</div>`;
            statusText.innerText = "Sintonizada";
        }
    };

    socket.onclose = () => {
        // Se a conexão cair, avisa o aluno e tenta voltar em 3 segundos
        statusText.innerText = "Sintonizando novamente...";
        focus.className = 'lumi-off';
        console.warn("Frequência perdida. Tentando reconectar...");
        setTimeout(conectar, 3000);
    };

    socket.onerror = (err) => {
        socket.close(); // Força o onclose para disparar a reconexão
    };
}

// Lógica de envio de mensagens
sendBtn.onclick = () => {
    const text = userInput.value;
    
    // Só envia se houver texto e a conexão estiver aberta
    if (!text || socket.readyState !== WebSocket.OPEN) return;

    // Feedback visual: Lumi está "ouvindo"
    focus.className = 'lumi-captando';
    
    socket.send(JSON.stringify({ texto: text }));
    userInput.value = '';
};

// Inicia o processo de conexão ao carregar a página
conectar();