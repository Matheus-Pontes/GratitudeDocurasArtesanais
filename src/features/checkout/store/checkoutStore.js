import { defineStore } from 'pinia'
import { formatCurrency } from '@/shared/utils/currency'

const GOOGLE_SHEETS_ENDPOINT =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || import.meta.env.VITE_GOOGLE_SHEETS_URL || ''
    : ''

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    isOpen: false,
    form: {
      nome: '',
      telefone: '',
      entrega: 'retirada',
      endereco: '',
      pagamento: null,
      observacoes: ''
    }
  }),

  getters: {
    isValido: (state) => {
      const { nome, telefone, entrega, endereco, pagamento } = state.form
      if (!nome.trim() || !telefone.trim() || !pagamento) return false
      if (entrega === 'entrega' && !endereco.trim()) return false
      return true
    }
  },

  actions: {
    abrir() {
      this.isOpen = true
    },
    fechar() {
      this.isOpen = false
    },
    resetar() {
      this.form = {
        nome: '',
        telefone: '',
        entrega: 'retirada',
        endereco: '',
        pagamento: null,
        observacoes: ''
      }
    },

    montarPayloadPedido(itens, totalPreco) {
      const itensFormatados = (itens || []).map((item) => ({
        nome: item.nome,
        tipo: item.tipo || 'produto',
        quantidade: Number(item.quantidade || 0),
        precoUnitario: Number(item.preco || 0),
        precoTotal: Number(item.preco || 0) * Number(item.quantidade || 0),
        composicaoTexto: item.composicaoTexto || '',
        composicao: Array.isArray(item.composicao) ? item.composicao : []
      }))

      return {
        metodo: 'google-sheets',
        status: 'pendente',
        criadoEm: new Date().toISOString(),
        cliente: {
          nome: this.form.nome.trim(),
          telefone: this.form.telefone.trim(),
          entrega: this.form.entrega === 'entrega' ? 'Entrega' : 'Retirada no local',
          endereco: this.form.endereco.trim(),
          pagamento: this.form.pagamento,
          observacoes: this.form.observacoes.trim()
        },
        itens: itensFormatados,
        totalItens: itensFormatados.reduce((sum, item) => sum + item.quantidade, 0),
        totalPreco: Number(totalPreco || 0),
        totalFormatado: formatCurrency(totalPreco || 0)
      }
    },

    async enviarPedido(itens, totalPreco) {
      const endpoint = GOOGLE_SHEETS_ENDPOINT
      if (!endpoint) {
        throw new Error('Configure VITE_GOOGLE_APPS_SCRIPT_URL para registrar o pedido na planilha.')
      }

      const payload = this.montarPayloadPedido(itens, totalPreco)
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`Não foi possível registrar o pedido na planilha. Status ${response.status}.`)
      }

      return payload
    }
  }
})
