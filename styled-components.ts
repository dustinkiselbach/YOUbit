// styled-components.ts
import * as styledComponents from 'styled-components/native'
import { DefaultTheme } from './src/types'

const {
  default: styled,
  css,
  ThemeProvider
} = (styledComponents as unknown) as styledComponents.ReactNativeThemedStyledComponentsModule<
  DefaultTheme
>

export { css, ThemeProvider }
export default styled
