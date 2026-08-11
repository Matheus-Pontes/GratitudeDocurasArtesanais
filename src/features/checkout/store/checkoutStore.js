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
      pagamento: null,
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      observacoes: ''
    }
  }),

  getters: {
    isValido: (state) => {
      const { nome, telefone, entrega, pagamento, cep, numero, rua  } = state.form
    
      // if (!nome.trim() || !telefone.trim() || !pagamento) return false
      // if (entrega === 'entrega' && !cep.trim(), !numero.trim(), !rua.trim()) return false
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
      const itensFormatados = (itens || []).map((item) => {
        
        if (item.tipo == 'combo')
          return `${item.tipo.toUpperCase()} - ${item.composicaoTexto || ''}`

        return `${item.tipo.toUpperCase()} - ${item.nome} ${Number(item.quantidade || 0)}x ${item.composicaoTexto || ''}`
      })

      console.log(itensFormatados);
      return;

      return {
        nome: this.form.nome.trim(),
        telefone: this.form.telefone.trim(),
        entrega: this.form.entrega === 'entrega' ? 'Entrega' : 'Retirada no local',
        cep: this.form?.cep?.trim() == "" ? "-" : this.form.cep,
        rua: this.form?.rua?.trim() == "" ? "-" : this.form.rua,
        numero: this.form?.numero?.trim() == "" ? "-" : this.form.numero,
        complemento: this.form?.complemento?.trim() == "" ? "-" : this.form.complemento,
        pagamento: this.form.pagamento,
        observacoes: this.form.observacoes.trim(),
        itens: itensFormatados.join('\n'),
        totalFormatado: formatCurrency(totalPreco || 0)
      }
    },

    async enviarPedido(itens, totalPreco) {
      const endpoint = GOOGLE_SHEETS_ENDPOINT
      if (!endpoint) {
        throw new Error('Configure GOOGLE_SHEETS_ENDPOINT para registrar o pedido na planilha.')
      }

      const payload = this.montarPayloadPedido(itens, totalPreco)

      return;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
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
