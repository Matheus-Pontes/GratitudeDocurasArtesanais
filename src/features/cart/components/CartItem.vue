<script setup>
import { computed, ref, watch } from 'vue'
import { useCartStore } from '../store/cartStore'
import { formatCurrency } from '@/shared/utils/currency'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const cart = useCartStore()
const composicaoLocal = ref([])

const subtotal = computed(() => formatCurrency(props.item.preco * props.item.quantidade))
const composicaoTexto = computed(() => props.item.composicaoTexto || '')
const isCombo = computed(() => props.item.tipo === 'combo')
const limiteComposicao = computed(() => Number(props.item.quantidadeTotal || props.item.quantidade || 0))
const totalComposicao = computed(() =>
  composicaoLocal.value.reduce((sum, entry) => sum + Number(entry.quantidade || 0), 0)
)

function alterarQtdItem(delta) {
  const nova = props.item.quantidade + delta
  if (nova <= 0) {
    cart.remover(props.item.id)
  } else {
    cart.atualizarQuantidade(props.item.id, nova)
  }
}

function atualizarComposicao() {
  cart.atualizarComposicao(props.item.id, composicaoLocal.value)
}

function alterarQtdComposicao(entry, delta) {
  const nova = Math.max(0, Number(entry.quantidade || 0) + delta)
  const outros = totalComposicao.value - Number(entry.quantidade || 0)

  if (delta > 0 && outros + nova > limiteComposicao.value) {
    return
  }

  entry.quantidade = nova
  atualizarComposicao()
}

watch(
  () => props.item.composicao,
  (valor) => {
    if (Array.isArray(valor)) {
      composicaoLocal.value = valor.map((entry) => ({ ...entry }))
    }
  },
  { immediate: true }
)
</script>

<template>
  <li class="cart-item">
    <div class="cart-item__main">
      <div class="cart-item__media">
        <img class="cart-item__img" :src="item.imagem" :alt="item.nome" />
      </div>

      <div class="cart-item__info">
        <div class="cart-item__head">
          <h4 class="cart-item__nome">{{ item.nome }}</h4>
          <span class="cart-item__subtotal">{{ subtotal }}</span>
        </div>

        <p v-if="composicaoTexto" class="cart-item__details">
          {{ composicaoTexto }}
        </p>

        <div class="cart-item__actions">
          <div class="cart-item__stepper">
            <button
              type="button"
              class="cart-item__step-btn"
              @click="alterarQtdItem(-1)"
              :aria-label="`Diminuir quantidade de ${item.nome}`"
            >
              -
            </button>
            <span class="cart-item__step-val">{{ item.quantidade }}</span>
            <button
              type="button"
              class="cart-item__step-btn"
              @click="alterarQtdItem(1)"
              :aria-label="`Aumentar quantidade de ${item.nome}`"
            >
              +
            </button>
          </div>

          <button
            class="cart-item__remove-btn"
            type="button"
            @click="cart.remover(item.id)"
            :aria-label="`Remover ${item.nome}`"
          >
            <i class="pi pi-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Editor de Sabores se for Combo -->
    <div v-if="isCombo" class="cart-item__combo-editor">
      <div class="cart-item__combo-header">
        <span>Sabores selecionados</span>
        <strong :class="{ 'cart-item__combo-ok': totalComposicao === limiteComposicao }">
          {{ totalComposicao }}/{{ limiteComposicao }}
        </strong>
      </div>

      <div class="cart-item__combo-list">
        <div v-for="entry in composicaoLocal" :key="entry.id" class="cart-item__combo-row">
          <span class="cart-item__combo-name">{{ entry.nome }}</span>
          <div class="cart-item__combo-stepper">
            <button
              type="button"
              class="cart-item__micro-btn"
              :disabled="Number(entry.quantidade || 0) <= 0"
              @click="alterarQtdComposicao(entry, -1)"
            >
              -
            </button>
            <span class="cart-item__micro-val">{{ entry.quantidade || 0 }}</span>
            <button
              type="button"
              class="cart-item__micro-btn"
              :disabled="totalComposicao >= limiteComposicao"
              @click="alterarQtdComposicao(entry, 1)"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<style scoped>
.cart-item {
  padding: 14px 0;
  border-bottom: 1px solid rgba(220, 195, 160, 0.4);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cart-item__main {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.cart-item__media {
  width: 60px;
  height: 60px;
  border-radius: var(--gr-radius-sm);
  overflow: hidden;
  background: var(--gr-cream-200);
  flex-shrink: 0;
}

.cart-item__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cart-item__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 6px;
}

.cart-item__nome {
  font-family: var(--gr-font-display);
  font-weight: 600;
  font-size: 0.98rem;
  color: var(--gr-wine-900);
  line-height: 1.2;
}

.cart-item__subtotal {
  font-family: var(--gr-font-display);
  font-weight: 700;
  color: var(--gr-wine-900);
  font-size: 1rem;
}

.cart-item__details {
  font-size: 0.76rem;
  color: var(--gr-cacao-600);
  line-height: 1.35;
}

.cart-item__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.cart-item__stepper {
  display: flex;
  align-items: center;
  gap: 2px;
  background: var(--gr-cream-100);
  border: 1px solid rgba(220, 195, 160, 0.5);
  border-radius: 9999px;
  padding: 2px;
}

.cart-item__step-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: #fff;
  color: var(--gr-wine-900);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.cart-item__step-btn:hover {
  background: var(--gr-wine-900);
  color: #fff;
}

.cart-item__step-val {
  min-width: 24px;
  text-align: center;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--gr-wine-900);
}

.cart-item__remove-btn {
  background: transparent;
  border: none;
  color: var(--gr-cacao-400);
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: color 0.2s ease;
}

.cart-item__remove-btn:hover {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.08);
}

/* Editor de Sabores do Combo */
.cart-item__combo-editor {
  background: var(--gr-cream-100);
  border: 1px solid rgba(220, 195, 160, 0.4);
  border-radius: var(--gr-radius-sm);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cart-item__combo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.72rem;
  color: var(--gr-cacao-600);
  margin-bottom: 2px;
}

.cart-item__combo-header strong {
  color: var(--gr-wine-800);
}

.cart-item__combo-ok {
  color: #1b7a42 !important;
}

.cart-item__combo-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cart-item__combo-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
  background: #fff;
  padding: 3px 6px;
  border-radius: 6px;
  border: 1px solid rgba(220, 195, 160, 0.3);
}

.cart-item__combo-name {
  color: var(--gr-wine-900);
}

.cart-item__combo-stepper {
  display: flex;
  align-items: center;
  gap: 2px;
}

.cart-item__micro-btn {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid rgba(220, 195, 160, 0.5);
  background: #fff;
  color: var(--gr-wine-900);
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-item__micro-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.cart-item__micro-val {
  min-width: 18px;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--gr-wine-900);
}
</style>
