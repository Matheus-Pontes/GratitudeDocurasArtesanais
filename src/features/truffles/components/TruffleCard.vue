<script setup>
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'
import { useCartStore } from '@/features/cart/store/cartStore'
import { formatCurrency } from '@/shared/utils/currency'

const props = defineProps({
  truffle: {
    type: Object,
    required: true
  }
})

const cart = useCartStore()
const toast = useToast()
const quantidade = ref(1)

const isPremium = computed(() => props.truffle.linha === 'premium')
const precoFormatado = computed(() => formatCurrency(props.truffle.preco))

function incrementar() {
  if (quantidade.value < 99) quantidade.value += 1
}

function decrementar() {
  if (quantidade.value > 1) quantidade.value -= 1
}

function adicionarAoCarrinho() {
  cart.adicionar(
    {
      id: props.truffle.id,
      tipo: 'trufa',
      nome: props.truffle.nome,
      imagem: props.truffle.imagem,
      preco: props.truffle.preco,
      peso: props.truffle.peso
    },
    quantidade.value
  )
  toast.add({
    severity: 'success',
    summary: 'Adicionado à Sacolinha',
    detail: `${quantidade.value}x ${props.truffle.nome}`,
    life: 2000
  })
  quantidade.value = 1
}
</script>

<template>
  <article class="truffle-card" :class="{ 'truffle-card--premium': isPremium }">
    <div class="truffle-card__media">
      <img :src="truffle.imagem" :alt="truffle.nome" loading="lazy" />
      <span v-if="isPremium" class="truffle-card__badge-premium">
        <i class="pi pi-crown"></i> Linha Premium
      </span>
      <span v-else class="truffle-card__badge-trad">
        Tradicional
      </span>
    </div>

    <div class="truffle-card__body">
      <div class="truffle-card__head">
        <h3 class="truffle-card__title">{{ truffle.nome }}</h3>
        <span class="truffle-card__peso">{{ truffle.peso }}</span>
      </div>
      <p class="truffle-card__desc">{{ truffle.descricao }}</p>
      
      <div class="truffle-card__price-row">
        <div class="truffle-card__price">
          <strong>{{ precoFormatado }}</strong>
          <small>/ unidade</small>
        </div>
      </div>
    </div>

    <div class="truffle-card__footer">
      <div class="truffle-card__qty-control" aria-label="Controle de quantidade">
        <button
          type="button"
          class="truffle-card__qty-btn"
          aria-label="Diminuir"
          :disabled="quantidade <= 1"
          @click="decrementar"
        >
          -
        </button>
        <span class="truffle-card__qty-val">{{ quantidade }}</span>
        <button
          type="button"
          class="truffle-card__qty-btn"
          aria-label="Aumentar"
          @click="incrementar"
        >
          +
        </button>
      </div>

      <button
        class="truffle-card__add-btn"
        type="button"
        @click="adicionarAoCarrinho"
        :aria-label="`Adicionar ${truffle.nome} à sacolinha`"
      >
        <i class="pi pi-shopping-bag"></i>
        <span>Adicionar</span>
      </button>
    </div>
  </article>
</template>

<style scoped>
.truffle-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: var(--gr-radius-md);
  overflow: hidden;
  border: 1px solid rgba(220, 195, 160, 0.3);
  box-shadow: var(--gr-shadow-card);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  height: 100%;
  position: relative;
}

.truffle-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--gr-shadow-card-hover);
  border-color: rgba(197, 154, 78, 0.5);
}

.truffle-card--premium {
  border: 1px solid rgba(197, 154, 78, 0.45);
}

.truffle-card__media {
  position: relative;
  aspect-ratio: 16 / 11;
  background: var(--gr-cream-200);
  overflow: hidden;
}

.truffle-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.truffle-card:hover .truffle-card__media img {
  transform: scale(1.05);
}

.truffle-card__badge-premium {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #c59a4e, #8b621e);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 4px 10px;
  border-radius: 9999px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  gap: 4px;
}

.truffle-card__badge-trad {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--gr-wine-900);
  font-size: 0.65rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 9999px;
  border: 1px solid rgba(220, 195, 160, 0.4);
}

.truffle-card__body {
  padding: 16px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.truffle-card__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 6px;
}

.truffle-card__title {
  font-family: var(--gr-font-display);
  font-size: 1.15rem;
  color: var(--gr-wine-900);
  margin: 0;
  line-height: 1.2;
}

.truffle-card__peso {
  font-size: 0.75rem;
  color: var(--gr-gold-700);
  font-weight: 600;
  background: var(--gr-cream-200);
  padding: 2px 6px;
  border-radius: 6px;
}

.truffle-card__desc {
  font-size: 0.85rem;
  color: var(--gr-cacao-600);
  line-height: 1.45;
  flex: 1;
}

.truffle-card__price-row {
  margin-top: 6px;
  padding-top: 8px;
  border-top: 1px dashed rgba(220, 195, 160, 0.4);
}

.truffle-card__price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.truffle-card__price strong {
  font-family: var(--gr-font-display);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--gr-wine-900);
}

.truffle-card__price small {
  font-size: 0.72rem;
  color: var(--gr-cacao-600);
}

.truffle-card__footer {
  padding: 0 16px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.truffle-card__qty-control {
  display: flex;
  align-items: center;
  background: var(--gr-cream-100);
  border: 1px solid rgba(220, 195, 160, 0.5);
  border-radius: 9999px;
  padding: 2px;
}

.truffle-card__qty-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: #fff;
  color: var(--gr-wine-900);
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.truffle-card__qty-btn:hover:not(:disabled) {
  background: var(--gr-wine-900);
  color: #fff;
}

.truffle-card__qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.truffle-card__qty-val {
  min-width: 24px;
  text-align: center;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--gr-wine-900);
}

.truffle-card__add-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: var(--gr-wine-900);
  color: #fff;
  border: 1px solid rgba(235, 211, 155, 0.3);
  padding: 8px 12px;
  border-radius: 9999px;
  font-family: var(--gr-font-body);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(56, 10, 20, 0.15);
}

.truffle-card__add-btn:hover {
  background: var(--gr-wine-800);
  border-color: var(--gr-gold-400);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(56, 10, 20, 0.25);
}

.truffle-card__add-btn i {
  color: var(--gr-gold-300);
  font-size: 0.85rem;
}
</style>
