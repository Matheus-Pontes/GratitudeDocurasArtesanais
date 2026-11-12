<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '@/features/cart/store/cartStore'

const cart = useCartStore()
const isScrolled = ref(false)

function onScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="app-header" :class="{ 'app-header--scrolled': isScrolled }">
    <div class="gr-container app-header__inner">
      <a href="#" class="app-header__brand" aria-label="Gratitude Doçuras Artesanais">
        <div class="app-header__logo-wrap">
          <img
            src="/images/logo.png"
            alt="Gratitude Logo"
            class="app-header__logo"
          />
        </div>
        <div class="app-header__brand-text">
          <span class="app-header__brand-title">Gratitude</span>
          <span class="app-header__brand-sub">DOÇURAS ARTESANAIS</span>
        </div>
      </a>

      <button
        class="app-header__cart-pill"
        type="button"
        aria-label="Abrir sacolinha"
        @click="cart.abrir"
      >
        <span class="app-header__cart-icon-wrap">
          <i class="pi pi-shopping-bag"></i>
        </span>
        <span v-if="cart.totalItens > 0" class="app-header__cart-badge">
          {{ cart.totalItens }}
        </span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(255, 253, 250, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(220, 195, 160, 0.25);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.app-header--scrolled {
  background: rgba(255, 252, 248, 0.96);
  border-bottom-color: rgba(197, 154, 78, 0.3);
  box-shadow: 0 8px 24px -6px rgba(56, 10, 20, 0.08);
}

.app-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  min-height: 64px;
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.app-header__brand:hover {
  opacity: 0.9;
}

.app-header__logo-wrap {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  padding: 1.5px;
  background: linear-gradient(135deg, #f0d59e, #c59a4e, #8b621e);
  box-shadow: 0 4px 12px rgba(197, 154, 78, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.app-header__logo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.app-header__brand-text {
  display: flex;
  flex-direction: column;
}

.app-header__brand-title {
  font-family: var(--gr-font-display);
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--gr-wine-900);
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.app-header__brand-sub {
  font-size: 0.58rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--gr-gold-700);
  margin-top: 2px;
}

/* Cart Button Styled Exactly like the Mockup */
.app-header__cart-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--gr-wine-900);
  color: #fff;
  border: 1px solid rgba(235, 211, 155, 0.35);
  border-radius: 9999px;
  padding: 6px 12px 6px 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 14px rgba(56, 10, 20, 0.25);
  min-height: 38px;
}

.app-header__cart-pill:hover {
  background: var(--gr-wine-800);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(56, 10, 20, 0.35);
  border-color: var(--gr-gold-400);
}

.app-header__cart-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gr-gold-300);
  font-size: 1rem;
}

.app-header__cart-badge {
  background: var(--gr-gold-400);
  color: var(--gr-wine-950);
  font-size: 0.72rem;
  font-weight: 700;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

@media (max-width: 480px) {
  .app-header__inner {
    padding: 8px 16px;
  }
  .app-header__logo-wrap {
    width: 38px;
    height: 38px;
  }
  .app-header__brand-title {
    font-size: 1.3rem;
  }
  .app-header__brand-sub {
    font-size: 0.52rem;
  }
}
</style>
