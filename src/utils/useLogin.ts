import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'
import { useAuthDispatchContext } from '../context'
import {
  useCreateDeviceMutation,
  UserCredentialsFragment
} from '../generated/graphql'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})

const useLogin = (): ((credentials: UserCredentialsFragment) => void)[] => {
  const dispatch = useAuthDispatchContext()
  const [createDevice] = useCreateDeviceMutation()

  if (!dispatch) {
    throw new Error('dispatch is not defined')
  }
  // @todo fix this
  let platform = 'iOS'

  if (Platform.OS === 'android') {
    platform = 'Android'
  }

  const login = async ({
    accessToken,
    client,
    uid,
    expiry
  }: UserCredentialsFragment): Promise<void> => {
    // get token from storage if it exists
    let token = await AsyncStorage.getItem('NOTIFICATION_TOKEN')
    try {
      await AsyncStorage.setItem('ACCESS_TOKEN', accessToken)
      await AsyncStorage.setItem('CLIENT', client)
      await AsyncStorage.setItem('UID', uid)
      await AsyncStorage.setItem('EXPIRY', `${expiry}`)
      dispatch({ type: 'SIGN_IN' })
      //if it doesn't exist register for permissions
      if (!token) {
        console.log('asking for permissions async')
        token = (await registerForPushNotificationsAsync()) || null
        if (token) {
          await AsyncStorage.setItem('NOTIFICATION_TOKEN', token)
        }
      }

      if (token) {
        await createDevice({ variables: { token, platform } })
      }
    } catch (err) {
      console.log((err as Error).message)
    }
  }
  return [login]
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

export default useLogin
