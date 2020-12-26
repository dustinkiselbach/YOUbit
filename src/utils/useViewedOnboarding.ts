import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuthDispatchContext } from '../context'

const useViewedOnboarding = (): (() => void)[] => {
  const dispatch = useAuthDispatchContext()

  if (!dispatch) {
    throw new Error('dispatch is not defined')
  }

  const complete = async (): Promise<void> => {
    await AsyncStorage.setItem('VIEWED_ONBOARDING', 'true')
    dispatch({ type: 'VIEWED_ONBOARDING' })
  }

  return [complete]
}
export default useViewedOnboarding
