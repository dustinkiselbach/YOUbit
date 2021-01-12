import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { RouteProp } from '@react-navigation/native'

export type MainTabParamList = {
  Habits: undefined
  HabitReminders: undefined
  HabitCreate: undefined
  Settings: undefined
  HabitArchive: undefined
}

export type MainTabNav<RouteName extends keyof MainTabParamList> = {
  navigation: BottomTabNavigationProp<MainTabParamList, RouteName>
  route: RouteProp<MainTabParamList, RouteName>
}
