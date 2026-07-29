import comboData from '../data/combos.json'

const NETWORK_DELAY_MS = 350

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchCombos() {
  await delay(NETWORK_DELAY_MS)
  return structuredClone(comboData)
}
