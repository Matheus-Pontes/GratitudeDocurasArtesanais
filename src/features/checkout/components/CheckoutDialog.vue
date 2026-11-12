<script setup>
import { computed, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { useToast } from 'primevue/usetoast'
import { useCartStore } from '@/features/cart/store/cartStore'
import { useCheckoutStore } from '../store/checkoutStore'
import { formatCurrency } from '@/shared/utils/currency'
import { mascaraCep, mascaraTelefone } from '../../../shared/utils/masks'

const cart = useCartStore()
const checkout = useCheckoutStore()
const toast = useToast()

// Etapa atual: 1 = Contato, 2 = Entrega/Retirada, 3 = Pagamento & Confirmação
const etapaAtual = ref(1)

const totalDocesFormatado = computed(() => formatCurrency(cart.totalPreco))
const frete = ref(0)
const totalFreteFormatado = computed(() => (frete.value > 0 ? formatCurrency(frete.value) : 'Grátis'))
const totalFinalFormatado = computed(() => formatCurrency(cart.totalPreco + (checkout.form.entrega === 'entrega' ? frete.value : 0)))

const buscandoCep = ref(false)
const enviandoPedido = ref(false)

// Opções de Pagamento com ícones e descrições
const opcoesPagamento = [
  {
    id: 'Pix',
    nome: 'Pix',
    icone: 'pi pi-bolt',
    descricao: 'Aprovação instantânea, enviamos a chave após confirmação.'
  },
  {
    id: 'Cartão de crédito',
    nome: 'Cartão de Crédito',
    icone: 'pi pi-credit-card',
    descricao: 'Levamos a maquininha na entrega ou retirada no balcão.'
  },
  {
    id: 'Cartão de débito',
    nome: 'Cartão de Débito',
    icone: 'pi pi-credit-card',
    descricao: 'Levamos a maquininha na entrega ou retirada no balcão.'
  },
  {
    id: 'Dinheiro',
    nome: 'Dinheiro',
    icone: 'pi pi-wallet',
    descricao: 'Pagamento na entrega/retirada (informe se precisa de troco).'
  }
]

// Validações por Etapa
const etapa1Valida = computed(() => {
  const nomeValido = (checkout.form.nome || '').trim().length >= 2
  const telLimpo = (checkout.form.telefone || '').replace(/\D/g, '')
  const telValido = telLimpo.length >= 10 && telLimpo.length <= 11
  return nomeValido && telValido
})

const etapa2Valida = computed(() => {
  if (checkout.form.entrega === 'retirada') return true
  // Se for entrega: precisa de CEP, rua e número
  const cepLimpo = (checkout.form.cep || '').replace(/\D/g, '')
  const temCep = cepLimpo.length === 8
  const temRua = (checkout.form.rua || '').trim().length > 0
  const temNumero = (checkout.form.numero || '').trim().length > 0
  return temCep && temRua && temNumero
})

const etapa3Valida = computed(() => {
  return !!checkout.form.pagamento
})

// Observadores de CEP e Frete
watch(
  () => [checkout.form.cep, checkout.form.entrega],
  async ([cep, entrega]) => {
    if (entrega !== 'entrega') {
      frete.value = 0
      return
    }

    const cepLimpo = (cep || '').replace(/\D/g, '')
    if (cepLimpo.length === 8) {
      const res = await checkout.calcularFrete()
      if (res) {
        const { freteCalculado, distanciaCliente } = res
        frete.value = Math.round(freteCalculado)

        if (frete.value === 0 && distanciaCliente >= 15) {
          toast.add({
            severity: 'info',
            summary: 'Distância fora da rota padrão',
            detail: 'Seu endereço ultrapassa nosso raio de entrega direta. Alteramos para retirada com carinho! 🍬',
            life: 5000
          })
          checkout.form.entrega = 'retirada'
        }
      }
    }
  }
)

async function onCepBlur() {
  const cepLimpo = (checkout.form.cep || '').replace(/\D/g, '')
  if (cepLimpo.length === 8) {
    buscandoCep.value = true
    await checkout.buscarCep()
    buscandoCep.value = false
  }
}

// Quando o modal abre, resetar para etapa 1
watch(
  () => checkout.isOpen,
  (aberto) => {
    if (aberto) {
      etapaAtual.value = 1
    }
  }
)

// Funções de navegação do Stepper
function avancarParaEtapa2() {
  if (!etapa1Valida.value) {
    toast.add({
      severity: 'warn',
      summary: 'Dados incompletos',
      detail: 'Informe seu nome completo e WhatsApp para prosseguirmos.',
      life: 3000
    })
    return
  }
  etapaAtual.value = 2
}

function avancarParaEtapa3() {
  if (!etapa2Valida.value) {
    toast.add({
      severity: 'warn',
      summary: 'Endereço incompleto',
      detail: 'Preencha o CEP, rua e número para a entrega.',
      life: 3000
    })
    return
  }
  etapaAtual.value = 3
}

function voltarEtapa() {
  if (etapaAtual.value > 1) {
    etapaAtual.value -= 1
  }
}

function irParaEtapa(etapa) {
  if (etapa === 1) {
    etapaAtual.value = 1
  } else if (etapa === 2 && etapa1Valida.value) {
    etapaAtual.value = 2
  } else if (etapa === 3 && etapa1Valida.value && etapa2Valida.value) {
    etapaAtual.value = 3
  }
}

async function confirmarPedido() {
  if (!etapa1Valida.value || !etapa2Valida.value || !etapa3Valida.value || cart.estaVazio) {
    toast.add({
      severity: 'error',
      summary: 'Revise os dados',
      detail: 'Certifique-se de que todas as etapas foram preenchidas.',
      life: 3500
    })
    return
  }

  try {
    enviandoPedido.value = true
    const freteFinal = checkout.form.entrega === 'entrega' ? frete.value : 0
    await checkout.enviarPedido(cart.items, cart.totalPreco, freteFinal)
    enviandoPedido.value = false

    toast.add({
      severity: 'success',
      summary: 'Pedido pronto para envio!',
      detail: 'Abrindo o WhatsApp da Gratitude para concluir o seu atendimento. 🍬',
      life: 4000
    })

    cart.limpar()
    checkout.resetar()
    checkout.fechar()
    cart.fechar()
    etapaAtual.value = 1
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Não foi possível registrar o pedido',
      detail: 'Tente novamente ou envie mensagem direto no nosso WhatsApp.',
      life: 4000
    })
    enviandoPedido.value = false
  }
}
</script>

<template>
  <Dialog
    :visible="checkout.isOpen"
    @update:visible="(v) => (checkout.isOpen = v)"
    modal
    :closable="!enviandoPedido"
    :dismissableMask="!enviandoPedido"
    class="gr-checkout-dialog"
  >
    <!-- Header Personalizado com Nova Logo e Título Nobre -->
    <template #header>
      <div class="chk-header">
        <div class="chk-header__logo-wrap">
          <img src="/images/logo.png" alt="Gratitude Logo" class="chk-header__logo" />
        </div>
        <div class="chk-header__text">
          <h2 class="chk-header__title">Finalizar Sacolinha</h2>
          <span class="chk-header__sub">Gratitude Doçuras Artesanais</span>
        </div>
      </div>
    </template>

    <div class="chk-modal-body">
      <!-- Stepper / Indicador de Etapas -->
      <nav class="chk-stepper" aria-label="Etapas da finalização do pedido">
        <!-- Etapa 1 -->
        <button
          type="button"
          class="chk-step"
          :class="{
            'chk-step--active': etapaAtual === 1,
            'chk-step--done': etapaAtual > 1 || etapa1Valida
          }"
          @click="irParaEtapa(1)"
        >
          <span class="chk-step__circle">
            <i v-if="etapaAtual > 1 && etapa1Valida" class="pi pi-check"></i>
            <span v-else>1</span>
          </span>
          <span class="chk-step__label">Contato</span>
        </button>

        <div class="chk-step__connector" :class="{ 'chk-step__connector--done': etapaAtual > 1 }"></div>

        <!-- Etapa 2 -->
        <button
          type="button"
          class="chk-step"
          :class="{
            'chk-step--active': etapaAtual === 2,
            'chk-step--done': etapaAtual > 2,
            'chk-step--disabled': !etapa1Valida
          }"
          :disabled="!etapa1Valida"
          @click="irParaEtapa(2)"
        >
          <span class="chk-step__circle">
            <i v-if="etapaAtual > 2 && etapa2Valida" class="pi pi-check"></i>
            <span v-else>2</span>
          </span>
          <span class="chk-step__label">Entrega</span>
        </button>

        <div class="chk-step__connector" :class="{ 'chk-step__connector--done': etapaAtual > 2 }"></div>

        <!-- Etapa 3 -->
        <button
          type="button"
          class="chk-step"
          :class="{
            'chk-step--active': etapaAtual === 3,
            'chk-step--done': etapaAtual === 3 && etapa3Valida,
            'chk-step--disabled': !etapa1Valida || !etapa2Valida
          }"
          :disabled="!etapa1Valida || !etapa2Valida"
          @click="irParaEtapa(3)"
        >
          <span class="chk-step__circle">
            <i v-if="etapaAtual === 3 && etapa3Valida" class="pi pi-check"></i>
            <span v-else>3</span>
          </span>
          <span class="chk-step__label">Pagamento</span>
        </button>
      </nav>

      <!-- CONTEÚDO DAS ETAPAS -->

      <!-- ================= ETAPA 1: DADOS PARA CONTATO ================= -->
      <section v-show="etapaAtual === 1" class="chk-section" aria-labelledby="step1-title">
        <div class="chk-section__heading">
          <span class="chk-section__badge">Etapa 1 de 3</span>
          <h3 id="step1-title" class="chk-section__title">Dados para Contato</h3>
          <p class="chk-section__desc">
            Informe como podemos te chamar e o WhatsApp para confirmação do seu pedido.
          </p>
        </div>

        <div class="chk-form-grid">
          <div class="chk-field">
            <label for="nome" class="chk-label">
              Nome Completo <span class="chk-required">*</span>
            </label>
            <div class="chk-input-wrap">
              <i class="pi pi-user chk-input-icon"></i>
              <InputText
                id="nome"
                v-model="checkout.form.nome"
                placeholder="Ex: Maria Carolina da Silva"
                class="chk-input"
                :disabled="enviandoPedido"
                autocomplete="name"
              />
            </div>
          </div>

          <div class="chk-field">
            <label for="telefone" class="chk-label">
              WhatsApp / Celular <span class="chk-required">*</span>
            </label>
            <div class="chk-input-wrap">
              <i class="pi pi-whatsapp chk-input-icon chk-input-icon--wa"></i>
              <InputText
                id="telefone"
                v-model="checkout.form.telefone"
                maxlength="15"
                @input="checkout.form.telefone = mascaraTelefone($event.target.value)"
                placeholder="(11) 98765-4321"
                class="chk-input"
                :disabled="enviandoPedido"
                autocomplete="tel"
              />
            </div>
            <span class="chk-hint">Enviaremos os detalhes e atualizações por este número.</span>
          </div>
        </div>

        <!-- Botões de Ação Etapa 1 -->
        <div class="chk-actions">
          <button
            type="button"
            class="chk-btn chk-btn--primary"
            :disabled="!etapa1Valida"
            @click="avancarParaEtapa2"
          >
            <span>Continuar para Entrega</span>
            <i class="pi pi-arrow-right"></i>
          </button>
        </div>
      </section>

      <!-- ================= ETAPA 2: ENTREGA OU RETIRADA ================= -->
      <section v-show="etapaAtual === 2" class="chk-section" aria-labelledby="step2-title">
        <div class="chk-section__heading">
          <span class="chk-section__badge">Etapa 2 de 3</span>
          <h3 id="step2-title" class="chk-section__title">Como prefere receber?</h3>
          <p class="chk-section__desc">
            Escolha entre retirada sem custo ou entrega quentinha no seu endereço.
          </p>
        </div>

        <!-- Cards de Seleção: Retirada vs Entrega -->
        <div class="chk-choice-cards">
          <!-- Card Retirada -->
          <div
            class="chk-choice-card"
            :class="{ 'chk-choice-card--selected': checkout.form.entrega === 'retirada' }"
            @click="checkout.form.entrega = 'retirada'"
            role="radio"
            :aria-checked="checkout.form.entrega === 'retirada'"
            tabindex="0"
          >
            <div class="chk-choice-card__icon-wrap">
              <i class="pi pi-shopping-bag"></i>
            </div>
            <div class="chk-choice-card__info">
              <div class="chk-choice-card__head">
                <strong class="chk-choice-card__title">Retirar no Local</strong>
                <span class="chk-badge-free">Frete Grátis</span>
              </div>
              <p class="chk-choice-card__desc">
                Retire seu pedido fresquinho diretamente no nosso ateliê com hora combinada.
              </p>
            </div>
            <div class="chk-choice-card__check">
              <i v-if="checkout.form.entrega === 'retirada'" class="pi pi-check-circle"></i>
              <span v-else class="chk-choice-card__radio-circle"></span>
            </div>
          </div>

          <!-- Card Entrega -->
          <div
            class="chk-choice-card"
            :class="{ 'chk-choice-card--selected': checkout.form.entrega === 'entrega' }"
            @click="checkout.form.entrega = 'entrega'"
            role="radio"
            :aria-checked="checkout.form.entrega === 'entrega'"
            tabindex="0"
          >
            <div class="chk-choice-card__icon-wrap">
              <i class="pi pi-send"></i>
            </div>
            <div class="chk-choice-card__info">
              <div class="chk-choice-card__head">
                <strong class="chk-choice-card__title">Entrega em Domicílio</strong>
                <span v-if="frete > 0" class="chk-badge-frete">{{ totalFreteFormatado }}</span>
                <span v-else class="chk-badge-calc">Calcular via CEP</span>
              </div>
              <p class="chk-choice-card__desc">
                Levamos suas trufas com embalagem térmica e todo o cuidado até sua porta.
              </p>
            </div>
            <div class="chk-choice-card__check">
              <i v-if="checkout.form.entrega === 'entrega'" class="pi pi-check-circle"></i>
              <span v-else class="chk-choice-card__radio-circle"></span>
            </div>
          </div>
        </div>

        <!-- Formulário de Endereço (se entrega selecionada) -->
        <div v-if="checkout.form.entrega === 'entrega'" class="chk-address-box">
          <div class="chk-address-box__header">
            <i class="pi pi-map-marker"></i>
            <span>Endereço de Entrega</span>
          </div>

          <div class="chk-form-grid">
            <div class="chk-field">
              <label for="cep" class="chk-label">
                CEP <span class="chk-required">*</span>
              </label>
              <div class="chk-input-wrap">
                <i class="pi pi-search chk-input-icon"></i>
                <InputText
                  id="cep"
                  v-model="checkout.form.cep"
                  @input="checkout.form.cep = mascaraCep($event.target.value)"
                  @blur="onCepBlur"
                  placeholder="00000-000"
                  maxlength="9"
                  class="chk-input"
                  :disabled="enviandoPedido"
                />
                <span v-if="buscandoCep" class="chk-spinner-icon">
                  <i class="pi pi-spin pi-spinner"></i>
                </span>
              </div>
              <span class="chk-hint">Digite o CEP para preencher a rua e calcular a taxa.</span>
            </div>

            <div v-if="checkout.form.estado" class="chk-field">
              <label for="cidade-estado" class="chk-label">Cidade / Estado</label>
              <InputText
                id="cidade-estado"
                v-model="checkout.form.estado"
                class="chk-input chk-input--disabled"
                disabled
              />
            </div>

            <div class="chk-field">
              <label for="rua" class="chk-label">
                Rua / Avenida <span class="chk-required">*</span>
              </label>
              <InputText
                id="rua"
                v-model="checkout.form.rua"
                placeholder="Ex: Rua das Flores"
                class="chk-input"
                :disabled="enviandoPedido"
              />
            </div>

            <div class="chk-form-row">
              <div class="chk-field chk-field--sm">
                <label for="numero" class="chk-label">
                  Número <span class="chk-required">*</span>
                </label>
                <InputText
                  id="numero"
                  v-model="checkout.form.numero"
                  placeholder="123"
                  class="chk-input"
                  :disabled="enviandoPedido"
                />
              </div>

              <div class="chk-field chk-field--lg">
                <label for="complemento" class="chk-label">Complemento</label>
                <InputText
                  id="complemento"
                  v-model="checkout.form.complemento"
                  placeholder="Apto 42, Bloco B..."
                  class="chk-input"
                  :disabled="enviandoPedido"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Botões de Ação Etapa 2 -->
        <div class="chk-actions">
          <button type="button" class="chk-btn chk-btn--secondary" @click="voltarEtapa">
            <i class="pi pi-arrow-left"></i>
            <span>Voltar</span>
          </button>
          <button
            type="button"
            class="chk-btn chk-btn--primary"
            :disabled="!etapa2Valida"
            @click="avancarParaEtapa3"
          >
            <span>Continuar para Pagamento</span>
            <i class="pi pi-arrow-right"></i>
          </button>
        </div>
      </section>

      <!-- ================= ETAPA 3: FORMA DE PAGAMENTO & CONFIRMAÇÃO ================= -->
      <section v-show="etapaAtual === 3" class="chk-section" aria-labelledby="step3-title">
        <div class="chk-section__heading">
          <span class="chk-section__badge">Etapa 3 de 3</span>
          <h3 id="step3-title" class="chk-section__title">Forma de Pagamento</h3>
          <p class="chk-section__desc">
            Selecione como deseja pagar e confirme o resumo do seu pedido.
          </p>
        </div>

        <!-- Cards de Formas de Pagamento -->
        <div class="chk-pay-cards">
          <div
            v-for="op in opcoesPagamento"
            :key="op.id"
            class="chk-pay-card"
            :class="{ 'chk-pay-card--selected': checkout.form.pagamento === op.id }"
            @click="checkout.form.pagamento = op.id"
            role="radio"
            :aria-checked="checkout.form.pagamento === op.id"
            tabindex="0"
          >
            <div class="chk-pay-card__icon-wrap">
              <i :class="op.icone"></i>
            </div>
            <div class="chk-pay-card__info">
              <strong class="chk-pay-card__title">{{ op.nome }}</strong>
              <span class="chk-pay-card__desc">{{ op.descricao }}</span>
            </div>
            <div class="chk-pay-card__check">
              <i v-if="checkout.form.pagamento === op.id" class="pi pi-check-circle"></i>
              <span v-else class="chk-choice-card__radio-circle"></span>
            </div>
          </div>
        </div>

        <!-- Campo de Troco se Dinheiro -->
        <div v-if="checkout.form.pagamento === 'Dinheiro'" class="chk-subfield-box">
          <label for="troco" class="chk-label">Precisa de troco para quanto?</label>
          <InputText
            id="troco"
            v-model="checkout.form.troco"
            placeholder="Ex: Troco para R$ 50,00 ou R$ 100,00"
            class="chk-input"
            :disabled="enviandoPedido"
          />
        </div>

        <!-- Observações Opcionais -->
        <div class="chk-field" style="margin-top: 14px;">
          <label for="observacoes" class="chk-label">
            Observações para o pedido (opcional)
          </label>
          <Textarea
            id="observacoes"
            v-model="checkout.form.observacoes"
            rows="2"
            autoResize
            placeholder="Ex: Embalar para presente com fita delicada, bilhete especial..."
            class="chk-input chk-textarea"
            :disabled="enviandoPedido"
          />
        </div>

        <!-- ================= RESUMO FINAL DOS VALORES ================= -->
        <div class="chk-summary-card">
          <div class="chk-summary-card__header">
            <i class="pi pi-receipt"></i>
            <span>Resumo dos Valores</span>
          </div>

          <div class="chk-summary-card__rows">
            <div class="chk-summary-row">
              <span class="chk-summary-label">Subtotal das Trufas</span>
              <span class="chk-summary-val">{{ totalDocesFormatado }}</span>
            </div>

            <div class="chk-summary-row">
              <span class="chk-summary-label">
                {{ checkout.form.entrega === 'entrega' ? 'Taxa de Entrega' : 'Tipo de Entrega' }}
              </span>
              <span
                class="chk-summary-val"
                :class="{ 'chk-summary-val--free': checkout.form.entrega === 'retirada' || frete === 0 }"
              >
                {{ checkout.form.entrega === 'retirada' ? 'Retirada (Grátis)' : (frete > 0 ? totalFreteFormatado : 'A calcular / Grátis') }}
              </span>
            </div>

            <div class="chk-summary-row chk-summary-row--total">
              <div class="chk-total-lead">
                <span class="chk-total-label">Total do Pedido</span>
                <small class="chk-total-sub">
                  {{ checkout.form.entrega === 'entrega' ? 'com entrega inclusa' : 'sem taxa de frete' }}
                </small>
              </div>
              <strong class="chk-total-amount">{{ totalFinalFormatado }}</strong>
            </div>
          </div>
        </div>

        <!-- Botões de Ação Etapa 3 -->
        <div class="chk-actions">
          <button type="button" class="chk-btn chk-btn--secondary" @click="voltarEtapa">
            <i class="pi pi-arrow-left"></i>
            <span>Voltar</span>
          </button>
          <button
            type="button"
            class="chk-btn chk-btn--confirm"
            :disabled="!etapa3Valida || enviandoPedido"
            @click="confirmarPedido"
          >
            <i v-if="enviandoPedido" class="pi pi-spin pi-spinner"></i>
            <i v-else class="pi pi-check"></i>
            <span>{{ enviandoPedido ? 'Confirmando...' : 'Confirmar Pedido' }}</span>
          </button>
        </div>
      </section>
    </div>
  </Dialog>
</template>

<style scoped>
/* ================= DIALOG WRAPPER & HEADER ================= */
.chk-header {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.chk-header__logo-wrap {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  padding: 1.5px;
  background: linear-gradient(135deg, #f7e1b5 0%, #c59a4e 45%, #8b621e 100%);
  box-shadow: 0 4px 12px rgba(197, 154, 78, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chk-header__logo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.chk-header__text {
  display: flex;
  flex-direction: column;
}

.chk-header__title {
  font-family: var(--gr-font-display);
  font-size: 1.35rem;
  color: #fff;
  margin: 0;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.chk-header__sub {
  font-size: 0.65rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gr-gold-300);
  font-weight: 600;
  margin-top: 2px;
}

/* ================= STEPPER DE ETAPAS ================= */
.chk-modal-body {
  padding: 4px 0 8px;
}

.chk-stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 14px 16px;
  background: linear-gradient(180deg, #fffdfa 0%, #fbf5ee 100%);
  border: 1px solid rgba(220, 195, 160, 0.5);
  border-radius: var(--gr-radius-sm);
  box-shadow: 0 2px 8px rgba(56, 10, 20, 0.04);
}

.chk-step {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  transition: all 0.2s ease;
}

.chk-step:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.chk-step__circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--gr-font-body);
  font-size: 0.85rem;
  font-weight: 700;
  background: #f0e4d7;
  color: var(--gr-cacao-600);
  border: 2px solid #e2d2c1;
  transition: all 0.25s ease;
}

.chk-step__label {
  font-family: var(--gr-font-body);
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--gr-cacao-600);
  transition: all 0.2s ease;
}

/* Estado Ativo do Step */
.chk-step--active .chk-step__circle {
  background: var(--gr-wine-900);
  color: var(--gr-gold-300);
  border-color: var(--gr-gold-500);
  box-shadow: 0 4px 12px rgba(56, 10, 20, 0.3);
  transform: scale(1.08);
}

.chk-step--active .chk-step__label {
  color: var(--gr-wine-900);
  font-weight: 700;
}

/* Estado Concluído do Step */
.chk-step--done:not(.chk-step--active) .chk-step__circle {
  background: #1b7a42;
  color: #fff;
  border-color: #1b7a42;
}

.chk-step--done:not(.chk-step--active) .chk-step__label {
  color: #1b7a42;
}

/* Conectores */
.chk-step__connector {
  flex: 1;
  height: 2px;
  background: #e2d2c1;
  margin: 0 8px;
  transition: all 0.3s ease;
}

.chk-step__connector--done {
  background: #1b7a42;
}

/* ================= CABEÇALHO DA SEÇÃO ================= */
.chk-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: fadeIn 0.3s ease both;
}

.chk-section__heading {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chk-section__badge {
  display: inline-block;
  align-self: flex-start;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gr-gold-700);
  background: var(--gr-cream-200);
  border: 1px solid rgba(197, 154, 78, 0.3);
  padding: 3px 8px;
  border-radius: 9999px;
}

.chk-section__title {
  font-family: var(--gr-font-display);
  font-size: 1.3rem;
  color: var(--gr-wine-900);
  margin: 0;
}

.chk-section__desc {
  font-size: 0.85rem;
  color: var(--gr-cacao-600);
  line-height: 1.45;
}

/* ================= CAMPOS DE FORMULÁRIO ================= */
.chk-form-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.chk-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.chk-form-row {
  display: flex;
  gap: 12px;
}

.chk-field--sm {
  flex: 1;
}

.chk-field--lg {
  flex: 2;
}

.chk-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--gr-wine-900);
}

.chk-required {
  color: #dc2626;
  font-weight: 700;
}

.chk-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.chk-input-icon {
  position: absolute;
  left: 14px;
  color: var(--gr-gold-700);
  font-size: 0.95rem;
  pointer-events: none;
  z-index: 2;
}

.chk-input-icon--wa {
  color: #25d366;
}

.chk-spinner-icon {
  position: absolute;
  right: 14px;
  color: var(--gr-gold-700);
  font-size: 0.95rem;
}

:deep(.chk-input) {
  width: 100%;
  padding: 11px 14px 11px 40px !important;
  background: #ffffff !important;
  border: 1.5px solid rgba(220, 195, 160, 0.7) !important;
  border-radius: var(--gr-radius-sm) !important;
  color: var(--gr-wine-900) !important;
  font-family: var(--gr-font-body) !important;
  font-size: 0.92rem !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 2px 6px rgba(56, 10, 20, 0.03) !important;
}

:deep(.chk-input:focus) {
  border-color: var(--gr-gold-500) !important;
  outline: 3px solid rgba(197, 154, 78, 0.2) !important;
  box-shadow: 0 4px 12px rgba(197, 154, 78, 0.15) !important;
}

:deep(.chk-input--disabled) {
  background: var(--gr-cream-200) !important;
  color: var(--gr-cacao-700) !important;
  border-color: rgba(220, 195, 160, 0.4) !important;
  padding-left: 14px !important;
}

:deep(.chk-textarea) {
  padding-left: 14px !important;
  resize: vertical !important;
}

.chk-hint {
  font-size: 0.72rem;
  color: var(--gr-cacao-600);
  margin-top: 2px;
}

/* ================= CARDS DE ESCOLHA (ENTREGA VS RETIRADA) ================= */
.chk-choice-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chk-choice-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: #ffffff;
  border: 1.5px solid rgba(220, 195, 160, 0.6);
  border-radius: var(--gr-radius-sm);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 8px rgba(56, 10, 20, 0.04);
}

.chk-choice-card:hover {
  border-color: var(--gr-gold-500);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(197, 154, 78, 0.15);
}

.chk-choice-card--selected {
  border: 2px solid var(--gr-gold-500) !important;
  background: linear-gradient(135deg, #fffdf9 0%, #fcf6ec 100%) !important;
  box-shadow: 0 6px 18px rgba(197, 154, 78, 0.2) !important;
}

.chk-choice-card__icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--gr-cream-200);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gr-gold-700);
  font-size: 1.25rem;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.chk-choice-card--selected .chk-choice-card__icon-wrap {
  background: var(--gr-wine-900);
  color: var(--gr-gold-300);
}

.chk-choice-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.chk-choice-card__head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.chk-choice-card__title {
  font-family: var(--gr-font-display);
  font-size: 1.05rem;
  color: var(--gr-wine-900);
}

.chk-badge-free {
  background: #e8f5e9;
  color: #1b5e20;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 9999px;
  border: 1px solid #c8e6c9;
}

.chk-badge-frete {
  background: var(--gr-cream-200);
  color: var(--gr-wine-900);
  font-size: 0.74rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 9999px;
  border: 1px solid rgba(197, 154, 78, 0.4);
}

.chk-badge-calc {
  background: #f0f4f8;
  color: #334e68;
  font-size: 0.68rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 9999px;
}

.chk-choice-card__desc {
  font-size: 0.78rem;
  color: var(--gr-cacao-600);
  line-height: 1.4;
  margin: 0;
}

.chk-choice-card__check {
  font-size: 1.25rem;
  color: var(--gr-gold-500);
  display: flex;
  align-items: center;
}

.chk-choice-card__radio-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #d4c3b2;
  display: inline-block;
}

/* Caixa de Endereço */
.chk-address-box {
  background: linear-gradient(180deg, #fffdfa 0%, #fbf5ee 100%);
  border: 1.5px solid rgba(220, 195, 160, 0.6);
  border-radius: var(--gr-radius-sm);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.chk-address-box__header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--gr-font-display);
  font-size: 0.95rem;
  color: var(--gr-wine-900);
  font-weight: 700;
  padding-bottom: 8px;
  border-bottom: 1px dashed rgba(220, 195, 160, 0.6);
}

.chk-address-box__header i {
  color: var(--gr-gold-700);
}

/* ================= CARDS DE FORMAS DE PAGAMENTO ================= */
.chk-pay-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.chk-pay-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: #ffffff;
  border: 1.5px solid rgba(220, 195, 160, 0.6);
  border-radius: var(--gr-radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.chk-pay-card:hover {
  border-color: var(--gr-gold-500);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(197, 154, 78, 0.15);
}

.chk-pay-card--selected {
  border: 2px solid var(--gr-gold-500) !important;
  background: linear-gradient(135deg, #fffdf9 0%, #fcf6ec 100%) !important;
  box-shadow: 0 4px 14px rgba(197, 154, 78, 0.2) !important;
}

.chk-pay-card__icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--gr-cream-200);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gr-gold-700);
  font-size: 1rem;
  flex-shrink: 0;
}

.chk-pay-card--selected .chk-pay-card__icon-wrap {
  background: var(--gr-wine-900);
  color: var(--gr-gold-300);
}

.chk-pay-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chk-pay-card__title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--gr-wine-900);
}

.chk-pay-card__desc {
  font-size: 0.72rem;
  color: var(--gr-cacao-600);
  line-height: 1.35;
}

.chk-pay-card__check {
  font-size: 1.1rem;
  color: var(--gr-gold-500);
}

.chk-subfield-box {
  background: #fffdfa;
  border: 1px solid rgba(197, 154, 78, 0.4);
  border-radius: var(--gr-radius-sm);
  padding: 12px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ================= RESUMO FINAL DOS VALORES ================= */
.chk-summary-card {
  margin-top: 12px;
  background: linear-gradient(135deg, #fffdfa 0%, #fbf5ee 100%);
  border: 1.5px solid rgba(220, 195, 160, 0.7);
  border-radius: var(--gr-radius-sm);
  padding: 16px;
  box-shadow: 0 4px 14px rgba(56, 10, 20, 0.05);
}

.chk-summary-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--gr-font-display);
  font-size: 0.98rem;
  color: var(--gr-wine-900);
  font-weight: 700;
  padding-bottom: 10px;
  border-bottom: 1px dashed rgba(220, 195, 160, 0.6);
  margin-bottom: 12px;
}

.chk-summary-card__header i {
  color: var(--gr-gold-700);
}

.chk-summary-card__rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chk-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.88rem;
  color: var(--gr-cacao-700);
}

.chk-summary-label {
  font-weight: 500;
}

.chk-summary-val {
  font-weight: 600;
  color: var(--gr-wine-900);
}

.chk-summary-val--free {
  color: #1b5e20 !important;
  font-weight: 700;
}

.chk-summary-row--total {
  border-top: 1.5px solid rgba(220, 195, 160, 0.7);
  padding-top: 12px;
  margin-top: 4px;
}

.chk-total-lead {
  display: flex;
  flex-direction: column;
}

.chk-total-label {
  font-family: var(--gr-font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--gr-wine-900);
}

.chk-total-sub {
  font-size: 0.72rem;
  color: var(--gr-cacao-600);
}

.chk-total-amount {
  font-family: var(--gr-font-display);
  font-size: 1.65rem;
  font-weight: 800;
  color: var(--gr-wine-900);
}

/* ================= BOTÕES DE AÇÃO ================= */
.chk-actions {
  display: flex;
  gap: 12px;
  margin-top: 18px;
  align-items: center;
}

.chk-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 20px;
  border-radius: 9999px;
  font-family: var(--gr-font-body);
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  border: none;
}

.chk-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.chk-btn--primary {
  flex: 1;
  background: var(--gr-wine-900);
  color: #ffffff;
  border: 1px solid rgba(235, 211, 155, 0.45);
  box-shadow: 0 6px 18px rgba(56, 10, 20, 0.25);
}

.chk-btn--primary:hover:not(:disabled) {
  background: var(--gr-wine-800);
  border-color: var(--gr-gold-400);
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(56, 10, 20, 0.35);
}

.chk-btn--primary i {
  color: var(--gr-gold-300);
}

.chk-btn--confirm {
  flex: 1;
  background: linear-gradient(135deg, #380a14 0%, #520f1e 100%);
  color: #ffffff;
  border: 1.5px solid var(--gr-gold-500);
  box-shadow: 0 8px 24px rgba(56, 10, 20, 0.35);
}

.chk-btn--confirm:hover:not(:disabled) {
  background: linear-gradient(135deg, #4a0e1b 0%, #681527 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(56, 10, 20, 0.45);
}

.chk-btn--confirm i {
  color: var(--gr-gold-300);
  font-size: 1.05rem;
}

.chk-btn--secondary {
  background: var(--gr-cream-200);
  color: var(--gr-wine-900);
  border: 1px solid rgba(220, 195, 160, 0.7);
  padding: 13px 20px;
}

.chk-btn--secondary:hover {
  background: #fff;
  border-color: var(--gr-gold-500);
  transform: translateY(-2px);
}

/* ================= OVERRIDES DE DIALOG GLOBAL ================= */
:global(.gr-checkout-dialog.p-dialog) {
  border-radius: 24px !important;
  overflow: hidden !important;
  border: 1.5px solid rgba(197, 154, 78, 0.45) !important;
  box-shadow: 0 24px 60px -12px rgba(40, 10, 18, 0.5) !important;
  background: #fffdfa !important;
  max-width: 580px !important;
  width: 100% !important;
}

:global(.gr-checkout-dialog .p-dialog-header) {
  background: linear-gradient(135deg, var(--gr-wine-900) 0%, var(--gr-wine-950) 100%) !important;
  color: #fff !important;
  padding: 16px 20px !important;
  border-bottom: 2px solid var(--gr-gold-500) !important;
}

:global(.gr-checkout-dialog .p-dialog-header-actions button) {
  color: var(--gr-gold-300) !important;
  border-radius: 50% !important;
  width: 32px !important;
  height: 32px !important;
  transition: all 0.2s ease !important;
}

:global(.gr-checkout-dialog .p-dialog-header-actions button:hover) {
  background: rgba(255, 255, 255, 0.15) !important;
  color: #fff !important;
}

:global(.gr-checkout-dialog .p-dialog-content) {
  background: #fffdfa !important;
  padding: 20px 22px 24px !important;
  color: var(--gr-cacao-900) !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .chk-pay-cards {
    grid-template-columns: 1fr;
  }
  .chk-stepper {
    padding: 10px;
    margin-bottom: 18px;
  }
  .chk-step__label {
    display: none;
  }
  .chk-actions {
    flex-direction: column-reverse;
  }
  .chk-btn {
    width: 100%;
  }
}
</style>
