// my-theme.ts
import { darken, lighten } from 'polished'
import { DefaultTheme } from '../types'

export const myTheme: DefaultTheme = {
  borderRadius: '2px',

  colors: {
    colorPrimary: '#00C2CB',
    colorSecondary: '#FF7600',
    colorLightGrey: '#F2F2F2',
    colorText: '#535353',
    colorBackground: '#ffffff',
    colorDanger: '#dc3545',
    contrastColorPrimary: lighten(0.4, '#00C2CB'),
    colorModalBackground: '#ffffff',
    colorPlaceholder: '#8e8e8e',
    colorLightGreySelected: darken(0.1, '#535353')
  }
}
