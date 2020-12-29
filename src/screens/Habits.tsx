import React, { useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Container, Dates, HabitCard, SectionSpacer } from '../components'
import { useHabitIndexQuery } from '../generated/graphql'
import { HabitStackNav } from '../types'
import { daysOfWeek, getCurrentWeek } from '../utils'

const currentWeek = getCurrentWeek()

const Habits: React.FC<HabitStackNav<'HabitsList'>> = () => {
  const [day, setDay] = useState(new Date())
  const { data, error, loading } = useHabitIndexQuery({
    variables: { dayOfWeek: [daysOfWeek[day.getDay()]], active: true }
  })

  if (error) {
    console.log(error)
  }

  return (
    <Container>
      <Dates dates={currentWeek} selected={day} changeSelected={setDay} />
      <ScrollView>
        <SectionSpacer>
          {data
            ? data.habitIndex.map(({ name, id }) => (
                <HabitCard key={id} {...{ name, id }} />
              ))
            : null}
        </SectionSpacer>
      </ScrollView>
    </Container>
  )
}

export default Habits
