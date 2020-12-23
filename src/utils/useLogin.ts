import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuthDispatchContext } from '../context'
import { UserCredentialsFragment } from '../generated/graphql'

const useLogin = (): ((credentials: UserCredentialsFragment) => void)[] => {
  const dispatch = useAuthDispatchContext()

  if (!dispatch) {
    throw new Error('dispatch is not defined')
  }

  const login = async ({
    accessToken,
    client,
    uid,
    expiry
  }: UserCredentialsFragment): Promise<void> => {
    try {
      await AsyncStorage.setItem('ACCESS_TOKEN', accessToken)
      await AsyncStorage.setItem('CLIENT', client)
      await AsyncStorage.setItem('UID', uid)
      await AsyncStorage.setItem('EXPIRY', `${expiry}`)
      dispatch({ type: 'SIGN_IN' })
    } catch (err) {
      console.log((err as Error).message)
    }
  }
  return [login]
}
export default useLogin
