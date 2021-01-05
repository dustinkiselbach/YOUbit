import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HabitArchive, HabitCreate, Settings } from '../screens'
import HabitStack from './HabitStack'
import { MainTabParamList } from '../types'
import { TabBar } from '../components'

const Tab = createBottomTabNavigator<MainTabParamList>()

const MainTab: React.FC = () => {
  return (
    <Tab.Navigator tabBar={props => <TabBar {...props} />}>
      <Tab.Screen name='Habits' component={HabitStack} />
      <Tab.Screen name='HabitCreate' component={HabitCreate} />
      <Tab.Screen name='Settings' component={Settings} />
      <Tab.Screen name='HabitArchive' component={HabitArchive} />
    </Tab.Navigator>
  )
}

export default MainTab
