import { defineStore } from 'pinia'

/**
 * Item de carrinho:
 * { id, tipo: 'trufa' | 'combo', nome, imagem, preco, quantidade, peso? }
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
          quantidade
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

    remover(id) {
      this.items = this.items.filter((i) => i.id !== id)
    },

    limpar() {
      this.items = []
    }
  }
})
