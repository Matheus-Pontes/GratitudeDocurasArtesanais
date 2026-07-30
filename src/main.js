import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

import 'primeicons/primeicons.css'
import './shared/styles/tokens.css'
import './shared/styles/base.css'

import { GratitudePreset } from './shared/styles/gratitudePreset'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

pinia.use(({ store }) => {
  const storageKey = `pinia:${store.$id}`

  if (typeof window === 'undefined') return

  try {
    const saved = window.localStorage.getItem(storageKey)
    if (saved) {
      store.$patch(JSON.parse(saved))
    }
  } catch (error) {
    console.warn(`Não foi possível restaurar ${storageKey}`, error)
  }

  store.$subscribe(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(store.$state))
    } catch (error) {
      console.warn(`Não foi possível salvar ${storageKey}`, error)
    }
  })
})

app.use(pinia)
app.use(PrimeVue, {
  theme: {
    preset: GratitudePreset,
    options: {
      darkModeSelector: false,
      cssLayer: false
    }
  }
})
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')