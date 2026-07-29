import truffleData from '../data/truffles.json'

/**
 * Simula uma chamada de API real (com latência de rede e possibilidade
 * de falha) para o catálogo de trufas. Quando houver um backend de
 * verdade, basta trocar o corpo desta função por um fetch/axios real —
 * a store e os componentes não precisam mudar.
 */
const NETWORK_DELAY_MS = 450

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchTruffles() {
  await delay(NETWORK_DELAY_MS)
  // clona os dados para simular uma resposta de rede isolada do módulo local
  return structuredClone(truffleData)
}

export async function fetchTruffleById(id) {
  await delay(NETWORK_DELAY_MS / 2)
  const item = truffleData.find((t) => t.id === id)
  if (!item) {
    throw new Error(`Trufa "${id}" não encontrada`)
  }
  return structuredClone(item)
}
