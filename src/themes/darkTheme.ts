import { darken } from 'polished'
import { DefaultTheme } from '../types'

export const darkTheme: DefaultTheme = {
  borderRadius: '2px',

  colors: {
    colorPrimary: '#3c8a8e',
    colorSecondary: '#a57c59',
    colorLightGrey: 'rgba(255,255,255,0.125)',
    colorText: 'rgba(255,255,255,0.85)',
    colorBackground: '#121212',
    colorDanger: '#dc3545',
    contrastColorPrimary: darken(0.1, '#3c8a8e'),
    colorModalBackground: 'rgba(255,255,255,0.066)',
    colorPlaceholder: 'rgba(255,255,255,0.6)',
    colorLightGreySelected: 'rgba(255,255,255,0.333)'
  }
}
