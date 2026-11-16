# Porsche Sales & Corporate Intelligence

Dashboard interativa construída em React + TypeScript + Tailwind CSS para responder perguntas de negócio sobre vendas da Porsche a partir de uma base sanitizada de 100 registros, integrada com a visão corporativa da Porsche AG.

## Perguntas de Negócio Respondidas

1. **Mix de Modelos (Volume vs. Receita):** Quais modelos lideram em unidades vendidas vs. faturamento total e ticket médio (*911, Cayenne, Macan, Panamera, Taycan, 718 Boxster/Cayman*).
2. **Concentração Geográfica e Evolução Anual:** Como a receita e o volume se distribuem por **Estado (UF)** e **Cidade** e evoluem entre **2022 e 2026**.
3. **Modalidade de Pagamento:** Qual método de pagamento predomina (*À Vista / PIX, Financiamento, Leasing, Consórcio*) e como varia o ticket médio em cada faixa.

## Funcionalidades

- Filtros cruzados por modelo, estado, cidade, ano, método de pagamento e busca rápida.
- Indicadores de topo dinâmicos (total de vendas, receita acumulada, ticket médio e modelo líder) com conversão entre **BRL**, **EUR** e **USD**.
- Tabela completa da base sanitizada com ordenação, busca e exportação em `.csv`.
- Visão corporativa Porsche AG (DRE IFRS 2024–2025, entregas 9M 2026, presença global e estrutura P911).

## Como Publicar no GitHub Pages

O projeto já inclui caminhos relativos (`base: './'` no Vite), workflow de publicação automática e pasta pronta `docs/`:

- **Opção A — Via Branch (`main` / `docs`):**
  1. No repositório do GitHub, acesse **Settings → Pages**.
  2. Em **Build and deployment → Source**, selecione **Deploy from a branch**.
  3. Escolha a branch `main` e a pasta **`/docs`**, depois clique em **Save**.
- **Opção B — Via GitHub Actions:**
  1. Em **Settings → Pages → Source**, selecione **GitHub Actions**.
  2. A cada `git push` na branch `main`, o workflow `.github/workflows/deploy.yml` executa `npm run build` e publica a pasta `dist/`.

## Execução Local

```bash
npm install
npm run dev
```

Para gerar o build de produção e atualizar a pasta `docs/` do GitHub Pages:

```bash
npm run build
npx vite build --outDir docs
```
