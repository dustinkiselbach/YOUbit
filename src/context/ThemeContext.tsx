import React, { createContext, useContext, useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { darkTheme } from '../themes/darkTheme'
import { myTheme } from '../themes/myTheme'
import { StatusBar } from 'expo-status-bar'
import AsyncStorage from '@react-native-async-storage/async-storage'

const initialState = { dark: false }

const ThemeStateContext = createContext(initialState)
const ThemeActionContext = createContext<
  | React.Dispatch<
      React.SetStateAction<{
        dark: boolean
      }>
    >
  | undefined
>(undefined)

export const ThemeContextProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState(initialState)

  useEffect(() => {
    ;(async () => {
      const userPreference = await AsyncStorage.getItem('DARK')
      if (userPreference) {
        setTheme({ dark: true })
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (theme.dark) {
        await AsyncStorage.setItem('DARK', 'true')
      } else {
        await AsyncStorage.removeItem('DARK')
      }
    })()
  }, [theme])

  return (
    <ThemeActionContext.Provider value={setTheme}>
      <ThemeStateContext.Provider value={theme}>
        <ThemeProvider theme={theme.dark ? darkTheme : myTheme}>
          {children}
        </ThemeProvider>
      </ThemeStateContext.Provider>
      <StatusBar style={theme.dark ? 'inverted' : 'dark'} />
    </ThemeActionContext.Provider>
  )
}

export const useThemeActionContext = () => useContext(ThemeActionContext)
export const useThemeStateContext = () => useContext(ThemeStateContext)
