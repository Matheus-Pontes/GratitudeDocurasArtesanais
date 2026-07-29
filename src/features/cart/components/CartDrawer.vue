<script setup>
import { computed } from 'vue'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import { useCartStore } from '../store/cartStore'
import { useCheckoutStore } from '@/features/checkout/store/checkoutStore'
import { formatCurrency } from '@/shared/utils/currency'
import CartItem from './CartItem.vue'

const cart = useCartStore()
const checkout = useCheckoutStore()

const totalFormatado = computed(() => formatCurrency(cart.totalPreco))

function irParaCheckout() {
  checkout.abrir()
}
</script>

<template>
  <Drawer
    :visible="cart.isOpen"
    @update:visible="(v) => (cart.isOpen = v)"
    position="right"
    header="Sua sacolinha"
    class="cart-drawer"
  >
    <div v-if="cart.estaVazio" class="cart-drawer__empty">
      <i class="pi pi-shopping-bag"></i>
      <p>Sua sacolinha está vazia.</p>
      <span>Escolha suas trufas favoritas para começar :)</span>
    </div>

    <template v-else>
      <ul class="cart-drawer__list">
        <CartItem v-for="item in cart.items" :key="item.id" :item="item" />
      </ul>

      <div class="cart-drawer__summary">
        <div class="cart-drawer__total">
          <span>Total</span>
          <strong>{{ totalFormatado }}</strong>
        </div>
        <Button
          label="Finalizar pedido"
          icon="pi pi-arrow-right"
          iconPos="right"
          class="cart-drawer__checkout-btn"
          @click="irParaCheckout"
        />
        <Button
          label="Esvaziar sacolinha"
          text
          severity="secondary"
          class="cart-drawer__clear-btn"
          @click="cart.limpar"
        />
      </div>
    </template>
  </Drawer>
</template>

<style scoped>
:global(.cart-drawer .p-drawer-content) {
  display: flex;
  flex-direction: column;
}

.cart-drawer__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  padding: 60px 20px;
  color: var(--gr-cacao-600);
}

.cart-drawer__empty i {
  font-size: 2.2rem;
  color: var(--gr-pink-300);
  margin-bottom: 6px;
}

.cart-drawer__list {
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  overflow-y: auto;
}

.cart-drawer__summary {
  border-top: 1px solid var(--gr-cream-300);
  padding-top: 16px;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cart-drawer__total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 1rem;
  margin-bottom: 6px;
}

.cart-drawer__total strong {
  font-family: var(--gr-font-display);
  font-size: 1.5rem;
  color: var(--gr-berry-700);
}

.cart-drawer__checkout-btn {
  width: 100%;
  justify-content: center;
}

.cart-drawer__clear-btn {
  width: 100%;
  justify-content: center;
}
</style>
