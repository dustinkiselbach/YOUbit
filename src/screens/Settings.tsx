import React, { useContext } from 'react'
import { Button, Container, SectionSpacer, Text, Title } from '../components'
import { MainTabNav } from '../types'
import { useLogout } from '../utils'
import {
  useDestroyDeviceMutation,
  useUserLogoutMutation,
  useUserQuery
} from '../generated/graphql'
import styled, { ThemeContext } from '../../styled-components'
import { ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Switch } from 'react-native-gesture-handler'
import { useThemeActionContext, useThemeStateContext } from '../context'
import { darken } from 'polished'
import appSettings from '../../app.json'

const Settings: React.FC<MainTabNav<'Settings'>> = () => {
  const [logout] = useLogout()
  const { data, loading, error } = useUserQuery()
  const [userLogout] = useUserLogoutMutation()
  const [destroyDevice] = useDestroyDeviceMutation()
  const themeContext = useContext(ThemeContext)
  const { dark } = useThemeStateContext()
  const setThemeState = useThemeActionContext()

  if (error) {
    logout()
  }

  if (!setThemeState) {
    return <Text variant='h2'>Error, please logout and try again</Text>
  }

  return (
    <Container>
      <SectionSpacer>
        <Title>Settings</Title>
        {loading ? (
          <ActivityIndicator size='small' color='#00C2CB' />
        ) : (
          <>
            <SettingsItem>
              <Text variant='h4' style={{ marginBottom: 16 }}>
                {data?.user.email}
              </Text>
              <Button
                title='Logout'
                onPress={async () => {
                  try {
                    const deviceToken = await AsyncStorage.getItem(
                      'NOTIFICATION_TOKEN'
                    )
                    if (deviceToken) {
                      await destroyDevice({
                        variables: { token: deviceToken }
                      })
                    }
                    await userLogout()
                    logout()
                  } catch (err) {
                    console.log((err as Error).message)
                  }
                }}
              />
            </SettingsItem>
            <SettingsItem
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Text variant='p'>Dark Theme</Text>
              <Switch
                value={dark}
                onValueChange={() => setThemeState({ dark: !dark })}
                trackColor={{
                  true: themeContext.colors.colorPrimary,
                  false: darken(0.2, themeContext.colors.colorLightGrey)
                }}
                style={{ marginLeft: 'auto' }}
              />
            </SettingsItem>
            <SettingsItem
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Text variant='p'>App Version</Text>
              <Text variant='p' style={{ marginLeft: 'auto' }}>
                {appSettings.expo.version}
              </Text>
            </SettingsItem>
          </>
        )}
      </SectionSpacer>
    </Container>
  )
}

const SettingsItem = styled.View`
  width: 100%;
  background-color: ${props => props.theme.colors.colorLightGrey};
  padding: 16px;
  border-radius: 2px;
  margin: 8px 0;
`

export default Settings
