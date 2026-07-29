import { defineStore } from 'pinia'
import { fetchTruffles } from '../api/truffleApi'

export const useTruffleStore = defineStore('truffles', {
  state: () => ({
    items: [],
    status: 'idle', // idle | loading | success | error
    error: null
  }),

  getters: {
    isLoading: (state) => state.status === 'loading',
    premium: (state) => state.items.filter((t) => t.linha === 'premium'),
    tradicional: (state) => state.items.filter((t) => t.linha === 'tradicional'),
    porId: (state) => (id) => state.items.find((t) => t.id === id)
  },

  actions: {
    async load({ force = false } = {}) {
      if (this.status === 'success' && !force) return
      this.status = 'loading'
      this.error = null
      try {
        this.items = await fetchTruffles()
        this.status = 'success'
      } catch (err) {
        this.error = err.message || 'Não foi possível carregar as trufas.'
        this.status = 'error'
      }
    }
  }
})
