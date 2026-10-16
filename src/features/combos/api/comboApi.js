import combos from '../data/combos.json'

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

export async function fetchCombos() {
  await delay(NETWORK_DELAY_MS)
  
  return  structuredClone(combos)
}

