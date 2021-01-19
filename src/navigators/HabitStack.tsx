import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { HabitCategories, HabitDetail, Habits, HabitUpdate } from '../screens'
import { HabitStackParamList } from '../types'
import { ThemeContext } from '../../styled-components'

const Stack = createStackNavigator<HabitStackParamList>()
// MainStack.Navigator detachInactiveScreens={false} screenOptions={{ animationEnabled: false }}
const HabitStack: React.FC = () => {
  const themeContext = useContext(ThemeContext)
  return (
    <Stack.Navigator
      screenOptions={{
        title: '',
        headerTintColor: themeContext.colors.colorSecondary,
        headerStyle: {
          backgroundColor: themeContext.colors.colorBackground,
          elevation: 0
        }
      }}
    >
      <Stack.Screen
        name='HabitsList'
        component={Habits}
        options={{ headerShown: false }}
      />
      <Stack.Screen name='HabitDetail' component={HabitDetail} />
      <Stack.Screen name='HabitUpdate' component={HabitUpdate} />
      <Stack.Screen name='HabitCategories' component={HabitCategories} />
    </Stack.Navigator>
  )
}

export default HabitStack
