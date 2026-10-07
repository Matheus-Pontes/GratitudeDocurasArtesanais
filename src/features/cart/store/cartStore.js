import { defineStore } from 'pinia'

/**
 * Item de carrinho:
 * { id, tipo: 'trufa' | 'combo', nome, imagem, preco, quantidade, peso?, composicao?, composicaoTexto? }
 */
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    isOpen: false
  }),

  getters: {
    totalItens: (state) => state.items.reduce((sum, i) => sum + i.quantidade, 0),
    totalPreco: (state) =>
      state.items.reduce((sum, i) => sum + i.preco * i.quantidade, 0),
    estaVazio: (state) => state.items.length === 0
  },

  actions: {
    abrir() {
      this.isOpen = true
    },
    fechar() {
      this.isOpen = false
    },

    adicionar(produto, quantidade = 1) {
      const existente = this.items.find((i) => i.id === produto.id)
      if (existente) {
        existente.quantidade += quantidade
      } else {
        this.items.push({
          id: produto.id,
          tipo: produto.tipo,
          nome: produto.nome,
          imagem: produto.imagem,
          preco: produto.preco,
          peso: produto.peso,
          quantidade,
          quantidadeTotal: produto.quantidadeTotal || produto.quantidade || 0,
          composicao: produto.composicao || [],
          composicaoTexto: produto.composicaoTexto || ''
        })
      }
    },

    atualizarQuantidade(id, quantidade) {
      const item = this.items.find((i) => i.id === id)
      if (!item) return
      if (quantidade <= 0) {
        this.remover(id)
        return
      }
      item.quantidade = quantidade
    },

    atualizarComposicao(id, composicao) {
      const item = this.items.find((i) => i.id === id)
      if (!item || item.tipo !== 'combo') return

      const limite = Number(item.quantidadeTotal || item.quantidade || 0)
      const entradas = (Array.isArray(composicao) ? composicao : [])
        .map((entry) => ({
          ...entry,
          quantidade: Math.max(0, Number(entry.quantidade || 0))
        }))

      const totalAtual = entradas.reduce((sum, entry) => sum + Number(entry.quantidade || 0), 0)
      if (totalAtual > limite) {
        let restante = totalAtual - limite
        for (let index = entradas.length - 1; index >= 0 && restante > 0; index -= 1) {
          const reduzir = Math.min(entradas[index].quantidade, restante)
          entradas[index].quantidade -= reduzir
          restante -= reduzir
        }
      }

      const composicaoTexto = entradas
        .filter((entry) => Number(entry.quantidade || 0) > 0)
        .map((entry) => `${entry.quantidade}x ${entry.nome}`)
        .join(', ')

      item.composicao = entradas
      item.composicaoTexto = composicaoTexto
    },

    remover(id) {
      this.items = this.items.filter((i) => i.id !== id)
    },

    limpar() {
      this.items = []
    },
    quantidadeDeTrufasComboEstaCerta() {
      let podeAbrirCheckout = true;

      this.items.forEach(i => {
       if (i.tipo == "combo") {
         let somaQuantidadeTrufasCombo = i.composicao.reduce((sum, i) => sum + i.quantidade, 0);
         if (somaQuantidadeTrufasCombo < i.quantidadeTotal)
           podeAbrirCheckout = false;
       }
      });

      return podeAbrirCheckout;
    }
  }
})
