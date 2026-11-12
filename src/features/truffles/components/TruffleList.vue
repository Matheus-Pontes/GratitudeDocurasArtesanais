<script setup>
import { ref, computed, onMounted } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import { useTruffleStore } from '../store/truffleStore'
import TruffleCard from './TruffleCard.vue'

const store = useTruffleStore()
const filtroAtivo = ref('todos') // 'todos' | 'tradicional' | 'premium'

onMounted(() => {
  store.load()
})

const itensFiltrados = computed(() => {
  if (filtroAtivo.value === 'tradicional') return store.tradicional
  if (filtroAtivo.value === 'premium') return store.premium
  return store.items
})
</script>

<template>
  <section id="sortidos" class="truffle-section" aria-labelledby="titulo-sortidos">
    <div class="gr-container">
      <header v-reveal class="truffle-section__header">
        <span class="gr-eyebrow">
          <i class="pi pi-sparkles"></i> Linha de Produtos Sortidos
        </span>
        <h2 id="titulo-sortidos" class="truffle-section__title">
          Trufas Artesanais Sortidas
        </h2>
        <p class="truffle-section__subtitle">
          Escolha suas opções favoritas individualmente entre receitas tradicionais consagradas e criações premium.
        </p>

        <!-- Filtros Rápidos -->
        <div class="truffle-section__filters" role="tablist" aria-label="Filtrar sabores">
          <button
            type="button"
            class="truffle-section__filter-btn"
            :class="{ 'truffle-section__filter-btn--active': filtroAtivo === 'todos' }"
            @click="filtroAtivo = 'todos'"
          >
            Todos os Sabores ({{ store.items.length }})
          </button>
          <button
            type="button"
            class="truffle-section__filter-btn"
            :class="{ 'truffle-section__filter-btn--active': filtroAtivo === 'tradicional' }"
            @click="filtroAtivo = 'tradicional'"
          >
            Tradicionais ({{ store.tradicional.length }})
          </button>
          <button
            type="button"
            class="truffle-section__filter-btn"
            :class="{ 'truffle-section__filter-btn--active': filtroAtivo === 'premium' }"
            @click="filtroAtivo = 'premium'"
          >
            <i class="pi pi-crown"></i> Linha Premium ({{ store.premium.length }})
          </button>
        </div>
      </header>

      <div v-if="store.isLoading" class="truffle-section__state">
        <ProgressSpinner strokeWidth="4" style="width: 48px; height: 48px" />
        <p>Preparando a vitrine com carinho…</p>
      </div>

      <Message v-else-if="store.status === 'error'" severity="error" :closable="false">
        {{ store.error }}
      </Message>

      <div v-else class="truffle-section__grid">
        <TruffleCard
          v-for="(t, idx) in itensFiltrados"
          :key="t.id"
          v-reveal
          :data-reveal-delay="(idx % 4) * 90"
          :truffle="t"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.truffle-section {
  padding: 40px 0 60px;
}

.truffle-section__header {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.truffle-section__title {
  font-family: var(--gr-font-display);
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  color: var(--gr-wine-900);
  line-height: 1.15;
}

.truffle-section__subtitle {
  color: var(--gr-cacao-600);
  font-size: 0.96rem;
  line-height: 1.55;
}

/* Filtros */
.truffle-section__filters {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.truffle-section__filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.8);
  color: var(--gr-cacao-700);
  border: 1px solid rgba(220, 195, 160, 0.4);
  padding: 8px 18px;
  border-radius: 9999px;
  font-family: var(--gr-font-body);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.truffle-section__filter-btn:hover {
  background: #fff;
  border-color: var(--gr-gold-500);
  color: var(--gr-wine-900);
  transform: translateY(-2px);
}

.truffle-section__filter-btn--active {
  background: var(--gr-wine-900);
  color: #fff;
  border-color: rgba(235, 211, 155, 0.4);
  box-shadow: 0 4px 14px rgba(56, 10, 20, 0.2);
}

.truffle-section__filter-btn--active:hover {
  background: var(--gr-wine-800);
  color: #fff;
}

.truffle-section__filter-btn i {
  color: var(--gr-gold-400);
  font-size: 0.78rem;
}

.truffle-section__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 0;
  color: var(--gr-cacao-600);
}

.truffle-section__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
}

@media (max-width: 600px) {
  .truffle-section {
    padding: 30px 0 45px;
  }
  .truffle-section__grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .truffle-section__filter-btn {
    padding: 6px 14px;
    font-size: 0.8rem;
  }
}
</style>
