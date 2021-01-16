import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { RouteProp } from '@react-navigation/native'

type HabitReminderParams = {
  habitParamId: string
  dateString: string
  dayOfWeek: (
    | 'sunday'
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
  )[]
}

export type MainTabParamList = {
  Habits: undefined
  HabitReminders?: HabitReminderParams
  HabitCreate: undefined
  Settings: undefined
  HabitArchive: undefined
}

export type MainTabNav<RouteName extends keyof MainTabParamList> = {
  navigation: BottomTabNavigationProp<MainTabParamList, RouteName>
  route: RouteProp<MainTabParamList, RouteName>
}
