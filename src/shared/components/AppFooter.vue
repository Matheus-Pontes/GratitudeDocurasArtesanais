<script setup>
import { useCartStore } from '@/features/cart/store/cartStore'

const cart = useCartStore()

function rolarPara(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <footer class="app-footer">
    <div class="gr-container app-footer__inner">
      <div v-reveal class="app-footer__brand-block">
        <div class="app-footer__logo-wrap">
          <img
            src="/images/logo.png"
            alt="Gratitude"
            class="app-footer__logo"
          />
        </div>
        <div class="app-footer__brand-text">
          <h3 class="app-footer__title">Gratitude</h3>
          <span class="app-footer__subtitle">DOÇURAS ARTESANAIS</span>
        </div>
        <p class="app-footer__tagline">
          Adoçando seus momentos com afeto, elegância e trufas de chocolate nobre.
        </p>
      </div>

      <div v-reveal data-reveal-delay="120" class="app-footer__nav-block">
        <h4 class="app-footer__col-title">Navegação</h4>
        <ul class="app-footer__links">
          <li><button type="button" @click="rolarPara('sortidos')">Trufas Sortidas</button></li>
          <li><button type="button" @click="rolarPara('combos')">Combos Especiais</button></li>
          <li><button type="button" @click="rolarPara('sobre')">Nossa História</button></li>
          <li><button type="button" @click="cart.abrir">Minha Sacolinha</button></li>
        </ul>
      </div>

      <div v-reveal data-reveal-delay="240" class="app-footer__contact-block">
        <h4 class="app-footer__col-title">Atendimento</h4>
        <p class="app-footer__contact-text">
          <i class="pi pi-clock"></i> Terça a Domingo: 10h às 19h
        </p>
        <p class="app-footer__contact-text">
          <i class="pi pi-map-marker"></i> São Paulo - SP e região
        </p>
        <div class="app-footer__social">
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            class="app-footer__social-btn"
            aria-label="WhatsApp"
          >
            <i class="pi pi-whatsapp"></i>
            <span>WhatsApp</span>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            class="app-footer__social-btn"
            aria-label="Instagram"
          >
            <i class="pi pi-instagram"></i>
            <span>Instagram</span>
          </a>
        </div>
      </div>
    </div>

    <div class="app-footer__bottom">
      <div class="gr-container app-footer__bottom-inner">
        <p class="app-footer__copy">
          &copy; {{ new Date().getFullYear() }} Gratitude Doçuras Artesanais. Todos os direitos reservados.
        </p>
        <span class="app-footer__made-with">
          Feito à mão com chocolate nobre & carinho 🍫
        </span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: linear-gradient(180deg, var(--gr-wine-900) 0%, var(--gr-wine-950) 100%);
  color: #fff;
  padding: 56px 0 0;
  border-top: 2px solid rgba(197, 154, 78, 0.4);
  position: relative;
  z-index: 10;
}

.app-footer__inner {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1.2fr;
  gap: 40px;
  padding-bottom: 48px;
}

.app-footer__brand-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.app-footer__logo-wrap {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, #f0d59e, #c59a4e);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.app-footer__logo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.app-footer__brand-text {
  display: flex;
  flex-direction: column;
}

.app-footer__title {
  font-family: var(--gr-font-display);
  font-size: 1.6rem;
  color: #fff;
  letter-spacing: -0.01em;
}

.app-footer__subtitle {
  font-size: 0.62rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gr-gold-300);
  font-weight: 600;
}

.app-footer__tagline {
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.5;
  max-width: 32ch;
}

.app-footer__col-title {
  font-family: var(--gr-font-display);
  font-size: 1.15rem;
  color: var(--gr-gold-300);
  margin-bottom: 14px;
}

.app-footer__links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.app-footer__links button {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.88rem;
  font-family: var(--gr-font-body);
  padding: 0;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
  display: inline-block;
}

.app-footer__links button:hover {
  color: var(--gr-gold-300);
  transform: translateX(4px);
}

.app-footer__contact-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.app-footer__contact-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.8);
}

.app-footer__contact-text i {
  color: var(--gr-gold-400);
}

.app-footer__social {
  display: flex;
  gap: 10px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.app-footer__social-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(235, 211, 155, 0.3);
  color: #fff;
  padding: 8px 14px;
  border-radius: 9999px;
  font-size: 0.82rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.app-footer__social-btn:hover {
  background: var(--gr-gold-500);
  color: var(--gr-wine-950);
  border-color: var(--gr-gold-400);
  transform: translateY(-2px);
}

.app-footer__bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 0;
  background: rgba(0, 0, 0, 0.2);
}

.app-footer__bottom-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.app-footer__copy {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.6);
}

.app-footer__made-with {
  font-size: 0.78rem;
  color: var(--gr-gold-300);
}

@media (max-width: 768px) {
  .app-footer__inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .app-footer__bottom-inner {
    flex-direction: column;
    text-align: center;
  }
}
</style>
