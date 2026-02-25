🔦 [DOC-01] Documento de Visão e Escopo: Projeto LUMI

Versão: 3.0 
Codinome: LUMI (Lanterna Universal de Mediação Inteligente)
Arquitetura: Open Core (Núcleo Aberto) / Modelo Cérebro-Pinky

1. Introdução e Objetivo
O Lumi é um ecossistema de Inteligência Artificial para suporte à aprendizagem, operando 100% offline em rede local. O objetivo central é fornecer monitoria socrática individualizada ou em duplas, utilizando materiais didáticos fornecidos pelo professor (RAG). A Lumi atua como uma "lanterna digital": ela não carrega o aluno pelo caminho (dando a resposta), mas ilumina o próximo passo para que o aluno caminhe por conta própria.

2. Identidade e Personalidade
Gênero: Estritamente neutro.
Voz: Andrógina, clara e levemente robótica (para reforçar a transparência tecnológica).
Tom de Voz: Amigável, simples ("Simples Bem Feito"), empático e lúdico.
Comportamento: Atrapalhado-inteligente. Quando o sistema falha ou demora, a Lumi assume a responsabilidade de forma engraçada (ex: "Derrubei minhas lentes").

3. Modelo de Negócio e Distribuição (Open Core)
O projeto é dividido em duas camadas de desenvolvimento:
Lumi Open (Público/GitHub): Motores básicos de voz (STT/TTS), interface Web responsiva e integração de chat padrão com LLMs locais.
Lumi Core/Pro (Privado/Cofre): Prompt de Ouro Socrático, Camada de Reflexão (Humor de Espera), Enxertos de Texto, Cache Semântico, Modo Desafio, Modo Duplas e Relatórios Pedagógicos.
4. Funcionalidades Detalhadas
4.1. Mediação Socrática (Modo Lanterna) - [MVP]
O núcleo do sistema. A Lumi utiliza Retrieval-Augmented Generation (RAG) para consultar documentos locais.
Regra de Ouro: Proibição de fornecer a solução.
Técnica: Devolver dicas, analogias cotidianas e perguntas que levem o aluno a consultar o material novamente.
4.2. Gestão de Latência e "Espera Ativa" - [MVP]
Para mitigar o atraso do hardware local (Cérebro), o Pinky (interface) assume falas "tapa-buraco".
Humor Lúdico: Frases sobre "limpar as lentes", "escalar montanhas de livros" ou "fritar circuitos".
Enxerto de Texto: O Pinky adapta a resposta que vem do Cérebro para que a conversa faça sentido com a frase de espera usada.
4.3. Modo Desafio (Revisão Ativa) - [ROBUSTO]
A Lumi toma a iniciativa da aula.
Ação: Sorteia conceitos do material carregado e faz perguntas ao aluno.
Reforço: Guia o aluno através dos erros até que ele demonstre domínio do conceito.
4.4. Dinâmica de Duplas (Aprendizado Colaborativo) - [ROBUSTO]
A Lumi identifica a presença de dois interlocutores.
Mediação: Propõe pausas para que a dupla discuta entre si antes de pedir uma nova dica ou validar uma resposta.
4.5. Inteligência de Cache Semântico e Telemetria - [PRO]
Eficiência: Perguntas com o mesmo sentido não disparam o LLM; usam a resposta em cache.
Heatmap: O Cérebro gera um relatório para o professor mostrando quais dicas de cache foram as mais "clicadas", indicando o maior desafio da turma.
4.6. Painel do Professor (Cérebro - Admin) - [MVP/PRO]
Gestão de Materiais: Upload de PDFs e documentos.
Post-its do Prof: Adição de notas rápidas para ajustar o conhecimento da Lumi.
Kill Switch: Comando mestre para silenciamento imediato.
Caderno de Erros: Lista de perguntas que a Lumi não conseguiu mediar ou que resultaram em frustração.

5. Arquitetura de Acesso Assimétrico (Segurança)
Cérebro (Localhost): Única interface que permite acesso ao "Cofre" (Prompts), gestão de arquivos e relatórios. O acesso físico garante a segurança administrativa sem senhas complexas.
Pinky (Wi-Fi/IP): Interface restrita ao aluno. Não "vê" o Cérebro, apenas interage com a voz e o texto da Lumi. Possui autonomia mínima de resiliência e memória local (Nome + Última Pergunta + Estado).

6. Restrições e Limites
Privacidade Total: 100% Offline. Nenhum dado sai da rede local.
Acessibilidade Nativa: O processamento de áudio (STT/TTS) ocorre no dispositivo do aluno (Pinky), permitindo o uso de ferramentas de acessibilidade do próprio sistema (Android/iOS/Windows).
Simplicidade: Proibição de jargões técnicos na interface do aluno.

7. Roadmap de Evolução
Fase 1 (MVP): Fluxo Áudio-Texto-IA-Voz, RAG básico, Prompt Socrático e Interface Cérebro/Pinky.
Fase 2 (Estabilidade): Cache Semântico, Enxertos de Humor e Relatório de Heatmap.
Fase 3 (Lumi Robusta): Modos Desafio, Trabalho em Duplas e Acessibilidade Avançada.