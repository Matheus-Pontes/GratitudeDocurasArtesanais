import { defineStore } from 'pinia'
import { formatCurrency } from '@/shared/utils/currency'

// TODO: troque pelo número real da loja no formato DDI+DDD+número (somente dígitos)
const WHATSAPP_NUMERO = '5511999999999'

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    isOpen: false,
    form: {
      nome: '',
      telefone: '',
      entrega: 'retirada', // 'retirada' | 'entrega'
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

    /**
     * Monta a mensagem do pedido e devolve o link do WhatsApp.
     * Não há backend nesta demo — o "envio do pedido" abre o WhatsApp
     * da loja com o pedido já formatado, pronto para confirmação manual.
     */
    montarLinkWhatsapp(itens, totalPreco) {
      const linhas = []
      linhas.push('*Novo pedido — Gratitude Doçuras Artesanais*')
      linhas.push('')
      itens.forEach((item) => {
        linhas.push(`• ${item.quantidade}x ${item.nome} — ${formatCurrency(item.preco * item.quantidade)}`)
      })
      linhas.push('')
      linhas.push(`*Total: ${formatCurrency(totalPreco)}*`)
      linhas.push('')
      linhas.push(`*Cliente:* ${this.form.nome}`)
      linhas.push(`*Telefone:* ${this.form.telefone}`)
      linhas.push(`*Entrega:* ${this.form.entrega === 'entrega' ? 'Entrega' : 'Retirada no local'}`)
      if (this.form.entrega === 'entrega') {
        linhas.push(`*Endereço:* ${this.form.endereco}`)
      }
      linhas.push(`*Pagamento:* ${this.form.pagamento}`)
      if (this.form.observacoes.trim()) {
        linhas.push(`*Observações:* ${this.form.observacoes}`)
      }

      const texto = encodeURIComponent(linhas.join('\n'))
      return `https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`
    }
  }
})
