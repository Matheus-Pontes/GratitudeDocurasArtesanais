<script setup>
import Toast from 'primevue/toast'
import MainLayout from '@/shared/layouts/MainLayout.vue'
import AppHero from '@/shared/components/AppHero.vue'

import CartDrawer from '@/features/cart/components/CartDrawer.vue'
import CheckoutDialog from '@/features/checkout/components/CheckoutDialog.vue'
import AppTabs from './shared/components/AppTabs.vue'

</script>

<template>
  <MainLayout>
    <AppHero />

    <div id="catalogo" class="gr-container gr-section">
      <AppTabs />
    </div>

  </MainLayout>

  <CartDrawer />
  <CheckoutDialog />
  <Toast position="top-center" />
</template>

<style scoped>
#catalogo {
  padding: 1.25rem;
}
</style>
