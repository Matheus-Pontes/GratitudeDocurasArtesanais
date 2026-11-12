<script setup>
import { onMounted } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import { useComboStore } from '../store/comboStore'
import ComboCard from './ComboCard.vue'

const store = useComboStore()

onMounted(() => {
  store.load()
})
</script>

<template>
  <section id="combos" class="combo-section" aria-labelledby="titulo-combos">
    <div class="gr-container">
      <header v-reveal class="combo-section__header">
        <span class="gr-eyebrow">
          <i class="pi pi-box"></i> Caixinhas & Kits
        </span>
        <h2 id="titulo-combos" class="combo-section__title">
          Combos Especiais
        </h2>
        <p class="combo-section__subtitle">
          Escolha os sabores da Linha Tradicional para compor sua caixinha personalizada, ou aproveite nossa sugestão sortida.
        </p>
      </header>

      <div v-if="store.isLoading" class="combo-section__state">
        <ProgressSpinner strokeWidth="4" style="width: 44px; height: 44px" />
        <p>Carregando caixinhas especiais…</p>
      </div>

      <Message v-else-if="store.status === 'error'" severity="error" :closable="false">
        {{ store.error }}
      </Message>

      <div v-else class="combo-section__grid">
        <ComboCard
          v-for="(combo, idx) in store.items"
          :key="combo.id"
          v-reveal
          :data-reveal-delay="idx * 150"
          :combo="combo"
          :destaque="combo.id === 'combo-5'"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.combo-section {
  padding: 40px 0 60px;
  position: relative;
}

.combo-section__header {
  text-align: center;
  max-width: 640px;
  margin: 0 auto 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.combo-section__title {
  font-family: var(--gr-font-display);
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  color: var(--gr-wine-900);
  line-height: 1.15;
}

.combo-section__subtitle {
  color: var(--gr-cacao-600);
  font-size: 0.96rem;
  line-height: 1.55;
}

.combo-section__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 0;
  color: var(--gr-cacao-600);
}

.combo-section__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

@media (max-width: 600px) {
  .combo-section {
    padding: 30px 0 45px;
  }
  .combo-section__grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
