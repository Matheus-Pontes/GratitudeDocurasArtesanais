<script setup>
import { computed, onMounted, ref, watch } from 'vue'
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

// Armazena as quantidades por ID de trufa
const selecoes = ref({})

const precoFormatado = computed(() => formatCurrency(props.combo.preco))
const trufasDisponiveis = computed(() =>
  truffleStore.items.filter((truffle) => truffle.linha === 'tradicional' && truffle.disponivelEmCombo)
)

const totalSelecionado = computed(() =>
  Object.values(selecoes.value).reduce((sum, valor) => sum + Number(valor || 0), 0)
)

const restante = computed(() => props.combo.quantidade - totalSelecionado.value)
const estaCompleto = computed(() => totalSelecionado.value === props.combo.quantidade)

function resetarSelecoes() {
  const novaselecao = {}
  trufasDisponiveis.value.forEach((t) => {
    novaselecao[t.id] = 0
  })
  selecoes.value = novaselecao
}

function preencherSortido() {
  const disponiveis = trufasDisponiveis.value
  if (!disponiveis.length) return

  const novaselecao = {}
  disponiveis.forEach((t) => {
    novaselecao[t.id] = 0
  })

  // Distribui equilibradamente
  const qtdTotal = props.combo.quantidade
  for (let i = 0; i < qtdTotal; i++) {
    const trufa = disponiveis[i % disponiveis.length]
    novaselecao[trufa.id] = (novaselecao[trufa.id] || 0) + 1
  }

  selecoes.value = novaselecao

  toast.add({
    severity: 'info',
    summary: 'Sugestão Sortida Aplicada',
    detail: `Selecionamos ${props.combo.quantidade} trufas tradicionais variadas para você!`,
    life: 2000
  })
}

function alterarQuantidade(truffleId, delta) {
  const atual = Number(selecoes.value[truffleId] || 0)
  const novo = atual + delta
  if (novo < 0) return

  // Não pode ultrapassar a quantidade do combo
  if (delta > 0 && totalSelecionado.value >= props.combo.quantidade) return

  selecoes.value[truffleId] = novo
}

watch(
  trufasDisponiveis,
  (trufas) => {
    if (!trufas.length) return
    const proximas = {}
    trufas.forEach((t) => {
      proximas[t.id] = Number(selecoes.value[t.id] || 0)
    })
    selecoes.value = proximas
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
      summary: 'Monte seu combo',
      detail: `Escolha exatamente ${props.combo.quantidade} trufas (faltam ${restante.value}).`,
      life: 2500
    })
    return
  }

  const composicao = trufasDisponiveis.value
    .filter((t) => Number(selecoes.value[t.id] || 0) > 0)
    .map((t) => ({
      id: t.id,
      nome: t.nome,
      quantidade: Number(selecoes.value[t.id] || 0)
    }))

  const composicaoTexto = composicao
    .map((item) => `${item.quantidade}x ${item.nome}`)
    .join(', ')

  const composicaoSignature = composicao
    .map((item) => `${item.id}:${item.quantidade}`)
    .join('|')

  const itemId = `${props.combo.id}-${composicaoSignature || 'sortido'}`

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
    summary: 'Combo adicionado à Sacolinha!',
    detail: `${props.combo.nome} (${composicaoTexto})`,
    life: 2500
  })

  resetarSelecoes()
}
</script>

<template>
  <article class="combo-card" :class="{ 'combo-card--destaque': destaque }">
    <div v-if="destaque" class="combo-card__ribbon">
      <i class="pi pi-star-fill"></i> Mais Pedido
    </div>

    <div class="combo-card__media">
      <img :src="combo.imagem" :alt="combo.nome" loading="lazy" />
      <span class="combo-card__badge-unidades">
        {{ combo.quantidade }} Unidades
      </span>
    </div>

    <div class="combo-card__body">
      <div class="combo-card__header-info">
        <h3 class="combo-card__title">{{ combo.nome }}</h3>
        <span class="combo-card__peso">
          <i class="pi pi-check"></i> {{ combo.pesoPorUnidade }}
        </span>
      </div>

      <div class="combo-card__price-wrap">
        <span class="combo-card__price">{{ precoFormatado }}</span>
        <span class="combo-card__price-sub">a caixinha</span>
      </div>

      <!-- Seletor de Sabores -->
      <div class="combo-card__selector-box">
        <div class="combo-card__selector-head">
          <div class="combo-card__selector-title">
            <span>Monte os sabores:</span>
            <strong :class="{ 'combo-card__status--complete': estaCompleto }">
              {{ totalSelecionado }}/{{ combo.quantidade }} selecionadas
            </strong>
          </div>

          <div class="combo-card__quick-actions">
            <button
              type="button"
              class="combo-card__sortido-btn"
              title="Preenche automaticamente com sabores sortidos variados"
              @click="preencherSortido"
            >
              <i class="pi pi-sparkles"></i> Sugestão Sortida
            </button>
            <button
              v-if="totalSelecionado > 0"
              type="button"
              class="combo-card__clear-btn"
              title="Limpar seleção"
              @click="resetarSelecoes"
            >
              Limpar
            </button>
          </div>
        </div>

        <div class="combo-card__flavors-list">
          <div
            v-for="truffle in trufasDisponiveis"
            :key="truffle.id"
            class="combo-card__flavor-row"
            :class="{ 'combo-card__flavor-row--selected': (selecoes[truffle.id] || 0) > 0 }"
          >
            <span class="combo-card__flavor-name">{{ truffle.nome }}</span>
            <div class="combo-card__flavor-stepper">
              <button
                type="button"
                class="combo-card__step-btn"
                :disabled="(selecoes[truffle.id] || 0) <= 0"
                aria-label="Diminuir sabor"
                @click="alterarQuantidade(truffle.id, -1)"
              >
                -
              </button>
              <span class="combo-card__step-val">
                {{ selecoes[truffle.id] || 0 }}
              </span>
              <button
                type="button"
                class="combo-card__step-btn"
                :disabled="totalSelecionado >= combo.quantidade"
                aria-label="Aumentar sabor"
                @click="alterarQuantidade(truffle.id, 1)"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="combo-card__footer">
      <button
        class="combo-card__btn"
        type="button"
        :class="{ 'combo-card__btn--ready': estaCompleto }"
        :disabled="!estaCompleto"
        @click="adicionarAoCarrinho"
      >
        <i class="pi pi-shopping-bag"></i>
        <span v-if="estaCompleto">Adicionar Combo ({{ precoFormatado }})</span>
        <span v-else>Faltam {{ restante }} trufas</span>
      </button>
    </div>
  </article>
</template>

<style scoped>
.combo-card {
  position: relative;
  background: #fff;
  border-radius: var(--gr-radius-md);
  border: 1px solid rgba(220, 195, 160, 0.4);
  box-shadow: var(--gr-shadow-card);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  height: 100%;
}

.combo-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--gr-shadow-card-hover);
  border-color: rgba(197, 154, 78, 0.5);
}

.combo-card--destaque {
  border: 2px solid var(--gr-gold-500);
}

.combo-card__ribbon {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 3;
  background: linear-gradient(135deg, #c59a4e, #8b621e);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 9999px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.combo-card__media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--gr-cream-200);
}

.combo-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.combo-card:hover .combo-card__media img {
  transform: scale(1.05);
}

.combo-card__badge-unidades {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(46, 23, 29, 0.85);
  backdrop-filter: blur(6px);
  color: var(--gr-gold-300);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 9999px;
  border: 1px solid rgba(197, 154, 78, 0.3);
}

.combo-card__body {
  padding: 16px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.combo-card__header-info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.combo-card__title {
  font-family: var(--gr-font-display);
  font-size: 1.25rem;
  color: var(--gr-wine-900);
}

.combo-card__peso {
  font-size: 0.75rem;
  color: var(--gr-cacao-600);
  display: flex;
  align-items: center;
  gap: 4px;
}

.combo-card__peso i {
  color: var(--gr-gold-700);
  font-size: 0.65rem;
}

.combo-card__price-wrap {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding-bottom: 8px;
  border-bottom: 1px dashed rgba(220, 195, 160, 0.4);
}

.combo-card__price {
  font-family: var(--gr-font-display);
  font-weight: 700;
  font-size: 1.65rem;
  color: var(--gr-wine-900);
}

.combo-card__price-sub {
  font-size: 0.75rem;
  color: var(--gr-cacao-600);
}

/* Caixa de Seleção dos Sabores */
.combo-card__selector-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--gr-cream-100);
  border: 1px solid rgba(220, 195, 160, 0.5);
  border-radius: var(--gr-radius-sm);
  padding: 12px;
}

.combo-card__selector-head {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.combo-card__selector-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--gr-cacao-700);
}

.combo-card__selector-title strong {
  color: var(--gr-wine-800);
  font-weight: 700;
  font-size: 0.78rem;
}

.combo-card__status--complete {
  color: #1b7a42 !important;
}

.combo-card__quick-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.combo-card__sortido-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(197, 154, 78, 0.15);
  border: 1px solid rgba(197, 154, 78, 0.4);
  color: var(--gr-gold-700);
  border-radius: 9999px;
  padding: 3px 10px;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.combo-card__sortido-btn:hover {
  background: var(--gr-gold-500);
  color: #fff;
}

.combo-card__clear-btn {
  background: transparent;
  border: none;
  color: var(--gr-cacao-600);
  font-size: 0.7rem;
  cursor: pointer;
  text-decoration: underline;
}

.combo-card__flavors-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.combo-card__flavor-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid rgba(220, 195, 160, 0.3);
  transition: all 0.2s ease;
}

.combo-card__flavor-row--selected {
  border-color: rgba(197, 154, 78, 0.6);
  background: #fffdfa;
}

.combo-card__flavor-name {
  font-size: 0.82rem;
  color: var(--gr-wine-900);
  font-weight: 500;
}

.combo-card__flavor-stepper {
  display: flex;
  align-items: center;
  gap: 2px;
}

.combo-card__step-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid rgba(220, 195, 160, 0.6);
  background: #fff;
  color: var(--gr-wine-900);
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.combo-card__step-btn:hover:not(:disabled) {
  background: var(--gr-wine-900);
  color: #fff;
  border-color: var(--gr-wine-900);
}

.combo-card__step-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.combo-card__step-val {
  min-width: 22px;
  text-align: center;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--gr-wine-900);
}

.combo-card__footer {
  padding: 0 16px 16px;
}

.combo-card__btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--gr-cream-300);
  color: var(--gr-cacao-600);
  border: 1px solid rgba(220, 195, 160, 0.5);
  padding: 12px;
  border-radius: 9999px;
  font-family: var(--gr-font-body);
  font-size: 0.92rem;
  font-weight: 600;
  cursor: not-allowed;
  transition: all 0.25s ease;
}

.combo-card__btn--ready {
  background: var(--gr-wine-900);
  color: #fff;
  border-color: rgba(235, 211, 155, 0.4);
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(56, 10, 20, 0.25);
}

.combo-card__btn--ready:hover {
  background: var(--gr-wine-800);
  border-color: var(--gr-gold-400);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(56, 10, 20, 0.35);
}
</style>
