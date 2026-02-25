# 🔦 Projeto LUMI
### **L**anterna **U**niversal de **M**ediação **I**nteligente

O **LUMI** é um ecossistema de Inteligência Artificial para suporte à aprendizagem, operando **100% offline** e focado no método socrático. Projetado para o ambiente de sala de aula, ele atua como uma "lanterna digital": ilumina o caminho do raciocínio sem entregar a resposta pronta ao estudante.

---

## 🎯 O Conceito
Diferente de assistentes genéricos que fornecem soluções diretas, o Lumi utiliza o material didático fornecido pelo professor (via RAG - Retrieval-Augmented Generation) para guiar o aluno através de dicas, analogias e perguntas de retorno.

> *"A Lumi não te carrega no colo; ela ilumina onde você deve pisar."*

---

## 🏗️ Arquitetura Assimétrica: Cérebro & Pinky
O projeto utiliza uma divisão estratégica de carga e segurança para garantir performance e simplicidade:

*   **🧠 O Cérebro (Server-Side):** Roda em hardware robusto local (Host). Concentra o processamento pesado de LLM (Large Language Model), Banco de Dados Vetorial e Cache Semântico. É a central de comando restrita ao professor.
*   **🐭 O Pinky (Client-Side):** Interface leve que roda no navegador de qualquer tablet ou smartphone via Wi-Fi local. Gerencia a interação de voz (STT/TTS), acessibilidade e a "experiência de espera" lúdica com enxertos de texto.

---

## ✨ Funcionalidades Principais
- **Mediação Socrática:** Escalonamento de dicas em 3 níveis (Conceitual, Analógico e Localização).
- **Zero Cloud (Privacidade Total):** 100% offline por design. Nenhum dado de áudio ou texto sai da rede local da escola.
- **Resiliência Lúdica:** O Pinky gerencia latências de hardware com humor ("tapa-buracos" de fala) e coerência narrativa.
- **Soberania Docente:** Painel administrativo isolado para gestão de PDFs, "Post-its" pedagógicos e *Kill Switch* de emergência.
- **Cache Semântico:** Identifica dúvidas recorrentes para economizar processamento e gerar relatórios de "calor" pedagógico.

---

## 🛠️ Stack Tecnológica (Open Core)
- **Linguagem:** Python 3.10+
- **LLM Engine:** [Ollama](https://ollama.com) (Llama 3 / Phi-3)
- **Interface:** Streamlit / WebSockets
- **Vetor DB:** ChromaDB
- **Voz:** Web Speech API (Nativa do dispositivo do aluno)

---

## 📂 Estrutura de Documentação
Para entender as camadas técnicas e pedagógicas do projeto, consulte a pasta `/docs`:
- **[DOC-01]** Visão e Escopo do Projeto
- **[DOC-02]** Arquitetura Técnica Detalhada (Cérebro-Pinky)
- **[DOC-03]** UX, Diálogo e Protocolos de Resiliência
- **[DOC-04]** Segurança, Portas de Rede e Protocolos de Acesso
- *(Nota: O [DOC-05] - Dicionário de Prompts e Lógica de Negócio é privado e não consta neste repositório).*

---

## ⚠️ Licença e Modelo de Negócio
Este é um projeto de **Open Core**. A infraestrutura de comunicação, motores de áudio básicos e interface responsiva são abertos para a comunidade. A inteligência socrática avançada, os enxertos dinâmicos e os módulos de relatório pedagógico são partes integrantes do **Lumi Core/Pro** (Segredo de Negócio).

---
*Desenvolvido como um projeto de inovação em tecnologia educacional.*