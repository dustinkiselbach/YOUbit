import React from 'react'
import { Button, Container, SectionSpacer, Text } from '../components'
import { MainTabNav } from '../types'
import { useLogout } from '../utils'
import { useUserLogoutMutation, useUserQuery } from '../generated/graphql'
import styled from '../../styled-components'
import { ActivityIndicator } from 'react-native'

const Settings: React.FC<MainTabNav<'Settings'>> = () => {
  const [logout] = useLogout()
  const { data, loading, error } = useUserQuery()
  const [userLogout] = useUserLogoutMutation()

  if (error) {
    logout()
  }

  return (
    <Container>
      <SectionSpacer>
        <Text variant='h1' style={{ marginBottom: 16 }}>
          Settings
        </Text>
        {loading ? (
          <ActivityIndicator size='small' color='#00C2CB' />
        ) : (
          <SettingsItems>
            <Text variant='h4' style={{ marginBottom: 16 }}>
              {data?.user.email}
            </Text>
            <Button
              title='Logout'
              onPress={async () => {
                try {
                  await userLogout()
                  logout()
                } catch (err) {
                  console.log((err as Error).message)
                }
              }}
            />
          </SettingsItems>
        )}
      </SectionSpacer>
    </Container>
  )
}

const SettingsItems = styled.View`
  width: 100%;
  background-color: ${props => props.theme.colors.colorLightGrey};
  padding: 16px;
  border-radius: 2px;
`

export default Settings
