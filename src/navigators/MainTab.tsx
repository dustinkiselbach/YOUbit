import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HabitArchive, HabitCreate, HabitReminders, Settings } from '../screens'
import HabitStack from './HabitStack'
import { MainTabParamList } from '../types'
import { Feather } from '@expo/vector-icons'

function getIcon (
  route: keyof MainTabParamList
): 'list' | 'plus-circle' | 'settings' | 'alert-triangle' | 'archive' | 'bell' {
  switch (route) {
    case 'Habits':
      return 'list'
    case 'HabitCreate':
      return 'plus-circle'
    case 'Settings':
      return 'settings'
    case 'HabitArchive':
      return 'archive'
    case 'HabitReminders':
      return 'bell'
    default:
      return 'alert-triangle'
  }
}

const Tab = createBottomTabNavigator<MainTabParamList>()

const MainTab: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ color, size }) => {
          // You can return any component that you like here!
          return (
            <Feather name={getIcon(route.name)} size={size} color={color} />
          )
        }
      })}
      tabBarOptions={{
        labelStyle: { fontFamily: 'OpenSans-Regular' },
        activeTintColor: '#00C2CB',
        inactiveTintColor: '#535353'
      }}
    >
      <Tab.Screen name='Habits' component={HabitStack} />
      <Tab.Screen
        name='HabitReminders'
        component={HabitReminders}
        options={{ title: 'Reminders' }}
      />
      <Tab.Screen
        name='HabitCreate'
        component={HabitCreate}
        options={{ title: 'Create' }}
      />
      <Tab.Screen name='Settings' component={Settings} />
      <Tab.Screen
        name='HabitArchive'
        component={HabitArchive}
        options={{ title: 'Archive' }}
      />
    </Tab.Navigator>
  )
}

export default MainTab
