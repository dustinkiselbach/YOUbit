import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

type HabitDetailAndUpdateProps = {
  id: string
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

export type HabitStackParamList = {
  HabitsList: undefined
  HabitDetail: HabitDetailAndUpdateProps
  HabitUpdate: HabitDetailAndUpdateProps
}

export type HabitStackNav<RouteName extends keyof HabitStackParamList> = {
  navigation: StackNavigationProp<HabitStackParamList, RouteName>
  route: RouteProp<HabitStackParamList, RouteName>
}
