import React, { useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Container, Dates, HabitCard, SectionSpacer, Text } from '../components'
import { useHabitIndexQuery } from '../generated/graphql'
import { HabitStackNav } from '../types'
import { daysOfWeek, getCurrentWeek, useLogout } from '../utils'

const currentWeek = getCurrentWeek()

const Habits: React.FC<HabitStackNav<'HabitsList'>> = () => {
  const [logout] = useLogout()
  const [day, setDay] = useState(new Date())

  const { data, error, loading } = useHabitIndexQuery({
    variables: {
      dayOfWeek: [daysOfWeek[day.getDay()]],
      active: true,
      selectedDate: currentWeek[day.getDay()].toISOString().split('T')[0]
    }
  })

  if (error) {
    logout()
  }

  const completedActivities = data?.habitIndex.filter(
    ({ isLogged: { logged } }) => logged
  )
  const notCompletedActivities = data?.habitIndex.filter(
    ({ isLogged: { logged } }) => !logged
  )

  let allActivities: JSX.Element | null = null

  // @todo convert to FlatList

  if (completedActivities && notCompletedActivities) {
    allActivities = (
      <>
        {notCompletedActivities.map(({ name, id, habitType, ...rest }) => (
          <HabitCard key={id} {...{ name, id, habitType, day, rest }} />
        ))}
        {completedActivities.length ? (
          <>
            <Text variant='h4' style={{ marginBottom: 8 }}>
              Completed
            </Text>
            {completedActivities.map(({ name, id, habitType, ...rest }) => (
              <HabitCard key={id} {...{ name, id, habitType, day, rest }} />
            ))}
          </>
        ) : null}
      </>
    )
  }

  return (
    <Container>
      <Dates dates={currentWeek} selected={day} changeSelected={setDay} />
      <ScrollView>
        <SectionSpacer>
          {loading ? (
            <ActivityIndicator size='large' color='#00C2CB' />
          ) : (
            allActivities
          )}
        </SectionSpacer>
      </ScrollView>
    </Container>
  )
}

export default Habits
