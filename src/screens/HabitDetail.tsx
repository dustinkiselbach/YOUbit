import React from 'react'
import { View, Text } from 'react-native'
import { HabitStackNav } from '../types'

const HabitDetail: React.FC<HabitStackNav<'HabitDetail'>> = () => {
  return (
    <View>
      <Text>Habit Detail</Text>
    </View>
  )
}

export default HabitDetail
