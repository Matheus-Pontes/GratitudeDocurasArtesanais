<script setup>
const highlights = [
  { icon: 'pi pi-heart-fill', text: 'Feitas com ingredientes selecionados' },
  { icon: 'pi pi-star-fill', text: 'Produzidas com muito carinho' },
  { icon: 'pi pi-gift', text: 'Perfeitas para presentear e compartilhar' }
]
</script>

<template>
  <footer class="app-footer">
    <div class="gr-container app-footer__inner">
      <ul class="app-footer__highlights">
        <li v-for="h in highlights" :key="h.text">
          <i :class="h.icon"></i>
          <span>{{ h.text }}</span>
        </li>
      </ul>
      <p class="app-footer__thanks">Obrigado por fazer parte dos nossos momentos doces! 💕</p>
      <p class="app-footer__copy">&copy; Copyright - Gratitude Doçuras Artesanais - 2026</p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, var(--gr-berry-700), var(--gr-berry-900));
  color: #fff;
  padding: 32px 0;
  margin-top: 40px;
}

.app-footer__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
}

.app-footer__highlights {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 26px;
  margin: 0;
  padding: 0;
}

.app-footer__highlights li {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  max-width: 160px;
  opacity: 0.95;
}

.app-footer__highlights i {
  font-size: 1.3rem;
  color: var(--gr-gold-300);
}

.app-footer__thanks {
  font-family: var(--gr-font-script);
  font-size: 1.4rem;
}

.app-footer__copy {
  font-family: var(--gr-font-body);
  color: rgb(200, 196, 196) !important;
  font-size: .65rem;
}
</style>
