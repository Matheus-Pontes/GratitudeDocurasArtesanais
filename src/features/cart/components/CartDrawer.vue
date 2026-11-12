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
const quantidadeDeTrufasComboEstaCerta = computed(() => cart.quantidadeDeTrufasComboEstaCerta())

function irParaCheckout() {
  checkout.abrir()
}
</script>

<template>
  <Drawer
    :visible="cart.isOpen"
    @update:visible="(v) => (cart.isOpen = v)"
    position="right"
    header="Sua Sacolinha"
    class="cart-drawer"
  >
    <div v-if="cart.estaVazio" class="cart-drawer__empty">
      <div class="cart-drawer__empty-icon">
        <i class="pi pi-shopping-bag"></i>
      </div>
      <p>Sua sacolinha ainda está vazia.</p>
      <span>Escolha suas trufas e combos favoritos para adoçar o dia! 🍬</span>
    </div>

    <template v-else>
      <ul class="cart-drawer__list">
        <CartItem v-for="item in cart.items" :key="item.id" :item="item" />
      </ul>

      <div class="cart-drawer__summary">
        <div class="cart-drawer__total">
          <span>Subtotal</span>
          <strong class="cart-drawer__total-val">{{ totalFormatado }}</strong>
        </div>
        <button
          type="button"
          class="cart-drawer__checkout-btn"
          :disabled="!quantidadeDeTrufasComboEstaCerta"
          @click="irParaCheckout"
        >
          <span>Finalizar Pedido</span>
          <i class="pi pi-arrow-right"></i>
        </button>
        <button
          type="button"
          class="cart-drawer__clear-btn"
          @click="cart.limpar"
        >
          Esvaziar sacolinha
        </button>
      </div>
    </template>
  </Drawer>
</template>

<style scoped>
:global(.cart-drawer .p-drawer-content) {
  display: flex;
  flex-direction: column;
}

:global(.cart-drawer .p-drawer-header) {
  font-family: var(--gr-font-display);
  color: var(--gr-wine-900);
  border-bottom: 1px solid rgba(220, 195, 160, 0.4);
  padding: 16px 20px;
}

.cart-drawer__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  padding: 80px 20px;
  color: var(--gr-cacao-600);
}

.cart-drawer__empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--gr-cream-200);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gr-gold-700);
  font-size: 1.8rem;
  margin-bottom: 6px;
}

.cart-drawer__empty p {
  font-family: var(--gr-font-display);
  font-size: 1.2rem;
  color: var(--gr-wine-900);
}

.cart-drawer__empty span {
  font-size: 0.88rem;
  line-height: 1.45;
  max-width: 28ch;
}

.cart-drawer__list {
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  overflow-y: auto;
}

.cart-drawer__summary {
  border-top: 1px solid rgba(220, 195, 160, 0.5);
  padding-top: 18px;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cart-drawer__total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 1rem;
  color: var(--gr-cacao-700);
  margin-bottom: 4px;
}

.cart-drawer__total-val {
  font-family: var(--gr-font-display);
  font-size: 1.6rem;
  color: var(--gr-wine-900);
}

.cart-drawer__checkout-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--gr-wine-900);
  color: #fff;
  border: 1px solid rgba(235, 211, 155, 0.4);
  padding: 14px;
  border-radius: 9999px;
  font-family: var(--gr-font-body);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 6px 18px rgba(56, 10, 20, 0.25);
}

.cart-drawer__checkout-btn:hover:not(:disabled) {
  background: var(--gr-wine-800);
  border-color: var(--gr-gold-400);
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(56, 10, 20, 0.35);
}

.cart-drawer__checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cart-drawer__clear-btn {
  background: transparent;
  border: none;
  color: var(--gr-cacao-600);
  font-size: 0.8rem;
  padding: 6px;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.cart-drawer__clear-btn:hover {
  color: var(--gr-wine-900);
}
</style>
