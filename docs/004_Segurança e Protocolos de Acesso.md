🛡️ [DOC-04] Segurança e Protocolos de Acesso: A Fortaleza
Versão: 1.2 
Conceito: Acesso Assimétrico e Autenticação por Proximidade Visual.
Foco: Integridade do Sistema, UX "Zero Atrito" e Soberania do Professor.

1. Arquitetura de Portas e Isolamento de Redes
Para garantir que a gestão da inteligência nunca seja exposta a interferências externas, o sistema opera com dois "túneis" de comunicação física e lógica distintos:
Porta 80 / 443 (Interface PINKY - Aluno):
Acesso: Disponível para qualquer dispositivo via Wi-Fi na rede local (Ex: http://192.168.1.15).
Restrição de Funções: Exibe exclusivamente a interface de interação (voz/texto) do aluno. Não possui rotas para o sistema de arquivos, configurações de IA ou logs do professor.
Nota Técnica: Requer execução do servidor com privilégios elevados (Admin/Sudo) para assumir as portas padrão do protocolo HTTP/HTTPS.
Porta 9999 (Interface CÉREBRO - Professor/Admin):
Acesso: Restrito estritamente ao Localhost (http://127.0.0.1:9999).
Bloqueio de Rede: O servidor recusa sumariamente qualquer conexão nesta porta que não tenha origem no IP de loopback da própria máquina.
Funcionalidades: Gestão de PDFs, Edição do "Prompt de Ouro", Visualização do Caderno de Erros, Heatmap de Cache Semântico e Controle de Sessão.

2. Protocolo de Entrada: QR-Auth (Aperto de Mão Silencioso)
O sistema elimina a necessidade de digitação manual de IPs ou PINs por parte do aluno, utilizando um protocolo de autenticação visual:
Geração Dinâmica: O Cérebro gera um PIN dinâmico exclusivo para a sessão da aula.
QR Code Inteligente: O Cérebro projeta na lousa um QR Code contendo a URL de acesso com o token de autenticação embutido (Ex: http://192.168.1.15).
Autenticação Automática: Ao escanear, o Pinky extrai o token da URL e valida o WebSocket instantaneamente. O aluno é direcionado diretamente para a tela de identificação ("Qual o seu nome?").
Barreira Anti-Intruso: Tentativas de acesso direto ao IP sem o token de autenticação resultam em redirecionamento para uma tela de bloqueio: "Acesso Negado: Por favor, escaneie o QR Code da sala".

3. Filtro Híbrido de Sanitização (Nomes e Conduta)
Antes de permitir o início da tutoria, o Lumi valida a identidade do aluno em duas camadas:
Camada 1 (Blacklist Estática): Filtro instantâneo contra dicionário local de palavras de baixo calão, termos sexuais ou ofensas pré-mapeadas.
Camada 2 (Validação por IA): O Cérebro realiza uma inferência ultra-rápida (LLM) para detectar se o nome inserido carrega intenções de insulto, ironia ofensiva ou nomes falsos inadequados.
Ação: Em caso de reprovação, o Lumi responde de forma leve e neutra: "Puxa, esse nome é meio estranho... como seus pais te chamam no dia a dia?".

4. O Kill Switch (Reset Total de Emergência)
Mecanismo de interrupção imediata para controle disciplinar ou técnico:
Comando Mestre: Botão persistente no painel do Cérebro (Porta 9999).
Ação em Cascata: Dispara um sinal de terminação para todos os WebSockets ativos e invalida o PIN/Token atual.
Estado Final: Todos os Pinkys interrompem o áudio na hora e exibem a tela de "Lumi em Repouso", bloqueando novas entradas até que o professor gere um novo QR Code.

5. Privacidade e Proteção de Dados (Zero Cloud)
Volatilidade de Áudio: A conversão voz-para-texto (STT) ocorre no Pinky ou é enviada como stream efêmero para o Cérebro. O arquivo de áudio original nunca é armazenado, protegendo a privacidade biométrica vocal do aluno.
Isolamento de Conhecimento: A pasta de documentos (/data/books) é blindada. O Pinky recebe apenas os trechos de texto necessários para a dica atual, sem permissão para listar ou ler outros arquivos do sistema.
Relatórios Locais: O Caderno de Erros e os dados de performance permanecem trancados no disco rígido do Cérebro, acessíveis apenas fisicamente pelo professor.

6. Protocolo de Resiliência "Pinky Inteligente"
Caso a conexão de rede oscile ou o servidor sofra uma pane:
O Pinky detecta a queda do WebSocket e ativa sua Memória de Curto Prazo (Nome + Última Pergunta).
Informa o aluno de forma amigável ("Minha lanterna apagou!") e entra em modo de espera, tentando reconectar em segundo plano sem perder o contexto da conversa.
