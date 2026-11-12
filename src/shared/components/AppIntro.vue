<script setup>
const pilares = [
  {
    icon: 'pi pi-sparkles',
    titulo: 'Chocolate Nobre',
    descricao: 'Casquinhas finas e crocantes com cacau de altíssima pureza.'
  },
  {
    icon: 'pi pi-heart',
    titulo: 'Feito com Amor',
    descricao: 'Recheios aveludados preparados de forma 100% artesanal.'
  },
  {
    icon: 'pi pi-gift',
    titulo: 'Pronto para Encantar',
    descricao: 'Caixinhas e mimos delicados para presentear quem você ama.'
  }
]
</script>

<template>
  <section class="app-intro">
    <div class="gr-container app-intro__inner">
      <div v-reveal class="app-intro__card">
        <span class="gr-eyebrow">
          <i class="pi pi-star-fill"></i> Nossa Essência
        </span>
        <h2 class="app-intro__title">
          Cada trufa carrega uma dose de afeto e cuidado
        </h2>
        <p class="app-intro__text">
          Criamos doces finos que combinam técnicas clássicas de confeitaria com
          ingredientes de primeira qualidade. O resultado são trufas aromáticas,
          de casquinha delicada e recheios generosos que derretem no paladar.
        </p>

        <div class="app-intro__grid">
          <div
            v-for="(item, idx) in pilares"
            :key="item.titulo"
            v-reveal
            :data-reveal-delay="idx * 140"
            class="app-intro__item"
          >
            <div class="app-intro__icon-wrap">
              <i :class="item.icon"></i>
            </div>
            <div class="app-intro__item-content">
              <strong>{{ item.titulo }}</strong>
              <span>{{ item.descricao }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.app-intro {
  padding: 10px 0 40px;
}

.app-intro__card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(220, 195, 160, 0.4);
  border-radius: var(--gr-radius-md);
  padding: 36px 32px;
  box-shadow: var(--gr-shadow-card);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.app-intro__title {
  font-family: var(--gr-font-display);
  font-size: clamp(1.4rem, 3.5vw, 2rem);
  color: var(--gr-wine-900);
  line-height: 1.25;
  max-width: 26ch;
}

.app-intro__text {
  font-size: 0.98rem;
  color: var(--gr-cacao-600);
  line-height: 1.65;
  max-width: 62ch;
}

.app-intro__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  margin-top: 16px;
  padding-top: 24px;
  border-top: 1px solid rgba(235, 211, 155, 0.35);
}

.app-intro__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  padding: 12px;
  border-radius: var(--gr-radius-sm);
  transition: transform 0.25s ease;
}

.app-intro__item:hover {
  transform: translateY(-3px);
}

.app-intro__icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gr-blush), #fff);
  border: 1px solid rgba(197, 154, 78, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gr-gold-700);
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(197, 154, 78, 0.15);
}

.app-intro__item-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.app-intro__item-content strong {
  font-family: var(--gr-font-display);
  color: var(--gr-wine-900);
  font-size: 1.05rem;
}

.app-intro__item-content span {
  font-size: 0.82rem;
  color: var(--gr-cacao-600);
  line-height: 1.45;
}

@media (max-width: 768px) {
  .app-intro__card {
    padding: 24px 18px;
  }
  .app-intro__grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .app-intro__item {
    flex-direction: row;
    text-align: left;
    align-items: flex-start;
  }
}
</style>
