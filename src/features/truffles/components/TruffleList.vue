<script setup>
import { onMounted } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import { useTruffleStore } from '../store/truffleStore'
import TruffleCard from './TruffleCard.vue'

const store = useTruffleStore()

onMounted(() => {
  store.load()
})
</script>

<template>
  <div class="truffle-list">
    <div v-if="store.isLoading" class="truffle-list__state">
      <ProgressSpinner strokeWidth="4" style="width: 48px; height: 48px" />
      <p>Carregando as trufas fresquinhas…</p>
    </div>

    <Message v-else-if="store.status === 'error'" severity="error" :closable="false">
      {{ store.error }}
    </Message>

    <template v-else>
      <section class="truffle-list__section" aria-labelledby="linha-premium">
        <header class="truffle-list__header">
          <span class="gr-eyebrow">Sabores exclusivos</span>
          <h2 id="linha-premium">Linha Premium</h2>
          <p class="truffle-list__hint">*Sabores da Linha Premium não fazem parte dos combos.</p>
        </header>
        <div class="truffle-list__grid">
          <TruffleCard
            v-for="t in store.premium"
            :key="t.id"
            :truffle="t"
          />
        </div>
      </section>

      <section class="truffle-list__section" aria-labelledby="linha-tradicional">
        <header class="truffle-list__header">
          <span class="gr-eyebrow">Os queridinhos</span>
          <h2 id="linha-tradicional">Linha Tradicional</h2>
        </header>
        <div class="truffle-list__grid">
          <TruffleCard
            v-for="t in store.tradicional"
            :key="t.id"
            :truffle="t"
          />
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.truffle-list__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 0;
  color: var(--gr-cacao-600);
}

.truffle-list__section + .truffle-list__section {
  margin-top: 48px;
}

.truffle-list__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 22px;
}

.truffle-list__header h2 {
  font-size: 1.8rem;
}

.truffle-list__hint {
  font-size: 0.8rem;
  color: var(--gr-cacao-600);
  font-style: italic;
}

.truffle-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 22px;
}
</style>
