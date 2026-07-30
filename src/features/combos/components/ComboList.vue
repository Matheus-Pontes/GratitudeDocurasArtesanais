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
  <section class="combo-list" aria-labelledby="combos-especiais">
    <div class="gr-container">
      <header class="combo-list__header">
        <h2 id="combos-especiais">Combos Especiais</h2>
        <p>Escolha os sabores da Linha Tradicional para montar sua caixinha.</p>
      </header>

      <div v-if="store.isLoading" class="combo-list__state">
        <ProgressSpinner strokeWidth="4" style="width: 40px; height: 40px" />
      </div>

      <Message v-else-if="store.status === 'error'" severity="error" :closable="false">
        {{ store.error }}
      </Message>

      <div v-else class="combo-list__grid">
        <ComboCard
          v-for="(combo, idx) in store.items"
          :key="combo.id"
          :combo="combo"
          
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.combo-list {
  padding: 20px 0 60px;
}

.combo-list__header {
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.combo-list__header h2 {
  font-size: 1.9rem;
}

.combo-list__header p {
  color: var(--gr-cacao-600);
  font-size: 0.9rem;
}

.combo-list__state {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.combo-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
</style>
