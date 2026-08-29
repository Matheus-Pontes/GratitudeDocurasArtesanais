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

# bugs para corrigir 
Favicon quebrado — index.html aponta para /favicon.png, mas só existe /favicon.svg na pasta public.
Bug de validação no checkout — checkoutStore.isValido tem uma lógica invertida: só bloqueia o envio se CEP e número estiverem vazios ao mesmo tempo E o telefone tiver exatamente 15 caracteres. Na prática, dá pra finalizar um pedido com entrega sem CEP/número preenchidos.
checkout.resetar() quebra o formulário — o objeto resetado tem um formato diferente do estado inicial (falta cep, estado, rua, numero, complemento, e sobra um campo endereco que não existe em nenhum outro lugar). Depois de resetar, o form fica inconsistente.
CEP com campo errado — buscarCep() usa data.estado, mas a resposta do ViaCEP não tem esse campo (tem localidade e uf). Isso está gerando "undefined" no campo Estado.
Função morta e perigosa — ComboCard.vue tem uma função maxPorEntrada que referencia variáveis (composicao, limiteComposicao) que não existem nesse arquivo. Não é chamada em nenhum lugar hoje, mas quebraria a aplicação se alguém a usasse.
console.log esquecidos — em comboStore.js e masks.js.
Import de imagem incorreto — AppHero.vue importa o logo de dentro de public/ via caminho relativo, quando deveria referenciar como URL absoluta (/images/logo.png), como o resto do projeto faz.
Bug de layout no Hero — .app-hero usa display:flex sem flex-direction: column e sem flex-wrap no desktop, então a logo (até 900px) e o texto (até 640px) tentam ficar lado a lado e podem estourar a largura da tela em telas médias.
Import não usado (InputNumber em TruffleCard.vue) — sugere que a intenção era permitir escolher quantidade antes de adicionar ao carrinho, mas isso nunca foi implementado no template.
