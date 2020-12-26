import React from 'react'
import { Text } from 'react-native'
import { Container, SectionSpacer } from '../components'
import { MainTabNav } from '../types'
import { useLogout } from '../utils'
import { useUserLogoutMutation } from '../generated/graphql'

const Settings: React.FC<MainTabNav<'Settings'>> = () => {
  const [userLogout] = useUserLogoutMutation()
  const [logout] = useLogout()

  return (
    <Container>
      <SectionSpacer>
        <Text
          onPress={async () => {
            try {
              await userLogout()
            } catch (e) {
              console.log((e as Error).message)
            }
            logout()
          }}
        >
          fart
        </Text>
      </SectionSpacer>
    </Container>
  )
}

export default Settings
