<script setup>
import Toast from 'primevue/toast'
import MainLayout from '@/shared/layouts/MainLayout.vue'
import AppHero from '@/shared/components/AppHero.vue'
import TruffleList from '@/features/truffles/components/TruffleList.vue'
import ComboList from '@/features/combos/components/ComboList.vue'
import CartDrawer from '@/features/cart/components/CartDrawer.vue'
import CheckoutDialog from '@/features/checkout/components/CheckoutDialog.vue'
</script>

<template>
  <MainLayout>
    <AppHero />

    <div id="catalogo" class="gr-container gr-section">
      <TruffleList />
    </div>

    <ComboList />
  </MainLayout>

  <CartDrawer />
  <CheckoutDialog />
  <Toast position="top-center" />
</template>
