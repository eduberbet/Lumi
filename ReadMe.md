# LUMI - Lanterna Universal de Mediação Inteligente 💡

**Conceito:** A Inteligência Artificial como uma lanterna para o raciocínio.

A **LUMI** é um ecossistema de apoio ao professor desenvolvido para rodar 100% offline. Ela não entrega respostas; ela media o raciocínio socrático utilizando materiais didáticos (PDFs e Post-its) fornecidos pelo docente.

---

## 👐 Projeto Open Source & Comunidade
Este é um projeto **Open Source** (Código Aberto). Acreditamos que a tecnologia educacional deve ser acessível, auditável e construída coletivamente.

* **Contribua:** Sugestões de melhoria na lógica socrática, otimização de performance para hardware antigo e novas interfaces de acessibilidade são muito bem-vindas.
* **Filosofia:** Priorizamos o "Simples Bem Feito". Se uma funcionalidade pode ser resolvida com um `Regex` na borda (Pinky) em vez de onerar a LLM (Cérebro), esse é o caminho que seguimos.
* **Privacidade:** Nenhuma contribuição deve quebrar a regra de "Zero Nuvem". A Lumi nasce e morre na rede local da escola.

---

## 🏗️ Arquitetura Cérebro-Pinky
- **O Cérebro (Backend):** Servidor Python (Ollama/Llama 3 + ChromaDB). Onde mora a inteligência e o controle do professor.
- **O Pinky (Frontend):** Interface leve em JS Vanilla/Web Speech API. Onde o aluno interage com a Lumi.

---

## 🗺️ Roadmap de Desenvolvimento/Implementação 

| Fase | Nome | Status | Descrição |
| :--- | :--- | :--- | :--- |
| Fase 0 | Cérebro Simulado | ✅ Concluído | Criação do servidor de testes (Mock) e comandos de depuração (Latência, Kill Switch, Drible). |
| Fase 1 | Alpha (Conexão) | ✅ Concluído | Estabilização do WebSocket e JSON base para nomes simples/duplas. |
| **Fase 2** | **Alpha UX (Borda)** | 🔵 **ATUAL** | Interface do Círculo Radiante, Filtros de Papo Furado e Gestão de Silêncio. |
| Fase 3 | Lumi Pocket | ⚪ Planejado | Versão estática para GitHub Sites (Vitrine de demonstração). |
| Fase 4 | Beta (O Despertar) | ⚪ Planejado | Integração com LLM real e Validação de Sucesso com argumento. |
| Fase 5 | Beta RAG (Grupo) | ⚪ Planejado | Modo Dupla Ativo e consulta profunda a PDFs e Post-its. |
| Fase 6 | Lumi 1.0 (Mestre) | ⚪ Planejado | Caderno de Erros funcional e Gestão de Fila de Hardware. |

---

## 🛠️ Guia de Implementação (Tutorial)

### 1. Requisitos do Sistema
* **Python 3.10 ou superior.**
* Dependências: `fastapi`, `uvicorn`, `websockets`.

### 2. Preparando o Cérebro (Backend)
Na pasta `/cerebro`, instale as bibliotecas necessárias e inicie o servidor:

```bash
pip install fastapi uvicorn websockets
```
#### Execução (Caso o comando uvicorn não seja reconhecido diretamente, utilize o prefixo python -m)
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

O servidor estará ativo em localhost:8000.

### 3. Sintonizando o Pinky (Frontend)
Navegue até a pasta /pinky.

Abra o arquivo index.html em seu navegador.

O status deve exibir "Sintonizada" (conexão via WebSocket estabelecida).

## 🧪 Protocolos de Teste (Fase 1)

Utilize os comandos abaixo no chat para validar a resiliência e a lógica do sistema:

* **`teste_latencia`**: Simula um atraso de 15 segundos no Cérebro. 
    * **Objetivo:** Validar se o Pinky mantém a animação de "captando" e se o Alfaiate visual funciona.
* **`teste_drible`**: Simula uma tentativa de desviar do assunto pedagógico. 
    * **Objetivo:** Validar o filtro de mensagens e o alerta de foco.
* **`ajuda com a aula`**: Solicita informações sobre o conteúdo acadêmico. 
    * **Objetivo:** Validar a leitura do arquivo físico em `/cerebro/data/aula.txt`.
* **Teste de Resiliência (Queda)**: Encerre o processo do Python no terminal (Ctrl+C).
    * **Objetivo:** O Pinky deve mudar para o estado cinza (`lumi-off`) e tentar reconectar automaticamente a cada 3 segundos.

---

## 📚 Índice da Documentação
1. **[DOC-01] Visão e Escopo:** Identidade e objetivos pedagógicos.
2. **[DOC-02] Arquitetura Técnica:** Diagrama de rede, portas e fluxo de dados.
3. **[DOC-03] UX e Diálogo:** Estados de luz, resiliência e **gestão de silêncio**.
4. **[DOC-04] Segurança:** Protocolos de acesso e Kill Switch.
5. **[DOC-05] Dicionário de Prompts:** Regras socráticas e **tratativa de papo furado**.
6. **[DOC-06] Guia de Post-its:** Como o professor sopra dicas no ouvido da IA.
7. **[DOC-07] Caderno de Erros:** Dashboard de calor e **logs de inatividade**.
8. **[DOC-08] Expansão:** Inteligência de borda e **interação em dupla**.
9. **[DOC-09] Roadmap Detalhado:** O plano de voo completo do projeto.

---

## 📬 Contato e Suporte
Dúvidas, sugestões de melhoria ou interesse em apoiar o projeto (doações e parcerias) Entre em contato: **edu.berbet@gmail.com** ou **edu.berbet@hotmail.com**

*LUMI: Menos respostas prontas, mais mentes brilhantes.*
