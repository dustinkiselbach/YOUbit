import React from 'react'
import { Text } from 'react-native'
import { Container, SectionSpacer } from '../components'
import { MainTabNav } from '../types'
import { useLogout } from '../utils'

const Settings: React.FC<MainTabNav<'Settings'>> = () => {
  const [logout] = useLogout()
  return (
    <Container>
      <SectionSpacer>
        <Text onPress={() => logout()}>fart</Text>
      </SectionSpacer>
    </Container>
  )
}

export default Settings
