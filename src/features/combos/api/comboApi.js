const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export async function fetchCombos() {
  const response = await fetch(`${API_URL}/combos`)

  if (!response.ok) {
    throw new Error('Não foi possível carregar os combos.')
  }

  return response.json()
}
