import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Platform } from 'react-native'
import { ChangePassword, Login, Register, ResetPassword } from '../screens'
import { AuthStackParamList } from '../types'

const Stack = createStackNavigator<AuthStackParamList>()

const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: Platform.select({ android: false, ios: true })
      }}
    >
      <Stack.Screen name='Register' component={Register} />
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='ResetPassword' component={ResetPassword} />
      <Stack.Screen name='ChangePassword' component={ChangePassword} />
    </Stack.Navigator>
  )
}

export default AuthStack
