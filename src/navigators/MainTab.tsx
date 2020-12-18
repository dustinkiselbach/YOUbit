import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HabitCreate } from '../screens'
import HabitStack from './HabitStack'
import { MainTabParamList } from '../types'

const Tab = createBottomTabNavigator<MainTabParamList>()

const MainTab: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Habits' component={HabitStack} />
      <Tab.Screen name='HabitCreate' component={HabitCreate} />
    </Tab.Navigator>
  )
}

export default MainTab
