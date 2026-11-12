<script setup>
import { computed } from 'vue'
import { useCartStore } from '../store/cartStore'
import { formatCurrency } from '@/shared/utils/currency'

const cart = useCartStore()

const totalFormatado = computed(() => formatCurrency(cart.totalPreco))
const temItens = computed(() => cart.totalItens > 0)
</script>

<template>
  <Transition name="slide-up">
    <aside v-if="temItens" class="floating-cart" aria-label="Acesso rápido à sacolinha">
      <div class="gr-container floating-cart__container">
        <button
          type="button"
          class="floating-cart__pill"
          @click="cart.abrir"
          aria-label="Abrir sacolinha de compras"
        >
          <div class="floating-cart__left">
            <span class="floating-cart__icon-wrap">
              <i class="pi pi-shopping-bag"></i>
            </span>
            <span class="floating-cart__title">
              Ver Sacolinha ({{ cart.totalItens }})
            </span>
          </div>

          <div class="floating-cart__right">
            <span class="floating-cart__total">{{ totalFormatado }}</span>
            <i class="pi pi-chevron-right floating-cart__arrow"></i>
          </div>
        </button>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.floating-cart {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  z-index: 25;
  pointer-events: none;
}

.floating-cart__container {
  display: flex;
  justify-content: center;
}

.floating-cart__pill {
  pointer-events: auto;
  width: 100%;
  max-width: 480px;
  background: var(--gr-wine-900);
  border: 1px solid rgba(235, 211, 155, 0.45);
  border-radius: 9999px;
  padding: 14px 22px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-shadow:
    0 12px 36px rgba(56, 10, 20, 0.45),
    0 4px 12px rgba(197, 154, 78, 0.2);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.floating-cart__pill:hover {
  background: var(--gr-wine-800);
  transform: translateY(-3px);
  border-color: var(--gr-gold-400);
  box-shadow:
    0 16px 42px rgba(56, 10, 20, 0.55),
    0 6px 16px rgba(197, 154, 78, 0.3);
}

.floating-cart__left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.floating-cart__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gr-gold-300);
  font-size: 1.15rem;
}

.floating-cart__title {
  font-family: var(--gr-font-body);
  font-size: 0.98rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: -0.01em;
}

.floating-cart__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.floating-cart__total {
  font-family: var(--gr-font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--gr-gold-300);
}

.floating-cart__arrow {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
}

/* Transição suave de subida */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

@media (max-width: 520px) {
  .floating-cart {
    bottom: 14px;
    padding: 0 12px;
  }
  .floating-cart__pill {
    padding: 12px 18px;
  }
  .floating-cart__title {
    font-size: 0.9rem;
  }
  .floating-cart__total {
    font-size: 1.05rem;
  }
}
</style>
