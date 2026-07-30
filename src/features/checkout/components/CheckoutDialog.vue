<script setup>
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import RadioButton from 'primevue/radiobutton'
import Select from 'primevue/select'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { useCartStore } from '@/features/cart/store/cartStore'
import { useCheckoutStore } from '../store/checkoutStore'
import { formatCurrency } from '@/shared/utils/currency'

const cart = useCartStore()
const checkout = useCheckoutStore()
const toast = useToast()

const formasPagamento = ['Pix', 'Dinheiro', 'Cartão de crédito', 'Cartão de débito']

const totalFormatado = computed(() => formatCurrency(cart.totalPreco))

async function enviarPedido() {
  if (!checkout.isValido || cart.estaVazio) return

  try {
    await checkout.enviarPedido(cart.items, cart.totalPreco)

    toast.add({
      severity: 'success',
      summary: 'Pedido registrado!',
      detail: 'Seu pedido foi enviado e entraremos em contato em breve.',
      life: 3500
    })

    cart.limpar()
    checkout.resetar()
    checkout.fechar()
    cart.fechar()
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : 'Tente novamente em instantes.'

    toast.add({
      severity: 'error',
      summary: 'Não foi possível registrar o pedido',
      detail: mensagem,
      life: 4000
    })
  }
}
</script>

<template>
  <Dialog
    :visible="checkout.isOpen"
    @update:visible="(v) => (checkout.isOpen = v)"
    modal
    header="Finalizar pedido"
    :style="{ width: '480px' }"
    :breakpoints="{ '600px': '94vw' }"
  >
    <form class="checkout-form" @submit.prevent="enviarPedido">
      <div class="checkout-form__field">
        <label for="nome">Nome completo</label>
        <InputText id="nome" v-model="checkout.form.nome" placeholder="Como podemos te chamar?" />
      </div>

      <div class="checkout-form__field">
        <label for="telefone">Telefone / WhatsApp</label>
        <InputText id="telefone" v-model="checkout.form.telefone" placeholder="(11) 91234-5678" />
      </div>

      <div class="checkout-form__field">
        <span class="checkout-form__label">Como prefere receber?</span>
        <div class="checkout-form__radios">
          <label class="checkout-form__radio">
            <RadioButton v-model="checkout.form.entrega" value="retirada" name="entrega" />
            Retirar no local
          </label>
          <label class="checkout-form__radio">
            <RadioButton v-model="checkout.form.entrega" value="entrega" name="entrega" />
            Entrega
          </label>
        </div>
      </div>

      <div v-if="checkout.form.entrega === 'entrega'" class="checkout-form__field">
        <label for="endereco">Endereço de entrega</label>
        <Textarea id="endereco" v-model="checkout.form.endereco" rows="2" autoResize />
      </div>

      <div class="checkout-form__field">
        <label for="pagamento">Forma de pagamento</label>
        <Select
          id="pagamento"
          v-model="checkout.form.pagamento"
          :options="formasPagamento"
          placeholder="Selecione"
        />
      </div>

      <div class="checkout-form__field">
        <label for="obs">Observações (opcional)</label>
        <Textarea id="obs" v-model="checkout.form.observacoes" rows="2" autoResize placeholder="Ex: sem embalagem para presente" />
      </div>

      <div class="checkout-form__total">
        <span>Total do pedido</span>
        <strong>{{ totalFormatado }}</strong>
      </div>

      <Button
        type="submit"
        label="Enviar pedido"
        icon="pi pi-send"
        class="checkout-form__submit"
        :disabled="!checkout.isValido || cart.estaVazio"
      />
      <p class="checkout-form__hint">
        *Seu pedido será registrado e a equipe entrará em contato com você.
      </p>
    </form>
  </Dialog>
</template>

<style scoped>
.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.checkout-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.checkout-form__field label,
.checkout-form__label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--gr-cacao-900);
}

.checkout-form__radios {
  display: flex;
  gap: 18px;
}

.checkout-form__radio {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  cursor: pointer;
}

.checkout-form__total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-top: 1px dashed var(--gr-cream-300);
  font-size: 1rem;
}

.checkout-form__total strong {
  color: var(--gr-berry-700);
  font-family: var(--gr-font-display);
  font-size: 1.3rem;
}

.checkout-form__submit {
  justify-content: center;
  width: 100%;
}

.checkout-form__hint {
  font-size: 0.72rem;
  color: var(--gr-cacao-600);
  text-align: center;
}
</style>
