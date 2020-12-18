import React from 'react'
import { ThemeProvider } from 'styled-components'
import { LoadAssets } from './src/components'
import { AuthStack, MainTab } from './src/navigators'
import { myTheme } from './src/themes/myTheme'

const fonts = {
  'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),
  'OpenSans-Light': require('./assets/fonts/OpenSans-Light.ttf'),
  'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
  'Glacial-Bold': require('./assets/fonts/GlacialIndifference-Bold.otf'),
  'Glacial-Regular': require('./assets/fonts/GlacialIndifference-Regular.otf')
}

const signedIn = true

const App: React.FC = () => {
  return (
    <ThemeProvider theme={myTheme}>
      <LoadAssets {...{ fonts }}>
        <NavigationFlow />
      </LoadAssets>
    </ThemeProvider>
  )
}

const NavigationFlow: React.FC = () => {
  if (signedIn) {
    return <MainTab />
  } else {
    return <AuthStack />
  }
}

export default App
