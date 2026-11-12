<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrollY = ref(0)

function onScroll() {
  scrollY.value = window.scrollY
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function irParaProdutos() {
  document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })
}

function irParaCombos() {
  document.getElementById('combos')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section class="app-hero">
    <!-- Elementos Decorativos de Parallax no Fundo -->
    <div
      class="app-hero__parallax-orb app-hero__parallax-orb--1"
      :style="{ transform: `translateY(${scrollY * 0.12}px)` }"
      aria-hidden="true"
    ></div>
    <div
      class="app-hero__parallax-orb app-hero__parallax-orb--2"
      :style="{ transform: `translateY(${scrollY * -0.15}px)` }"
      aria-hidden="true"
    ></div>
    <span
      class="app-hero__sparkle app-hero__sparkle--1"
      :style="{ transform: `translateY(${scrollY * 0.25}px)` }"
      aria-hidden="true"
    >✦</span>
    <span
      class="app-hero__sparkle app-hero__sparkle--2"
      :style="{ transform: `translateY(${scrollY * -0.18}px)` }"
      aria-hidden="true"
    >✦</span>
    <span
      class="app-hero__sparkle app-hero__sparkle--3"
      :style="{ transform: `translateY(${scrollY * 0.1}px)` }"
      aria-hidden="true"
    >✦</span>

    <div class="gr-container app-hero__inner">
      <!-- Grande Medalhão Central com Nova Logo -->
      <div
        class="app-hero__medallion-wrap"
        :style="{ transform: `translateY(${scrollY * 0.08}px)` }"
      >
        <div class="app-hero__medallion-glow"></div>
        <div class="app-hero__medallion">
          <img
            src="/images/logo.png"
            alt="Gratitude Doçuras Artesanais"
            class="app-hero__logo-img"
          />
        </div>
      </div>
      <!-- Pill Badge: Feitas à mão · Sabor de carinho -->
      <div class="app-hero__badge">
        <span class="app-hero__badge-sparkle">✦</span>
        <span class="app-hero__badge-text">FEITAS À MÃO · SABOR DE CARINHO</span>
        <span class="app-hero__badge-sparkle">✦</span>
      </div>

      <!-- Título Principal com "momentos" em itálico -->
      <h1 class="app-hero__title">
        Mais que doçuras, experiências que adoçam <em>momentos</em>.
      </h1>

      <!-- Breve texto descritivo e conciso -->
      <p class="app-hero__desc">
        Trufas de chocolate nobre com textura aveludada e recheios generosos.
      </p>

      <!-- Botões de Ação Rápida -->
      <div class="app-hero__actions">
        <button class="app-hero__cta" type="button" @click="irParaProdutos">
          <span>Ver Trufas Sortidas</span>
          <i class="pi pi-arrow-down"></i>
        </button>
        <button class="app-hero__cta-secondary" type="button" @click="irParaCombos">
          <span>Montar Combo</span>
          <i class="pi pi-box"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.app-hero {
  position: relative;
  padding: 40px 20px 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}

.app-hero__inner {
  position: relative;
  z-index: 2;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

/* Medalhão Central Grande com Animações de Início */
.app-hero__medallion-wrap {
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 6px;
  animation: heroLogoPop 1s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.app-hero__medallion-glow {
  position: absolute;
  inset: -12px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(235, 211, 155, 0.6) 0%, rgba(197, 154, 78, 0.15) 50%, transparent 70%);
  filter: blur(8px);
  z-index: 1;
  animation: pulseGlow 4s ease-in-out infinite alternate;
}

.app-hero__medallion {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  padding: 2.5px;
  background: linear-gradient(135deg, #f7e1b5 0%, #c59a4e 45%, #e6c887 70%, #8b621e 100%);
  box-shadow:
    0 16px 36px -8px rgba(56, 10, 20, 0.32),
    0 6px 18px rgba(197, 154, 78, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: floatLevitate 5s ease-in-out infinite alternate;
}

.app-hero__logo-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

/* Badge Pill: Feitas à mão · Sabor de carinho */
.app-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fbf0f0;
  border: 1px solid rgba(230, 206, 210, 0.85);
  border-radius: 9999px;
  padding: 8px 18px;
  color: var(--gr-wine-900);
  box-shadow: 0 4px 14px rgba(56, 10, 20, 0.04);
  animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
}

.app-hero__badge-sparkle {
  color: var(--gr-gold-500);
  font-size: 0.72rem;
  line-height: 1;
}

.app-hero__badge-text {
  font-family: var(--gr-font-body);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* Título Principal */
.app-hero__title {
  font-family: var(--gr-font-display);
  font-size: clamp(2.1rem, 5.5vw, 3.4rem);
  line-height: 1.15;
  color: var(--gr-wine-900);
  font-weight: 700;
  max-width: 18ch;
  animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}

.app-hero__title em {
  font-style: italic;
  font-family: var(--gr-font-display);
  color: var(--gr-marsala);
  font-weight: 600;
}

/* Breve texto descritivo */
.app-hero__desc {
  color: var(--gr-cacao-600);
  font-size: clamp(0.95rem, 2vw, 1.12rem);
  line-height: 1.55;
  max-width: 44ch;
  font-weight: 400;
  animation: fadeInUp 0.9s ease 0.45s both;
}

/* Ações / Botões */
.app-hero__actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 6px;
  animation: fadeInUp 0.9s ease 0.6s both;
}

.app-hero__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--gr-wine-900);
  color: #fff;
  border: 1px solid rgba(235, 211, 155, 0.4);
  padding: 12px 24px;
  border-radius: 9999px;
  font-family: var(--gr-font-body);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 8px 24px rgba(56, 10, 20, 0.25);
}

.app-hero__cta:hover {
  background: var(--gr-wine-800);
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(56, 10, 20, 0.35);
  border-color: var(--gr-gold-400);
}

.app-hero__cta i {
  color: var(--gr-gold-300);
  font-size: 0.85rem;
  transition: transform 0.2s ease;
}

.app-hero__cta:hover i {
  transform: translateY(2px);
}

.app-hero__cta-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.85);
  color: var(--gr-wine-900);
  border: 1px solid rgba(197, 154, 78, 0.4);
  padding: 12px 22px;
  border-radius: 9999px;
  font-family: var(--gr-font-body);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 14px rgba(56, 10, 20, 0.06);
}

.app-hero__cta-secondary:hover {
  background: #fff;
  border-color: var(--gr-gold-500);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(197, 154, 78, 0.2);
}

.app-hero__cta-secondary i {
  color: var(--gr-gold-700);
  font-size: 0.85rem;
}

/* Orbes e Brilhos de Parallax */
.app-hero__parallax-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  filter: blur(40px);
}

.app-hero__parallax-orb--1 {
  width: 280px;
  height: 280px;
  top: 5%;
  left: -40px;
  background: radial-gradient(circle, rgba(235, 211, 155, 0.35) 0%, transparent 70%);
}

.app-hero__parallax-orb--2 {
  width: 320px;
  height: 320px;
  top: 20%;
  right: -60px;
  background: radial-gradient(circle, rgba(246, 216, 222, 0.45) 0%, transparent 70%);
}

.app-hero__sparkle {
  position: absolute;
  color: var(--gr-gold-400);
  pointer-events: none;
  z-index: 1;
  opacity: 0.6;
  font-size: 1rem;
  animation: twinkle 3s ease-in-out infinite alternate;
}

.app-hero__sparkle--1 {
  top: 18%;
  left: 12%;
  font-size: 1.2rem;
  animation-delay: 0.5s;
}

.app-hero__sparkle--2 {
  top: 35%;
  right: 14%;
  font-size: 0.9rem;
  animation-delay: 1.2s;
}

.app-hero__sparkle--3 {
  bottom: 12%;
  left: 20%;
  font-size: 1.4rem;
  animation-delay: 2s;
}

/* Animações Keyframes */
@keyframes heroLogoPop {
  0% {
    opacity: 0;
    transform: scale(0.65) translateY(-20px);
  }
  70% {
    transform: scale(1.05) translateY(0);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes floatLevitate {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-8px);
  }
}

@keyframes pulseGlow {
  0% {
    opacity: 0.45;
    transform: scale(0.95);
  }
  100% {
    opacity: 0.85;
    transform: scale(1.08);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes twinkle {
  0% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  100% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}

@media (max-width: 600px) {
  .app-hero {
    padding: 24px 16px 36px;
  }
  .app-hero__medallion-wrap {
    width: 124px;
    height: 124px;
  }
  .app-hero__badge {
    padding: 6px 14px;
  }
  .app-hero__badge-text {
    font-size: 0.65rem;
  }
  .app-hero__cta,
  .app-hero__cta-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
