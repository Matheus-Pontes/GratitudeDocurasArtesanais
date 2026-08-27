import { defineStore } from 'pinia'
import { formatCurrency } from '@/shared/utils/currency'
import { buscarEndereco, distanciaOSRM } from '@/shared/utils/calculatorFrete'

const LOJAS = [
  { nome: 'Loja 1', cep: '08120260' },
  { nome: 'Loja 2', cep: '08270280' },
];

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
      estado: '',
      rua: '',
      numero: '',
      complemento: '',
      observacoes: ''
    }
  }),

  getters: {
    isValido: (state) => {
      const { nome, telefone, entrega, pagamento, cep, numero, rua  } = state.form;
      
      if (!nome.trim() || !telefone.trim() || !pagamento) return false
      if (entrega === 'entrega' && !cep.trim() && !numero.trim() && telefone.length == 15) return false
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

        return `${item.tipo.toUpperCase()} - ${Number(item.quantidade || 0)}x ${item.nome}`
      });

      return {
        nome: this.form.nome.trim(),
        telefone: this.form.telefone.trim(),
        entrega: this.form.entrega === 'entrega' ? 'Entrega' : 'Retirada no local',
        cep: this.form?.cep?.trim() == "" ? "-" : this.form.cep,
        rua: this.form?.rua?.trim() == "" ? "-" : this.form.rua,
        numero: this.form?.numero?.trim() == "" ? "-" : this.form.numero,
        complemento: this.form?.complemento?.trim() == "" ? "-" : this.form.complemento,
        pagamento: this.form.pagamento,
        itens: itensFormatados.join('\n'),
        totalFormatado: formatCurrency(totalPreco || 0),
        observacoes: this.form.observacoes.trim() == "" ? "-" : this.form.observacoes,
      }
    },

    async enviarPedido(itens, totalPreco) {
      const payload = this.montarPayloadPedido(itens, totalPreco);

      const response = await fetch(GOOGLE_SHEETS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Não foi possível registrar seu pedido");
      }

      return payload
    },

    async buscarCep() {
      if (this.form.cep.length > 0 && this.form.rua.length > 0) 
        return;

      const response = await fetch(`https://viacep.com.br/ws/${this.form.cep.trim()}/json/`);
      await response.json().then(data => {
        this.form.rua = data.logradouro;
        this.form.estado = `${data.estado} - ${data.uf}`;
      });
    },

    cleanAddress() {
      this.form.cep = "";
      this.form.estado = "";
      this.form.rua = "";
      this.form.numero = "";
      this.form.complemento = "";
    },

    async calcularFrete() {
      if(this.form.cep.length == 0)
        return;

      try {
        let resultado = 0;
        const enderecoCliente = await buscarEndereco(this.form.cep);
        const coordCliente = { lat: enderecoCliente.lat, lon: enderecoCliente.lon };

        const distancias = [];
        for (const loja of LOJAS) {
          const enderecoLoja = await buscarEndereco(loja.cep);
          const coordLoja = { lat: enderecoLoja.lat, lon: enderecoLoja.lon };
          const distKm = await distanciaOSRM(coordLoja, coordCliente);
          distancias.push({ loja: loja.nome, distKm });
        }

        const maisProxima = distancias.reduce((menor, atual) =>
          atual.distKm < menor.distKm ? atual : menor
        );

        if (maisProxima.distKm <= 15) 
          resultado = maisProxima.distKm * 0.8;
        
        return resultado;
      }
      catch(e) {
        return 0;
      }
    }
  }
})
