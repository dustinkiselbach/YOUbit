import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

export type HabitStackParamList = {
  HabitsList: undefined
  HabitDetail: undefined
}

export type HabitStackNav<RouteName extends keyof HabitStackParamList> = {
  navigation: StackNavigationProp<HabitStackParamList, RouteName>
  route: RouteProp<HabitStackParamList, RouteName>
}
