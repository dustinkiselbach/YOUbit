import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { HabitDetail, Habits, HabitUpdate } from '../screens'
import { HabitStackParamList } from '../types'

const Stack = createStackNavigator<HabitStackParamList>()

const HabitStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        title: '',
        headerStyle: { backgroundColor: 'white', elevation: 0 }
      }}
    >
      <Stack.Screen
        name='HabitsList'
        component={Habits}
        options={{ headerShown: false }}
      />
      <Stack.Screen name='HabitDetail' component={HabitDetail} />
      <Stack.Screen name='HabitUpdate' component={HabitUpdate} />
    </Stack.Navigator>
  )
}

export default HabitStack
