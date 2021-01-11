import { ApolloError } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'
import { Platform } from 'react-native'
import { useEffect } from 'react'
import { useCreateDeviceMutation } from '../generated/graphql'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})
// @todo this may be unnecessary, the logic could likely be added to the useLogin,

export default function useRegisterForPushNotifications (): void {
  const [createDevice] = useCreateDeviceMutation()

  useEffect(() => {
    ;(async () => {
      if (!(await AsyncStorage.getItem('NOTIFICATION_TOKEN'))) {
        const token = await registerForPushNotificationsAsync()
        if (token) {
          await AsyncStorage.setItem('NOTIFICATION_TOKEN', token)

          try {
            console.log('yes')
            //@todo fix this for more cases
            let platform = 'iOS'

            if (Platform.OS === 'android') {
              platform = 'Android'
            }

            await createDevice({ variables: { token, platform } })
          } catch (err) {
            console.log((err as ApolloError).graphQLErrors)
          }
        }
      }
    })()
  }, [createDevice])
}

async function registerForPushNotificationsAsync (): Promise<
  string | undefined
> {
  let token
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    )
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = (await Notifications.getExpoPushTokenAsync()).data
  } else {
    alert('Must use physical device for Push Notifications')
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    })
  }

  return token
}
