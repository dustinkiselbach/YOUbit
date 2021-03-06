import React, { useContext } from 'react'
import styled, { ThemeContext } from '../../styled-components'
import { Container, Text, HabitCompleted, Spacer, Title } from '../components'
import { FontAwesome5 } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'

import { HabitStackNav, HabitStackParamList, MainTabParamList } from '../types'
import {
  HabitIndexDocument,
  useCreateHabitLogMutation,
  useDestroyHabitLogMutation,
  useHabitIndexQuery
} from '../generated/graphql'

import { isFuture } from 'date-fns'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { CompositeNavigationProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

type HabitDetailNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Habits'>,
  StackNavigationProp<HabitStackParamList>
>

const HabitDetail: React.FC<HabitStackNav<'HabitDetail'>> = ({
  route: {
    params: { id, dateString, dayOfWeek }
  },
  navigation
}) => {
  const future = isFuture(new Date(dateString))

  const { data, error } = useHabitIndexQuery({
    variables: {
      dayOfWeek: dayOfWeek,
      active: true,
      selectedDate: dateString
    },
    // @todo figure out why current streak doesn't update in cache cache-and-network fixes
    fetchPolicy: 'cache-and-network'
  })
  const [createHabitLog] = useCreateHabitLogMutation()
  const [destroyHabitLog] = useDestroyHabitLogMutation()
  const themeContext = useContext(ThemeContext)

  const habit = data?.habitIndex.filter(habit => habit.id === id)

  if (!habit || error) {
    return <Text variant='h3'>The Specified habit was not found</Text>
  }

  const {
    name,
    frequency,
    habitType,
    isLogged,
    longestStreak,
    currentStreak,
    reminders,
    category
  } = habit[0]

  return (
    <Container notSafe>
      <_HabitDetail>
        <HabitDetailTop>
          <Title>{name}</Title>
          <Text variant='p'>
            Type: <Text variant='h5'>{habitType}</Text>
          </Text>
          <Text variant='p' style={{ marginBottom: 8 }}>
            Category: <Text variant='h5'>{category.name}</Text>
          </Text>
          <Text variant='p'>{frequency.map(day => day + ' ')}</Text>

          <Spacer>
            <HabitCompletedContainer>
              <HabitCompleted
                isLogged={isLogged.logged}
                future={future}
                large
                onPress={async () => {
                  if (future) {
                    return
                  }
                  if (isLogged.logged) {
                    try {
                      await destroyHabitLog({
                        variables: { habitLogId: isLogged.habitLog?.id || '' },
                        refetchQueries: [
                          {
                            query: HabitIndexDocument,
                            variables: {
                              dayOfWeek,
                              active: true,
                              selectedDate: dateString
                            }
                          }
                        ]
                      })
                    } catch (err) {
                      console.log((err as Error).message)
                    }
                  } else {
                    try {
                      await createHabitLog({
                        variables: {
                          habitId: id,
                          habitType,
                          loggedDate: dateString
                        },
                        refetchQueries: [
                          {
                            query: HabitIndexDocument,
                            variables: {
                              dayOfWeek,
                              active: true,
                              selectedDate: dateString
                            }
                          }
                        ]
                      })
                    } catch (err) {
                      console.log((err as Error).message)
                    }
                  }
                }}
              >
                {isLogged.logged ? (
                  <FontAwesome5
                    name='check'
                    size={28}
                    color='rgba(255,255,255,0.9)'
                  />
                ) : null}
              </HabitCompleted>
              {isLogged.logged ? (
                <Text variant='h5'>
                  {habitType === 'limit'
                    ? "There's always tomorrow"
                    : 'You are amazing!'}
                </Text>
              ) : null}
            </HabitCompletedContainer>
          </Spacer>
        </HabitDetailTop>
        <Spacer>
          <HabitDetailStreaks>
            <Text variant='h2'>Streaks</Text>
            <Spacer>
              <StreakItems>
                <StreakItem>
                  <StreakCircle>
                    <StreakNumber>
                      {currentStreak ? currentStreak.habitStreak || '0' : '0'}
                    </StreakNumber>
                  </StreakCircle>
                  <Text variant='h5'>Current streak</Text>
                </StreakItem>
                <StreakItem>
                  <StreakCircle>
                    <StreakNumber>
                      {longestStreak ? longestStreak.habitStreak || '0' : '0'}
                    </StreakNumber>
                  </StreakCircle>
                  <Text variant='h5'>Highest streak</Text>
                </StreakItem>
              </StreakItems>
            </Spacer>
          </HabitDetailStreaks>
        </Spacer>
        <Spacer>
          <HabitDetailReminders>
            <Text variant='h2'>Reminders</Text>
            {reminders?.length ? (
              reminders?.map(({ id, remindAt }) => (
                <ReminderItem key={id}>
                  <Text variant='p'>
                    {new Date(remindAt).toLocaleTimeString()}
                  </Text>
                </ReminderItem>
              ))
            ) : (
              <ReminderItem>
                <Text variant='p'>No reminders for this habit</Text>
              </ReminderItem>
            )}
            <DetailIcon
              onPress={() =>
                (navigation as HabitDetailNavigationProp).navigate(
                  'HabitReminders',
                  {
                    habitParamId: id,
                    dateString,
                    dayOfWeek
                  }
                )
              }
            >
              <Feather
                name='plus'
                size={24}
                color={themeContext.colors.colorText}
              />
            </DetailIcon>
          </HabitDetailReminders>
        </Spacer>
      </_HabitDetail>
    </Container>
  )
}

const _HabitDetail = styled.ScrollView``
const HabitDetailTop = styled.View``
const HabitDetailStreaks = styled.View``
const StreakItems = styled.View`
  flex-direction: row;
`

const StreakItem = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`
const StreakCircle = styled.View`
  height: 50px;
  width: 75px;
  border-radius: 2px;
  background-color: white;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.colorPrimary};
  margin-bottom: 8px;
`

const StreakNumber = styled.Text`
  font-size: 35px;
  font-family: 'OpenSans-Bold';
  color: rgba(255, 255, 255, 0.9);
`

const HabitCompletedContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

const HabitDetailReminders = styled.View``

const ReminderItem = styled.View`
  margin-top: 4px;
`

const DetailIcon = styled.TouchableOpacity`
  padding: 4px;
  width: 32px;
`

export default HabitDetail
