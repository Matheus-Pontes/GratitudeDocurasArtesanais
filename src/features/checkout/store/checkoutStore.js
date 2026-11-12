import { defineStore } from 'pinia'
import { formatCurrency } from '@/shared/utils/currency'
import { buscarEndereco, distanciaOSRM } from '@/shared/utils/calculatorFrete'

const LOJAS = [
  { nome: 'Loja 1', cep: '08120260' },
  { nome: 'Loja 2', cep: '08270280' },
]

const GOOGLE_SHEETS_ENDPOINT =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || import.meta.env.VITE_GOOGLE_SHEETS_URL || ''
    : ''

const WHATSAPP_NUMERO =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_WHATSAPP_NUMBER || '5511999999999'
    : '5511999999999'

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    isOpen: false,
    form: {
      nome: '',
      telefone: '',
      entrega: 'retirada',
      pagamento: null,
      troco: '',
      cep: '',
      estado: '',
      cidade: '',
      bairro: '',
      rua: '',
      numero: '',
      complemento: '',
      observacoes: ''
    }
  }),

  getters: {
    isValido: (state) => {
      const { nome, telefone, entrega, pagamento, cep, numero, rua } = state.form
      if (!nome?.trim()) return false
      // Telefone com ddd mínimo 14 caracteres: (00) 0000-0000 ou 15: (00) 00000-0000
      if (!telefone?.trim() || telefone.trim().length < 14) return false
      if (!pagamento) return false

      if (entrega === 'entrega') {
        if (!cep?.trim() || cep.trim().length < 9) return false
        if (!rua?.trim()) return false
        if (!numero?.trim()) return false
      }

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
        pagamento: null,
        troco: '',
        cep: '',
        estado: '',
        cidade: '',
        bairro: '',
        rua: '',
        numero: '',
        complemento: '',
        observacoes: ''
      }
    },

    montarPayloadPedido(itens, totalPreco, frete = 0) {
      const itensFormatados = (itens || []).map((item) => {
        if (item.tipo === 'combo') {
          return `📦 ${item.nome} (${item.quantidade}x) - Sabores: ${item.composicaoTexto || 'Sortido'}`
        }
        return `🍬 ${Number(item.quantidade || 0)}x ${item.nome} (${formatCurrency(item.preco * item.quantidade)})`
      })

      const totalFinal = (totalPreco || 0) + (frete || 0)

      return {
        nome: this.form.nome.trim(),
        telefone: this.form.telefone.trim(),
        entrega: this.form.entrega === 'entrega' ? 'Entrega em domicílio' : 'Retirada no local',
        cep: this.form.cep?.trim() || '-',
        rua: this.form.rua?.trim() || '-',
        numero: this.form.numero?.trim() || '-',
        bairro: this.form.bairro?.trim() || '-',
        cidade: this.form.cidade?.trim() || '-',
        estado: this.form.estado?.trim() || '-',
        complemento: this.form.complemento?.trim() || '-',
        pagamento: this.form.pagamento,
        troco: this.form.pagamento === 'Dinheiro' && this.form.troco?.trim() ? this.form.troco : '-',
        itens: itensFormatados.join('\n'),
        subtotalFormatado: formatCurrency(totalPreco || 0),
        freteFormatado: frete > 0 ? formatCurrency(frete) : 'Grátis / Retirada',
        totalFormatado: formatCurrency(totalFinal),
        observacoes: this.form.observacoes?.trim() || '-',
        dataHora: new Date().toLocaleString('pt-BR')
      }
    },

    gerarMensagemWhatsApp(itens, totalPreco, frete = 0) {
      const payload = this.montarPayloadPedido(itens, totalPreco, frete)
      let msg = `*🍬 NOVO PEDIDO - GRATITUDE DOÇURAS ARTESANAIS 🍬*\n\n`
      msg += `*Cliente:* ${payload.nome}\n`
      msg += `*Telefone:* ${payload.telefone}\n`
      msg += `*Tipo de Entrega:* ${payload.entrega}\n`

      if (this.form.entrega === 'entrega') {
        msg += `*Endereço:* ${payload.rua}, Nº ${payload.numero}`
        if (payload.complemento !== '-') msg += ` (${payload.complemento})`
        if (payload.bairro !== '-') msg += ` - ${payload.bairro}`
        msg += `\n*CEP:* ${payload.cep}\n`
      }

      msg += `*Pagamento:* ${payload.pagamento}\n`
      if (payload.troco !== '-') msg += `*Troco para:* ${payload.troco}\n`

      msg += `\n*--- ITENS DO PEDIDO ---*\n`
      msg += `${payload.itens}\n\n`

      msg += `*Subtotal:* ${payload.subtotalFormatado}\n`
      if (frete > 0) msg += `*Frete:* ${payload.freteFormatado}\n`
      msg += `*TOTAL:* ${payload.totalFormatado}\n`

      if (payload.observacoes !== '-') {
        msg += `\n*Observações:* ${payload.observacoes}\n`
      }

      return encodeURIComponent(msg)
    },

    async enviarPedido(itens, totalPreco, frete = 0) {
      const payload = this.montarPayloadPedido(itens, totalPreco, frete)

      // Se houver endpoint configurado do Google Sheets/Backend
      if (GOOGLE_SHEETS_ENDPOINT) {
        try {
          const response = await fetch(GOOGLE_SHEETS_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(payload)
          })
          if (!response.ok) {
            console.warn('Erro ao enviar para Google Sheets, abrindo WhatsApp')
          }
        } catch (e) {
          console.warn('Falha no endpoint externo:', e)
        }
      }

      // Abre WhatsApp com o pedido formatado para confirmação imediata
      const msgEncoded = this.gerarMensagemWhatsApp(itens, totalPreco, frete)
      window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${msgEncoded}`, '_blank')

      return payload
    },

    async buscarCep() {
      const cepLimpo = (this.form.cep || '').replace(/\D/g, '')
      if (cepLimpo.length !== 8) return

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        const data = await response.json()
        if (data && !data.erro) {
          this.form.rua = data.logradouro || ''
          this.form.bairro = data.bairro || ''
          this.form.cidade = data.localidade || ''
          this.form.estado = data.uf ? `${data.localidade || ''} - ${data.uf}` : ''
        }
      } catch (err) {
        console.warn('Erro ao consultar ViaCEP:', err)
      }
    },

    cleanAddress() {
      this.form.cep = ''
      this.form.estado = ''
      this.form.cidade = ''
      this.form.bairro = ''
      this.form.rua = ''
      this.form.numero = ''
      this.form.complemento = ''
    },

    async calcularFrete() {
      if (!this.form.cep || this.form.cep.length < 9) return { freteCalculado: 0, distanciaCliente: 0 }

      try {
        let resultado = 0
        const enderecoCliente = await buscarEndereco(this.form.cep)
        if (!enderecoCliente) return { freteCalculado: 0, distanciaCliente: 0 }

        const coordCliente = { lat: enderecoCliente.lat, lon: enderecoCliente.lon }

        const distancias = []
        for (const loja of LOJAS) {
          const enderecoLoja = await buscarEndereco(loja.cep)
          if (enderecoLoja) {
            const coordLoja = { lat: enderecoLoja.lat, lon: enderecoLoja.lon }
            const distKm = await distanciaOSRM(coordLoja, coordCliente)
            distancias.push({ loja: loja.nome, distKm })
          }
        }

        if (!distancias.length) return { freteCalculado: 0, distanciaCliente: 0 }

        const maisProxima = distancias.reduce((menor, atual) =>
          atual.distKm < menor.distKm ? atual : menor
        )

        if (maisProxima.distKm <= 15) {
          resultado = Math.max(5, maisProxima.distKm * 0.8)
        }

        return { freteCalculado: resultado, distanciaCliente: maisProxima.distKm }
      } catch (e) {
        return { freteCalculado: 0, distanciaCliente: 0 }
      }
    }
  }
})
