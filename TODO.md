# TODO - Ajuste Visual “Claude-like” (Dr. Jean Victor)

## Planejamento aprovado
- Melhorar visual para estilo “Claude code”: mais limpo, legível, contraste elegante.
- Criar suporte a temas (dark padrão + light opcional), com toggle e persistência.

## Passos
1. [ ] Atualizar `styles.css`: criar variáveis por tema (dark/light), ajustar paleta para estética mais clean e profissional.
2. [ ] Atualizar `index.html`: adicionar toggle de tema no header (botão no layout existente).
3. [ ] Atualizar `script.js`: aplicar tema via `localStorage` e setar `data-theme` no `<html>`.
4. [ ] Ajustar acessibilidade e foco (estilos `:focus-visible` coerentes).
5. [ ] Rodar validação básica: sem erros no console + navegação/menus funcionando.
6. [ ] Testar responsividade e legibilidade (mobile, cards, formulário).
7. [ ] Atualizar/confirmar PWA não quebra (service worker continua ok).

