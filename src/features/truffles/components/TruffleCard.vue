<script setup>
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import InputNumber from 'primevue/inputnumber'
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
const subtotalFormatado = computed(() =>
  formatCurrency(props.truffle.preco * quantidade.value)
)

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
    summary: 'Adicionado ao carrinho',
    detail: `${quantidade.value}x ${props.truffle.nome}`,
    life: 2200
  })
  quantidade.value = 1
}
</script>

<template>
  <article class="truffle-card" :class="{ 'truffle-card--premium': isPremium }">
    <div class="truffle-card__media">
      <img :src="truffle.imagem" :alt="truffle.nome" loading="lazy" />
      <Tag
        v-if="isPremium"
        class="truffle-card__badge"
        severity="warn"
        icon="pi pi-crown"
        value="Premium"
      />
    </div>

    <div class="truffle-card__body">
      <h3 class="truffle-card__title">{{ truffle.nome }}</h3>
      <p class="truffle-card__desc">{{ truffle.descricao }}</p>

      <div class="truffle-card__meta">
        <span class="truffle-card__peso">{{ truffle.peso }}</span>
        <span class="truffle-card__preco">
          {{ precoFormatado }}
          <small>{{ truffle.unidade }}</small>
        </span>
      </div>
    </div>

    <div class="truffle-card__footer">
      <InputNumber
        v-model="quantidade"
        :min="1"
        :max="99"
        showButtons
        buttonLayout="horizontal"
        inputClass="truffle-card__qty-input"
        decrementButtonClass="p-button-outlined"
        incrementButtonClass="p-button-outlined"
        aria-label="Quantidade"
      />
      <Button
        class="truffle-card__add-btn"
        :label="`Adicionar · ${subtotalFormatado}`"
        icon="pi pi-shopping-bag"
        @click="adicionarAoCarrinho"
      />
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
  box-shadow: var(--gr-shadow-card);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  height: 100%;
}

.truffle-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--gr-shadow-card-hover);
}

.truffle-card--premium {
  outline: 2px solid var(--gr-gold-500);
  outline-offset: -2px;
}

.truffle-card__media {
  position: relative;
  aspect-ratio: 4 / 3;
  background: var(--gr-cream-200);
}

.truffle-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.truffle-card__badge {
  position: absolute;
  top: 10px;
  left: 10px;
}

.truffle-card__body {
  padding: 16px 18px 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.truffle-card__title {
  font-size: 1.05rem;
  line-height: 1.25;
}

.truffle-card__desc {
  font-size: 0.85rem;
  color: var(--gr-cacao-600);
  line-height: 1.4;
  min-height: 2.5em;
}

.truffle-card__meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 6px;
}

.truffle-card__peso {
  font-size: 0.75rem;
  color: var(--gr-cacao-600);
  background: var(--gr-cream-200);
  padding: 2px 8px;
  border-radius: 999px;
}

.truffle-card__preco {
  font-family: var(--gr-font-display);
  font-weight: 700;
  color: var(--gr-berry-700);
  font-size: 1.15rem;
}

.truffle-card__preco small {
  font-family: var(--gr-font-body);
  font-weight: 400;
  font-size: 0.65rem;
  color: var(--gr-cacao-600);
  margin-left: 2px;
}

.truffle-card__footer {
  padding: 12px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.truffle-card__add-btn {
  width: 100%;
  justify-content: center;
}

:deep(.truffle-card__qty-input) {
  text-align: center;
  width: 100%;
}
</style>
