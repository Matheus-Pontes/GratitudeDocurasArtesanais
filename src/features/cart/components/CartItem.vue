<script setup>
import { computed } from 'vue'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import { useCartStore } from '../store/cartStore'
import { formatCurrency } from '@/shared/utils/currency'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const cart = useCartStore()

const subtotal = computed(() => formatCurrency(props.item.preco * props.item.quantidade))
const precoUnitario = computed(() => formatCurrency(props.item.preco))

function onQuantidadeChange(valor) {
  cart.atualizarQuantidade(props.item.id, valor ?? 0)
}
</script>

<template>
  <li class="cart-item">
    <img class="cart-item__img" :src="item.imagem" :alt="item.nome" />
    <div class="cart-item__info">
      <div class="cart-item__info_details">
        <p class="cart-item__nome">{{ item.nome }}</p>
        <span class="cart-item__subtotal">{{ subtotal }}</span>
      </div>
      <p class="cart-item__preco-unit">{{ precoUnitario }} / un.</p>
      <div class="cart-item__controls">
        <InputNumber
          :modelValue="item.quantidade"
          @update:modelValue="onQuantidadeChange"
          :min="0"
          :max="99"
          showButtons
          buttonLayout="horizontal"
          inputClass="cart-item__qty-input"
        />
        <button
          class="cart-item__remove"
          type="button"
          @click="cart.remover(item.id)"
          :aria-label="`Remover ${item.nome} do carrinho`"
        >
          <i class="pi pi-trash"></i>
        </button>
      </div>
    </div>
    
  </li>
</template>

<style scoped>
.cart-item {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 12px;
  align-items: start;
  padding: 12px 0;
  border-bottom: 1px solid var(--gr-cream-300);
}

.cart-item__img {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  object-fit: cover;
}

.cart-item__nome {
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.25;
}

.cart-item__preco-unit {
  font-size: 0.75rem;
  color: var(--gr-cacao-600);
  margin-top: 2px;
}

.cart-item__controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.cart-item__remove {
  border: none;
  background: transparent;
  color: var(--gr-cacao-600);
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
}

.cart-item__remove:hover {
  color: var(--gr-berry-700);
  background: var(--gr-cream-200);
}

.cart-item__subtotal {
  font-weight: 700;
  color: var(--gr-berry-700);
  font-size: 0.9rem;
  white-space: nowrap;
}

.cart-item__info_details {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

:deep(.cart-item__qty-input) {
  width: 44px;
  text-align: center;
  padding: 4px 0;
}
</style>
