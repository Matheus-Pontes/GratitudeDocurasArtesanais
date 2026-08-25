# Gratitude Doçuras Artesanais — Loja Online

Site de pedidos de trufas artesanais, feito em **Vue 3 + Vite**, com **PrimeVue** (tema customizado com as cores da marca) e **Pinia** para controle de estado. Estrutura organizada por **feature**.

## Rodando o projeto

```bash
npm install
npm run dev
```

Acesse http://localhost:5173

## Build de produção

```bash
npm run build
npm run preview
```

## Estrutura

```
src/
  features/
    truffles/   → catálogo de trufas (API simulada via JSON, store Pinia, TruffleCard/TruffleList)
    combos/     → combos especiais (API simulada via JSON, store Pinia, ComboCard/ComboList)
    cart/       → carrinho de compras (store Pinia, Drawer lateral)
    checkout/   → formulário de finalização, gera pedido e abre o WhatsApp
  shared/
    components/ → Header, Hero, Footer
    layouts/    → MainLayout
    styles/     → tokens de cor/tipografia + preset do PrimeVue
```

## Features
- [x] Implementar mascara de telefone
- [x] Implementar mascara de cep
- [ ] ajustar mensagem do frete caso for maior que 15 km 
- [ ] ver questão do modal de finalizar pedidos para remover dados dos campos
