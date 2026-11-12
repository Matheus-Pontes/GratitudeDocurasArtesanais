<script setup>
import Toast from 'primevue/toast'
import MainLayout from '@/shared/layouts/MainLayout.vue'
import AppHero from '@/shared/components/AppHero.vue'
import AppIntro from '@/shared/components/AppIntro.vue'
import TruffleList from '@/features/truffles/components/TruffleList.vue'
import ComboList from '@/features/combos/components/ComboList.vue'
import AppAbout from '@/shared/components/AppAbout.vue'
import CartDrawer from '@/features/cart/components/CartDrawer.vue'
import CheckoutDialog from '@/features/checkout/components/CheckoutDialog.vue'
import FloatingCartBar from '@/features/cart/components/FloatingCartBar.vue'
</script>

<template>
  <MainLayout>
    <!-- Hero Principal Semelhante à Imagem do Usuário -->
    <AppHero />

    <!-- Breve Texto de Introdução (sem repetição de termos) -->
    <AppIntro />

    <!-- 1º: Linha de Produtos Sortidos (Trufas Individuais e Sabores) -->
    <div id="produtos">
      <TruffleList />
    </div>

    <!-- 2º: Combos e Caixas Especiais -->
    <div id="combos">
      <ComboList />
    </div>

    <!-- 3º: Pequeno Sobre Nós (Sobre a Gratitude) -->
    <AppAbout />
  </MainLayout>

  <!-- Sacolinha Flutuante Fixa no Rodapé (Mockup) -->
  <FloatingCartBar />

  <!-- Gaveta do Carrinho e Checkout -->
  <CartDrawer />
  <CheckoutDialog />

  <!-- Notificações Toast -->
  <Toast position="top-center" />
</template>

<style scoped>
#produtos,
#combos {
  scroll-margin-top: 70px;
}
</style>
