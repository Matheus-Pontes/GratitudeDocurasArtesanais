import { defineStore } from 'pinia'
import { fetchCombos } from '../api/comboApi'

export const useComboStore = defineStore('combos', {
  state: () => ({
    items: [],
    status: 'idle',
    error: null
  }),

  getters: {
    isLoading: (state) => state.status === 'loading'
  },

  actions: {
    async load({ force = false } = {}) {
      if (this.status === 'success' && !force) return
      this.status = 'loading'
      this.error = null
      try {
        this.items = await fetchCombos()
        this.status = 'success'
      } catch (err) {
        this.error = err.message || 'Não foi possível carregar os combos.'
        this.status = 'error'
      }
    }
  }
})
