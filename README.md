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

## Antes de publicar

1. **Troque o número de WhatsApp** em `src/features/checkout/store/checkoutStore.js` (constante `WHATSAPP_NUMERO`), formato DDI+DDD+número, só dígitos. Ex: `5511987654321`.
2. Os preços e sabores estão em:
   - `src/features/truffles/data/truffles.json`
   - `src/features/combos/data/combos.json`
   
   Edite esses arquivos para atualizar cardápio/preços — eles simulam uma API e podem futuramente ser substituídos por um backend real sem alterar os componentes.
3. As imagens das trufas ficam em `public/images/` (recortadas do cardápio original). Substitua por fotos em melhor resolução quando tiver.

## Fluxo do pedido

O carrinho não possui backend: ao finalizar, o site monta uma mensagem formatada com os itens, total e dados do cliente, e abre o WhatsApp da loja (`wa.me`) com o texto pronto para o cliente enviar.
