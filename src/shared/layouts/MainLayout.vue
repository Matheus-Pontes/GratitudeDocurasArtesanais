<script setup>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
</script>

<template>
  <div class="main-layout">
    <AppHeader />
    <main class="main-layout__content">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-layout__content {
  flex: 1;
}
</style>
