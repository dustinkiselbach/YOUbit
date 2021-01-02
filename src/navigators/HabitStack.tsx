import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { HabitDetail, Habits, HabitUpdate } from '../screens'
import { HabitStackParamList } from '../types'

const Stack = createStackNavigator<HabitStackParamList>()

const HabitStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='HabitsList' component={Habits} />
      <Stack.Screen name='HabitDetail' component={HabitDetail} />
      <Stack.Screen name='HabitUpdate' component={HabitUpdate} />
    </Stack.Navigator>
  )
}

export default HabitStack
