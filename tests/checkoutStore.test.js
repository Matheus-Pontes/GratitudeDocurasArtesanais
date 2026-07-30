import test from 'node:test'
import assert from 'node:assert/strict'
import { createPinia, setActivePinia } from 'pinia'
import { useCheckoutStore } from '../src/features/checkout/store/checkoutStore.js'

test('monta payload do pedido para envio na planilha', () => {
  setActivePinia(createPinia())

  const checkout = useCheckoutStore()
  checkout.form.nome = 'Ana Souza'
  checkout.form.telefone = '(11) 91234-5678'
  checkout.form.entrega = 'entrega'
  checkout.form.endereco = 'Rua das Flores, 123'
  checkout.form.pagamento = 'Pix'
  checkout.form.observacoes = 'Sem embalagem para presente'

  const payload = checkout.montarPayloadPedido(
    [
      {
        nome: 'Combo 5 trufas',
        quantidade: 2,
        preco: 40,
        tipo: 'combo',
        composicaoTexto: '2x Tradicional, 1x Premium'
      }
    ],
    80
  )

  assert.equal(payload.cliente.nome, 'Ana Souza')
  assert.equal(payload.itens[0].nome, 'Combo 5 trufas')
  assert.equal(payload.totalPreco, 80)
  assert.equal(payload.metodo, 'google-sheets')
})
