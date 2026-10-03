# Checklist: advogado-pt v1.2.1 correções

Tracks: core +tdd +sec. Marca antes de dar a feature por concluída.

- [ ] Requisitos: cada AC é testável, tem ID estável, sem termos vagos (corre `ears`).
- [ ] Design: respeita a constituição do projeto (nenhum princípio violado).
- [ ] Design: pelo menos um diagrama Mermaid; segurança + tratamento de erros cobertos.
- [ ] Rastreabilidade: cada AC mapeia para uma tarefa (corre `trace`).
- [ ] TDD: todos os testes planeados escritos e a vermelho pela razão certa antes do código.
- [ ] TDD: commits de teste entram antes dos commits de implementação.
- [ ] SEC: 5 secções obrigatórias de design preenchidas (sem TODO) — modelo de ameaças revisto.
- [ ] SEC: autenticação + autorização ao nível do objeto impostas, negar por omissão; nenhum segredo no código ou nos logs.
- [ ] SEC: SAST, auditoria de dependências e testes de casos de abuso limpos numa execução local.
- [ ] Doctor: `doctor` reporta readyToAdvance antes de cada gate.
- [ ] Todos os gates de fase aprovados (`approve`).
