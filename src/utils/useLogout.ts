import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuthDispatchContext } from '../context'

const useLogin = (): (() => void)[] => {
  const dispatch = useAuthDispatchContext()

  if (!dispatch) {
    throw new Error('dispatch is not defined')
  }

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.clear()
      dispatch({ type: 'SIGN_OUT' })
    } catch (err) {
      console.log((err as Error).message)
    }
  }
  return [logout]
}
export default useLogin
