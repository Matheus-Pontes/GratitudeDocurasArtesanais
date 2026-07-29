<script setup>
import { computed } from 'vue'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { useCartStore } from '@/features/cart/store/cartStore'
import { formatCurrency } from '@/shared/utils/currency'

const props = defineProps({
  combo: {
    type: Object,
    required: true
  },
  destaque: {
    type: Boolean,
    default: false
  }
})

const cart = useCartStore()
const toast = useToast()

const precoFormatado = computed(() => formatCurrency(props.combo.preco))

function adicionarAoCarrinho() {
  cart.adicionar({
    id: props.combo.id,
    tipo: 'combo',
    nome: props.combo.nome,
    imagem: props.combo.imagem,
    preco: props.combo.preco,
    peso: props.combo.pesoPorUnidade
  })
  toast.add({
    severity: 'success',
    summary: 'Combo adicionado',
    detail: props.combo.nome,
    life: 2200
  })
}
</script>

<template>
  <article class="combo-card" :class="{ 'combo-card--destaque': destaque }">
    <div v-if="destaque" class="combo-card__ribbon">Mais pedido</div>
    <div class="combo-card__media">
      <img :src="combo.imagem" :alt="combo.nome" loading="lazy" />
    </div>
    <div class="combo-card__body">
      <h3 class="combo-card__title">{{ combo.nome }}</h3>
      <p class="combo-card__peso"><i class="pi pi-heart-fill"></i> {{ combo.pesoPorUnidade }}</p>
      <p class="combo-card__preco">{{ precoFormatado }}</p>
    </div>
    <Button
      class="combo-card__btn"
      label="Adicionar"
      icon="pi pi-shopping-bag"
      @click="adicionarAoCarrinho"
    />
  </article>
</template>

<style scoped>
.combo-card {
  position: relative;
  background: #fff;
  border-radius: var(--gr-radius-md);
  padding: 18px;
  text-align: center;
  box-shadow: var(--gr-shadow-card);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.combo-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--gr-shadow-card-hover);
}

.combo-card--destaque {
  border: 2px solid var(--gr-gold-500);
}

.combo-card__ribbon {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gr-gold-500);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 4px 14px;
  border-radius: 999px;
  box-shadow: 0 4px 10px rgba(201, 154, 63, 0.4);
}

.combo-card__media {
  aspect-ratio: 1.4 / 1;
  border-radius: var(--gr-radius-sm);
  overflow: hidden;
  background: var(--gr-cream-200);
}

.combo-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.combo-card__title {
  font-size: 1.1rem;
}

.combo-card__peso {
  font-size: 0.78rem;
  color: var(--gr-cacao-600);
}

.combo-card__peso i {
  color: var(--gr-pink-500);
  font-size: 0.65rem;
  margin-right: 3px;
}

.combo-card__preco {
  font-family: var(--gr-font-display);
  font-weight: 700;
  font-size: 1.6rem;
  color: var(--gr-berry-700);
}

.combo-card__btn {
  width: 100%;
  justify-content: center;
}
</style>
