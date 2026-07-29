import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

/**
 * Preset PrimeVue com a identidade visual da Gratitude Doçuras Artesanais:
 * berry/pink como cor primária, dourado como cor de destaque secundária.
 */
export const GratitudePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fdf1f5',
      100: '#fad8e4',
      200: '#f2a9c4',
      300: '#e77ba3',
      400: '#dd4f83',
      500: '#d6336c',
      600: '#a8285a',
      700: '#8c1f4a',
      800: '#6e1839',
      900: '#5c0f2c',
      950: '#3d0a1d'
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#fdf6f0',
          100: '#fbeee4',
          200: '#f5e2d3',
          300: '#eccdb3',
          400: '#dcae88',
          500: '#c99a3f',
          600: '#a87e33',
          700: '#856428',
          800: '#634a1d',
          900: '#3a1f28',
          950: '#2a1620'
        },
        primary: {
          color: '#a8285a',
          contrastColor: '#ffffff',
          hoverColor: '#8c1f4a',
          activeColor: '#5c0f2c'
        },
        highlight: {
          background: '#f2a9c4',
          focusBackground: '#e77ba3',
          color: '#5c0f2c',
          focusColor: '#5c0f2c'
        }
      }
    }
  },
  components: {
    button: {
      root: {
        borderRadius: '999px'
      }
    },
    card: {
      root: {
        borderRadius: '18px'
      }
    },
    badge: {
      root: {
        borderRadius: '999px'
      }
    }
  }
})
