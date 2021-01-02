import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

type UpdateHabitProps = {
  name: string
  habitType: string
  id: string
  frequency: string[]
  startDate: any
}

export type HabitStackParamList = {
  HabitsList: undefined
  HabitDetail: undefined
  HabitUpdate: UpdateHabitProps
}

export type HabitStackNav<RouteName extends keyof HabitStackParamList> = {
  navigation: StackNavigationProp<HabitStackParamList, RouteName>
  route: RouteProp<HabitStackParamList, RouteName>
}
