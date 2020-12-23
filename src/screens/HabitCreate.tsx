import React from 'react'
import { Text } from 'react-native'
import { Container, SectionSpacer } from '../components'
import { MainTabNav } from '../types'

const HabitCreate: React.FC<MainTabNav<'HabitCreate'>> = () => {
  // const { loading, error, data } = useGetExchangeRatesQuery()
  // if (loading) {
  //   return <Text>fart</Text>
  // }
  // if (error) {
  //   return <Text>error?</Text>
  // }
  // console.log()

  return (
    <Container>
      <SectionSpacer>
        <Text>Habit Create</Text>
      </SectionSpacer>
    </Container>
  )
}

export default HabitCreate
