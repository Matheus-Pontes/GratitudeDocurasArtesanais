/**
 * Diretiva Vue 3 para animação de scroll reveal (aparecer conforme faz o scroll).
 * Utiliza IntersectionObserver com suporte a atrasos em cascata (stagger) e direções.
 */
let observer = null

function getObserver() {
  if (typeof window === 'undefined') return null

  if (!observer) {
    observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target
            const delay = Number(el.dataset.revealDelay || 0)

            if (delay > 0) {
              setTimeout(() => {
                el.classList.add('is-revealed')
              }, delay)
            } else {
              el.classList.add('is-revealed')
            }

            obs.unobserve(el)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    )
  }

  return observer
}

export const vReveal = {
  mounted(el, binding) {
    // Adiciona classe base
    el.classList.add('gr-reveal')

    // Suporta modificador ou valor: 'scale', 'left', 'right', 'fade'
    if (binding.value) {
      el.classList.add(`gr-reveal--${binding.value}`)
    } else if (binding.arg) {
      el.classList.add(`gr-reveal--${binding.arg}`)
    }

    const obs = getObserver()
    if (obs) {
      obs.observe(el)
    } else {
      // Fallback para SSR ou navegadores sem suporte
      el.classList.add('is-revealed')
    }
  },
  unmounted(el) {
    const obs = getObserver()
    if (obs) {
      obs.unobserve(el)
    }
  }
}

export default vReveal
