import React from 'react'
import { FlatList, Alert, ActivityIndicator } from 'react-native'
import styled, { ThemeContext } from '../../styled-components'
import { Container, Text, Title } from '../components'
import {
  ArchivedHabitsDocument,
  RemindersIndexDocument,
  useArchivedHabitsQuery,
  useArchiveOrActivateHabitMutation,
  useDestroyHabitMutation
} from '../generated/graphql'
import { daysOfWeek, useLogout } from '../utils'
import { Feather } from '@expo/vector-icons'
import { useContext } from 'react'

const HabitArchive: React.FC = () => {
  const [logout] = useLogout()
  const [destroyHabit] = useDestroyHabitMutation()
  const [archiveOrActivateHabit] = useArchiveOrActivateHabitMutation()
  const { data, error, loading } = useArchivedHabitsQuery({
    variables: {
      active: false,
      dayOfWeek: (daysOfWeek as unknown) as string[]
    }
  })
  const themeContext = useContext(ThemeContext)

  if (error) {
    logout()
  }

  return (
    <Container>
      <Title>Archive</Title>
      {!data?.habitIndex.length && !loading ? (
        <Text variant='h4' style={{ marginTop: 16 }}>
          Nothing currently archived
        </Text>
      ) : loading ? (
        <ActivityIndicator size='large' color='#00C2CB' />
      ) : (
        <FlatList
          data={data?.habitIndex}
          renderItem={({ item }) => (
            <ArchivedHabitItem>
              <Text variant='h5' style={{ flex: 1 }}>
                {item.name}
              </Text>
              <ArchivedHabitIcon
                onPress={() => {
                  Alert.alert('Unarchive', `Unarchive ${item.name}?`, [
                    {
                      text: 'Cancel',
                      style: 'cancel'
                    },
                    {
                      text: 'OK',
                      onPress: async () => {
                        try {
                          await archiveOrActivateHabit({
                            variables: {
                              habitId: item.id,
                              active: true
                            },
                            // too much stuff to update *shrug*
                            update: async store => {
                              await store.reset()
                            }
                          })
                        } catch (err) {
                          console.log((err as Error).message)
                        }
                      }
                    }
                  ])
                }}
              >
                <Feather
                  name='plus'
                  size={24}
                  color={themeContext.colors.colorText}
                />
              </ArchivedHabitIcon>
              <ArchivedHabitIcon
                onPress={() => {
                  Alert.alert('Delete Habit', `Delete ${item.name} Forever?`, [
                    {
                      text: 'Cancel',
                      style: 'cancel'
                    },
                    {
                      text: 'OK',
                      onPress: async () => {
                        try {
                          await destroyHabit({
                            variables: { habitId: item.id },
                            refetchQueries: [
                              {
                                query: ArchivedHabitsDocument,
                                variables: {
                                  active: false,
                                  dayOfWeek: (daysOfWeek as unknown) as string[]
                                }
                              },
                              {
                                query: RemindersIndexDocument
                              }
                            ]
                          })
                        } catch (err) {
                          console.log(err)
                        }
                      },
                      style: 'destructive'
                    }
                  ])
                }}
              >
                <Feather
                  name='trash'
                  size={24}
                  color={themeContext.colors.colorText}
                />
              </ArchivedHabitIcon>
            </ArchivedHabitItem>
          )}
        />
      )}
    </Container>
  )
}

const ArchivedHabitItem = styled.View`
  background-color: ${({ theme }) => theme.colors.colorLightGrey};
  margin: 8px 0;
  padding: 10px 12px;
  flex-direction: row;
  align-items: center;
`

const ArchivedHabitIcon = styled.TouchableOpacity`
  padding: 8px;
`

export default HabitArchive
