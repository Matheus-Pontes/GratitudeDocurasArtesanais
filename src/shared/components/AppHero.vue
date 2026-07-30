<script setup>
import Button from 'primevue/button'

function irParaCatalogo() {
  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section class="app-hero">
    <figure>
      <img src="../../../public/images/logo.png" alt="Logo" />
    </figure>
    <div class="gr-container app-hero__inner">
      <span class="gr-eyebrow">Feitas à mão, sabor de carinho</span>
      <h1 class="app-hero__title">Adoçando os seus <em>momentos</em></h1>
      <p class="app-hero__desc">
        Trufas artesanais com ingredientes selecionados, prontas para presentear
        ou se presentear. Monte sua caixinha ou escolha um combo especial.
      </p>
      <Button
        label="Ver cardápio"
        icon="pi pi-arrow-down"
        iconPos="right"
        class="app-hero__cta"
        @click="irParaCatalogo"
      />
    </div>
  </section>
</template>

<style scoped>

.gr-container {
  margin: 0; 
}

figure {
  margin: 0;
}

figure > img {
  max-width: 900px;
  width: 100%;
}

@media (width < 750px) {
  .app-hero { 
    flex-wrap: wrap;
  }
}

.app-hero {
  padding: 48px 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-hero__inner {
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.app-hero__title {
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  line-height: 1.1;
}

.app-hero__title em {
  font-style: normal;
  color: var(--gr-pink-500);
}

.app-hero__desc {
  color: var(--gr-cacao-600);
  font-size: 1rem;
  line-height: 1.55;
  max-width: 46ch;
}

.app-hero__cta {
  width: fit-content;
  margin-top: 6px;
}
</style>
