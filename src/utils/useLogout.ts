import { useApolloClient } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuthDispatchContext } from '../context'

// have to wipe out cache
const useLogout = (): (() => void)[] => {
  const dispatch = useAuthDispatchContext()
  const client = useApolloClient()

  if (!dispatch) {
    throw new Error('dispatch is not defined')
  }

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('ACCESS_TOKEN')
      await AsyncStorage.removeItem('CLIENT')
      await AsyncStorage.removeItem('UID')
      await AsyncStorage.removeItem('EXPIRY')
      await client.resetStore()
      dispatch({ type: 'SIGN_OUT' })
    } catch (err) {
      console.log((err as Error).message)
    }
  }
  return [logout]
}
export default useLogout
