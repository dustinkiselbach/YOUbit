import { ca } from 'date-fns/locale'
import React, { useContext, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { ThemeContext } from '../../styled-components'
import { Container, Dates, HabitCard, SectionSpacer, Text } from '../components'
import { useHabitIndexQuery } from '../generated/graphql'
import { HabitStackNav } from '../types'
import { daysOfWeek, getCurrentWeek, useLogout } from '../utils'

const currentWeek = getCurrentWeek()
// console.log(format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"))

const Habits: React.FC<HabitStackNav<'HabitsList'>> = ({
  navigation,
  route
}) => {
  const [logout] = useLogout()
  const [day, setDay] = useState(new Date())

  const { data, error, loading } = useHabitIndexQuery({
    variables: {
      dayOfWeek: [daysOfWeek[day.getDay()]],
      active: true,
      selectedDate: currentWeek[day.getDay()].toISOString().split('T')[0]
    }
  })
  const themeContext = useContext(ThemeContext)
  const category = route.params?.category

  if (error) {
    logout()
  }

  const none = !data?.habitIndex.length

  const completedActivities = data?.habitIndex.filter(
    ({ category: { name }, isLogged: { logged } }) => {
      return logged && (!category || category === name)
    }
  )
  const notCompletedActivities = data?.habitIndex.filter(
    ({ category: { name }, isLogged: { logged } }) => {
      return !logged && (!category || category === name)
    }
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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8
        }}
      >
        <Text variant='h3'>{category ? category : 'All Habits'}</Text>
        <TouchableOpacity
          style={{ marginLeft: 'auto' }}
          onPress={() => navigation.navigate('HabitCategories')}
        >
          <Text
            variant='p'
            style={{ color: themeContext.colors.colorSecondary }}
          >
            Select Category
          </Text>
        </TouchableOpacity>
      </View>

      <Dates dates={currentWeek} selected={day} changeSelected={setDay} />
      {none && !loading ? (
        <Text variant='h4' style={{ marginTop: 16 }}>
          No habits for this day
        </Text>
      ) : (
        <ScrollView>
          <SectionSpacer>
            {loading ? (
              <ActivityIndicator size='large' color='#00C2CB' />
            ) : (
              allActivities
            )}
          </SectionSpacer>
        </ScrollView>
      )}
    </Container>
  )
}

export default Habits
