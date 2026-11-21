# CAA — Prancha de Comunicação (vitrine aberta)

Aplicativo web de **Comunicação Alternativa e Aumentativa (CAA)**: uma prancha
de cartões que **fala** ao ser tocada, para apoiar a comunicação de crianças
autistas não verbais e outras pessoas com fala ausente ou limitada.

**🔗 Demo ao vivo:** https://viniciuscampeao.github.io/caa-vitrine/

> Esta é uma **versão de referência, aberta e 100% sem dados reais**. As pranchas
> que uso em produção são personalizadas para cada criança (fotos, vozes e
> vocabulário próprios) e, por envolverem menores, **não são públicas**. Aqui o
> vocabulário é genérico e os pictogramas são emojis — para demonstrar a
> engenharia e a acessibilidade sem expor nenhuma família.

---

## O que é CAA?

Comunicação Alternativa e Aumentativa é um conjunto de recursos que dá voz a
quem não se comunica pela fala. Uma prancha digital organiza o vocabulário em
**categorias** (comer, beber, brincar, sentir, lugares…); ao tocar num cartão,
o dispositivo **pronuncia a palavra** e, opcionalmente, ajuda a **montar frases**.

## Funcionalidades

- 🔊 **Fala ao tocar** — síntese de voz nativa do navegador (Web Speech API),
  em português, **sem enviar áudio para nenhum servidor**.
- 🧩 **Categorias navegáveis** — cartões com filhos abrem sub-pranchas, com
  trilha de navegação e botões **Início / Voltar**.
- 📝 **Barra de sentença** — toque vários cartões para montar uma frase e fale
  tudo de uma vez.
- 📄 **Paginação 4×3** — grade no estilo de pranchas profissionais (TD Snap),
  com páginas quando há muitos cartões.
- ⚙️ **Ajustes** — velocidade da voz, falar-ao-tocar e **toque longo** para
  evitar ativações acidentais.
- ♿ **Acessível de verdade** — veja abaixo.

## Acessibilidade

Decisões tomadas pensando no público-alvo e em WCAG:

- **Teclado completo**: todo cartão é um `<button>` real — ativa com Enter/Espaço
  e tem **foco visível** (contorno amarelo de alto contraste).
- **`aria-label`** em cada cartão e **`aria-live`** na frase e na navegação, para
  leitores de tela.
- **Alvos de toque grandes** e borda colorida por categoria (reforço de cor +
  texto, não só cor).
- **Toque longo opcional**: motor para evitar que um toque de passagem dispare a
  fala — comum em usuários com coordenação motora atípica.
- **`prefers-reduced-motion`** respeitado: sem animações para quem pede.

## Tecnologia

- **React 18 + TypeScript + Vite**
- **Web Speech API** para TTS (zero dependência de rede/áudio externo)
- **CSS puro** (sem framework) — bundle enxuto
- Deploy contínuo em **GitHub Pages** via GitHub Actions

## Rodar localmente

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # gera dist/
```

## Privacidade e dados

- **Nenhum dado pessoal.** O vocabulário é genérico e os "pictogramas" são
  emojis (sem licença de imagem, sem fotos de pessoas).
- **Nada sai do dispositivo.** A fala usa o sintetizador local do navegador;
  os ajustes ficam em `localStorage`. Não há backend, login ou analytics.
- A categoria **Pessoas** usa papéis genéricos (Mamãe, Papai, Professora…),
  **nunca nomes reais**.

## Contexto

Mantenho versões personalizadas desta prancha em uso real por famílias. Este
repositório é a base aberta que mostra a arquitetura e as escolhas de
acessibilidade — a parte que pode ser compartilhada publicamente.

## Licença

[MIT](LICENSE) — o código é livre. Emojis seguem as licenças das respectivas
plataformas que os renderizam.
