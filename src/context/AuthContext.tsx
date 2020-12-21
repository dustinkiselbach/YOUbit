import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useReducer } from 'react'

const actionTypes = ['SIGN_IN', 'SIGN_OUT'] as const

const initialState = {
  signedIn: false
}

const AuthStateContext = createContext(initialState)
const AuthDispatchContext = createContext<
  | React.Dispatch<{
      type: typeof actionTypes[number]
    }>
  | undefined
>(undefined)

const authReducer = (
  state: typeof initialState,
  action: { type: typeof actionTypes[number] }
): typeof initialState => {
  switch (action.type) {
    case 'SIGN_IN':
      return { signedIn: true }
    case 'SIGN_OUT':
      return { signedIn: false }
    default:
      throw new Error('action type does not exist')
  }
}

export const AuthContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // @todo need additional logic to check if token is valid
  useEffect(() => {
    ;(async () => {
      try {
        const token = await AsyncStorage.getItem('ACCESS_TOKEN')
        if (token) {
          dispatch({ type: 'SIGN_IN' })
        }
      } catch (err) {
        console.log((err as Error).message)
      }
    })()
  }, [])

  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  )
}

export const useAuthStateContext = () => useContext(AuthStateContext)
export const useAuthDispatchContext = () => useContext(AuthDispatchContext)
