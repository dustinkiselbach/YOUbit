import React from 'react'
import { ThemeProvider } from 'styled-components'
import { LoadAssets } from './src/components'
import { AuthStack, MainTab } from './src/navigators'
import { myTheme } from './src/themes/myTheme'
import { ApolloProvider } from '@apollo/client'
import { AuthContextProvider, useAuthStateContext } from './src/context'
import { client } from './src/utils'
import { Onboarding } from './src/screens'

const fonts = {
  'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),
  'OpenSans-Light': require('./assets/fonts/OpenSans-Light.ttf'),
  'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
  'Glacial-Bold': require('./assets/fonts/GlacialIndifference-Bold.otf'),
  'Glacial-Regular': require('./assets/fonts/GlacialIndifference-Regular.otf')
}

const App: React.FC = () => {
  return (
    <ApolloProvider {...{ client }}>
      <AuthContextProvider>
        <ThemeProvider theme={myTheme}>
          <LoadAssets {...{ fonts }}>
            <NavigationFlow />
          </LoadAssets>
        </ThemeProvider>
      </AuthContextProvider>
    </ApolloProvider>
  )
}

const NavigationFlow: React.FC = () => {
  const { firstTime, signedIn } = useAuthStateContext()

  if (firstTime) {
    return <Onboarding />
  }

  if (signedIn) {
    return <MainTab />
  } else {
    return <AuthStack />
  }
}

export default App
