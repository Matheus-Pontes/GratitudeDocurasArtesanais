<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import { useToast } from 'primevue/usetoast'
import { useCartStore } from '@/features/cart/store/cartStore'
import { useTruffleStore } from '@/features/truffles/store/truffleStore'
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
const truffleStore = useTruffleStore()

const selecoes = ref({})

const precoFormatado = computed(() => formatCurrency(props.combo.preco))
const trufasDisponiveis = computed(() =>
  truffleStore.items.filter((truffle) => truffle.linha === 'tradicional' && truffle.disponivelEmCombo)
)
const totalSelecionado = computed(() =>
  Object.values(selecoes.value).reduce((sum, valor) => sum + Number(valor || 0), 0)
)
const estaCompleto = computed(() => totalSelecionado.value === props.combo.quantidade)
const textoSelecao = computed(() => {
  if (!trufasDisponiveis.value.length) return 'Carregando sabores...'

  const restante = props.combo.quantidade - totalSelecionado.value
  if (restante > 0) return `Faltam ${restante} trufas`
  if (restante < 0) return `Selecione até ${props.combo.quantidade} trufas`
  return 'Combo pronto'
})

function resetarSelecoes() {
  selecoes.value = Object.fromEntries(
    trufasDisponiveis.value.map((truffle) => [truffle.id, 0])
  )
}

function maxPorEntrada(entry) {
  const totalSemEntrada = composicao.value.reduce((sum, item) => {
    if (item.id === entry.id) return sum
    return sum + Number(item.quantidade || 0)
  }, 0)

  return Math.max(0, limiteComposicao.value - totalSemEntrada)
}

watch(
  trufasDisponiveis,
  (trufas) => {
    if (!trufas.length) return

    if (!Object.keys(selecoes.value).length) {
      resetarSelecoes()
      return
    }

    const proximasSelecoes = {}
    trufas.forEach((truffle) => {
      proximasSelecoes[truffle.id] = Number(selecoes.value[truffle.id] || 0)
    })
    selecoes.value = proximasSelecoes
  },
  { immediate: true }
)

onMounted(() => {
  if (!truffleStore.items.length) {
    truffleStore.load()
  }
})

function adicionarAoCarrinho() {
  if (!estaCompleto.value) {
    toast.add({
      severity: 'warn',
      summary: 'Selecione as trufas',
      detail: `Escolha exatamente ${props.combo.quantidade} trufas para este combo.`,
      life: 2600
    })
    return
  }

  const composicao = trufasDisponiveis.value.map((truffle) => ({
    id: truffle.id,
    nome: truffle.nome,
    quantidade: Number(selecoes.value[truffle.id] || 0)
  }))

  const composicaoTexto = composicao
    .filter((item) => item.quantidade > 0)
    .map((item) => `${item.quantidade}x ${item.nome}`)
    .join(', ')
  const composicaoSignature = composicao.map((item) => `${item.id}:${item.quantidade}`).join('|')
  const itemId = `${props.combo.id}-${composicaoSignature || 'sem-selecao'}`

  cart.adicionar({
    id: itemId,
    tipo: 'combo',
    nome: props.combo.nome,
    imagem: props.combo.imagem,
    preco: props.combo.preco,
    peso: props.combo.pesoPorUnidade,
    composicao,
    composicaoTexto,
    quantidadeTotal: props.combo.quantidade
  })

  toast.add({
    severity: 'success',
    summary: 'Combo adicionado',
    detail: composicaoTexto || props.combo.nome,
    life: 2200
  })

  resetarSelecoes()
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

      <div v-if="trufasDisponiveis.length" class="combo-card__selectors">
        <div class="combo-card__selector-head">
          <span>Monte seu combo</span>
          <strong>{{ textoSelecao }}</strong>
        </div>

        <div v-for="truffle in trufasDisponiveis" :key="truffle.id" class="combo-card__selector">
          <span class="combo-card__selector-name">{{ truffle.nome }}</span>
          <InputNumber
            v-model="selecoes[truffle.id]"
            :min="0"
            :max="combo.quantidade"
            showButtons
            buttonLayout="horizontal"
            inputClass="combo-card__qty-input"
          />
        </div>
      </div>
    </div>

    <Button
      class="combo-card__btn"
      :label="trufasDisponiveis.length ? (estaCompleto ? 'Adicionar' : 'Selecione as trufas') : 'Carregando...'"
      icon="pi pi-shopping-bag"
      :disabled="trufasDisponiveis.length > 0 && !estaCompleto"
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

.combo-card__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
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

.combo-card__selectors {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border: 1px solid var(--gr-cream-300);
  border-radius: var(--gr-radius-sm);
  background: var(--gr-cream-100);
}

.combo-card__selector-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  color: var(--gr-cacao-600);
}

.combo-card__selector-head strong {
  color: var(--gr-berry-700);
}

.combo-card__selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
}

.combo-card__selector-name {
  text-align: left;
  flex: 1;
}

.combo-card__btn {
  width: 100%;
  justify-content: center;
}

:deep(.combo-card__qty-input) {
  width: 56px;
  text-align: center;
}
</style>
