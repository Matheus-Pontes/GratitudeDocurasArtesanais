<script setup>
import { computed, ref, watch } from 'vue'
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
import { mascaraCep, mascaraTelefone } from '../../../shared/utils/masks'

const cart = useCartStore()
const checkout = useCheckoutStore()
const toast = useToast()

const formasPagamento = ['Pix', 'Dinheiro', 'Cartão de crédito', 'Cartão de débito']

const totalFormatado = computed(() => formatCurrency(cart.totalPreco))

const frete = ref(0)

const totalFrete = computed(() => formatCurrency(frete.value))

const totalComFrete = computed(() =>
  formatCurrency(frete.value + cart.totalPreco)
)

watch(
  () => [checkout.form.cep, checkout.form.entrega],
  async ([cep, entrega]) => {
    if (entrega !== 'entrega') {
      frete.value = 0
      return
    }

    frete.value = Math.round(await checkout.calcularFrete())
  },
  { immediate: true }
)
const enviandoPedido = ref(false)
const iconPedido = ref('pi pi-send')

watch(
  enviandoPedido,
  (newValue) => {
    if (newValue) {
      iconPedido.value = 'pi pi-spin pi-spinner'
    } else {
      iconPedido.value = 'pi pi-send'
    }
  },
  { immediate: true }
)

watch(
  () => checkout.form.entrega,
  (newValue) => {
    if (newValue === "retirada") {
      checkout.cleanAddress();
    }
  },
  { immediate: true }
);



async function enviarPedido() {
  if (!checkout.isValido || cart.estaVazio) {
    return  toast.add({
      severity: 'error',
      summary: 'Preencha os campos obrigatórios !!!',
      life: 4000
    });
  }

  try {
    enviandoPedido.value = true;
    await checkout.enviarPedido(cart.items, cart.totalPreco)
    enviandoPedido.value = false;

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
    :closable="!enviandoPedido"
    :dismissableMask="!enviandoPedido"
  >
    <form class="checkout-form" @submit.prevent="enviarPedido">
      <div class="checkout-form__field">
        <label for="nome">Nome completo <span class="required">*</span></label>
        <InputText id="nome" v-model="checkout.form.nome" placeholder="Como podemos te chamar?" :disabled="enviandoPedido" />
      </div>

      <div class="checkout-form__field">
        <label for="telefone">Telefone / WhatsApp <span class="required">*</span></label>
        <InputText id="telefone" v-model="checkout.form.telefone" maxlength="15" @input="checkout.form.telefone = mascaraTelefone(checkout.form.telefone)" placeholder="(11) 91234-5678" :disabled="enviandoPedido" />
      </div>

      <div class="checkout-form__field">
        <span class="checkout-form__label">Como prefere receber?</span>
        <div class="checkout-form__radios">
          <label class="checkout-form__radio">
            <RadioButton v-model="checkout.form.entrega" value="retirada" name="entrega" :disabled="enviandoPedido" />
            Retirar no local
          </label>
          <label class="checkout-form__radio">
            <RadioButton v-model="checkout.form.entrega" value="entrega" name="entrega" :disabled="enviandoPedido" />
            Entrega
          </label>
        </div>
      </div>

      <div v-if="checkout.form.entrega === 'entrega'" class="checkout-form__field">
        <label for="endereco">Endereço de entrega</label>

        <div>
          <label for="cep">CEP <span class="required">*</span></label>
          <InputText id="cep" class="checkout-form_w-full" v-model="checkout.form.cep" v-on:change="mascaraCep" v-on:blur="checkout.buscarCep" :disabled="enviandoPedido"/>
        </div>

        <div>
          <label for="cep">Estado</label>
          <InputText id="cep" class="checkout-form_w-full" v-model="checkout.form.estado" disabled/>
        </div>

        <div>
          <label for="rua">Rua</label>
          <InputText id="rua" class="checkout-form_w-full" v-model="checkout.form.rua" :disabled="enviandoPedido"/>
        </div>

        <div>
          <label for="numero">Número <span class="required">*</span></label>
          <InputText id="numero" class="checkout-form_w-full" v-model="checkout.form.numero" :disabled="enviandoPedido" />
        </div>

        <div>
          <label for="complemento">Complemento</label>
          <Textarea id="complemento" class="checkout-form_w-full" v-model="checkout.form.complemento" rows="2" autoResize :disabled="enviandoPedido" />
        </div>
      </div>

      <div class="checkout-form__field">
        <label for="pagamento">Forma de pagamento <span class="required">*</span></label>
        <Select
          id="pagamento"
          v-model="checkout.form.pagamento"
          :options="formasPagamento"
          placeholder="Selecione"
          :disabled="enviandoPedido"
        />
      </div>

      <div class="checkout-form__field">
        <label for="obs">Observações (opcional)</label>
        <Textarea id="obs" v-model="checkout.form.observacoes" rows="2" autoResize placeholder="Ex: sem embalagem para presente" :disabled="enviandoPedido" />
      </div>

      
      <div class="checkout-form__total">
        <div>
          <span>Total do pedido</span>
          <strong>{{ totalFormatado }}</strong>
        </div>

        <div v-if="checkout.form.entrega === 'entrega'" class="checkout-form__frete">
          <span>Frete</span>
          <strong>{{ totalFrete }}</strong>
        </div>

      </div>

      <div class="checkout-form__total" v-if="checkout.form.entrega === 'entrega'">
        <div>
          <span>Total</span>
          <strong>{{ totalComFrete }}</strong>
        </div>
      </div>

      <Button
        type="submit"
        label="Enviar pedido"
        :icon=iconPedido
        class="checkout-form__submit"
        :disabled="enviandoPedido"
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
  padding: 12px 0;
  border-top: 1px dashed var(--gr-cream-300);
  font-size: 1rem;
}

.checkout-form__frete, .checkout-form__frete > strong { 
  font-size: 1rem !important;
}

.checkout-form__total  div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
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

.checkout-form_w-full {
  width: 100%;
}

label .required {
  color: red;
}

</style>
