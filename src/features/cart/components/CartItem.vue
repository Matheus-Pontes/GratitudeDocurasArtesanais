<script setup>
import { computed, ref, watch } from 'vue'
import InputNumber from 'primevue/inputnumber'
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
const precoUnitario = computed(() => formatCurrency(props.item.preco))
const composicaoTexto = computed(() => props.item.composicaoTexto || '')
const isCombo = computed(() => props.item.tipo === 'combo')
const limiteComposicao = computed(() => Number(props.item.quantidadeTotal || props.item.quantidade || 0))
const totalComposicao = computed(() =>
  composicaoLocal.value.reduce((sum, entry) => sum + Number(entry.quantidade || 0), 0)
)

function onQuantidadeChange(valor) {
  cart.atualizarQuantidade(props.item.id, valor ?? 0)
}

function atualizarComposicao() {
  cart.atualizarComposicao(props.item.id, composicaoLocal.value)
}

function onComposicaoChange(entry, valor) {
  const novaQuantidade = Math.max(0, Number(valor || 0))
  const totalAtual = composicaoLocal.value.reduce((sum, item) => sum + Number(item.quantidade || 0), 0)

  if (totalAtual > limiteComposicao.value && novaQuantidade > 0) {
    const diferenca = totalAtual - limiteComposicao.value
    entry.quantidade = Math.max(0, novaQuantidade - diferenca)
  } else {
    entry.quantidade = novaQuantidade
  }

  atualizarComposicao()
}

function maxPorEntrada(entry) {
  const totalSemEntrada = composicaoLocal.value.reduce((sum, item) => {
    if (item.id === entry.id) return sum
    return sum + Number(item.quantidade || 0)
  }, 0)

  return Math.max(0, limiteComposicao.value - totalSemEntrada)
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
    <img class="cart-item__img" :src="item.imagem" :alt="item.nome" />
    <div class="cart-item__info">
      <div class="cart-item__info_details">
        <p class="cart-item__nome">{{ item.nome }}</p>
        <span class="cart-item__subtotal">{{ subtotal }}</span>
      </div>
      <p v-if="composicaoTexto" class="cart-item__details">{{ composicaoTexto }}</p>
      <p class="cart-item__preco-unit">{{ precoUnitario }} / un.</p>

      <div v-if="isCombo" class="cart-item__combo-editor">
        <div class="cart-item__combo-editor-header">
          <span>Editar sabores</span>
          <strong>{{ totalComposicao }}/{{ limiteComposicao }}</strong>
        </div>
        <div v-for="entry in composicaoLocal" :key="entry.id" class="cart-item__combo-row">
          <span>{{ entry.nome }}</span>
          <InputNumber
            v-model="entry.quantidade"
            :min="0"
            :max="maxPorEntrada(entry)"
            showButtons
            buttonLayout="horizontal"
            inputClass="cart-item__qty-input"
            @update:modelValue="(valor) => onComposicaoChange(entry, valor)"
          />
        </div>
      </div>

      <div class="cart-item__controls">
        <InputNumber
          :modelValue="item.quantidade"
          @update:modelValue="onQuantidadeChange"
          :min="0"
          :max="99"
          showButtons
          buttonLayout="horizontal"
          inputClass="cart-item__qty-input"
        />
        <button
          class="cart-item__remove"
          type="button"
          @click="cart.remover(item.id)"
          :aria-label="`Remover ${item.nome} do carrinho`"
        >
          <i class="pi pi-trash"></i>
        </button>
      </div>
    </div>
  </li>
</template>

<style scoped>
.cart-item {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 12px;
  align-items: start;
  padding: 12px 0;
  border-bottom: 1px solid var(--gr-cream-300);
}

.cart-item__img {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  object-fit: cover;
}

.cart-item__nome {
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.25;
}

.cart-item__details {
  font-size: 0.72rem;
  color: var(--gr-cacao-600);
  margin-top: 4px;
  line-height: 1.35;
}

.cart-item__preco-unit {
  font-size: 0.75rem;
  color: var(--gr-cacao-600);
  margin-top: 2px;
}

.cart-item__combo-editor {
  margin-top: 8px;
  padding: 8px;
  border: 1px solid var(--gr-cream-300);
  border-radius: var(--gr-radius-sm);
  background: var(--gr-cream-100);
}

.cart-item__combo-editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.72rem;
  color: var(--gr-cacao-600);
  margin-bottom: 6px;
}

.cart-item__combo-editor-header strong {
  color: var(--gr-berry-700);
}

.cart-item__combo-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  margin-bottom: 4px;
}

.cart-item__controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.cart-item__remove {
  border: none;
  background: transparent;
  color: var(--gr-cacao-600);
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
}

.cart-item__remove:hover {
  color: var(--gr-berry-700);
  background: var(--gr-cream-200);
}

.cart-item__subtotal {
  font-weight: 700;
  color: var(--gr-berry-700);
  font-size: 0.9rem;
  white-space: nowrap;
}

.cart-item__info_details {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

:deep(.cart-item__qty-input) {
  width: 44px;
  text-align: center;
  padding: 4px 0;
}
</style>
