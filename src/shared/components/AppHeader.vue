<script setup>
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import { useCartStore } from '@/features/cart/store/cartStore'

const cart = useCartStore()
</script>

<template>
  <header class="app-header">
    <div class="gr-container app-header__inner">
      <div class="app-header__brand">
        <span class="app-header__brand-script">Gratitude</span>
        <span class="app-header__brand-sub">Doçuras Artesanais</span>
      </div>

      <Button
        class="app-header__cart-btn"
        rounded
        aria-label="Abrir sacolinha"
        @click="cart.abrir"
      >
        <i class="pi pi-shopping-bag"></i>
        <Badge
          v-if="cart.totalItens > 0"
          :value="cart.totalItens"
          severity="warn"
          class="app-header__cart-badge"
        />
      </Button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(253, 246, 240, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--gr-cream-300);
}

.app-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
}

.app-header__brand {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.app-header__brand-script {
  font-family: var(--gr-font-title);
  font-size: 2rem;
  font-weight: 700;
  color: var(--gr-pink-500);
}

.app-header__brand-sub {
  font-size: 0.65rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gr-cacao-600);
  margin-left: 2px;
}

.app-header__cart-btn {
  position: relative;
  z-index: 1;
  overflow: visible;
}

.app-header__cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  z-index: 10;
  
}
</style>
