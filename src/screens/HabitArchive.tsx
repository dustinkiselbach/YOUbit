import React from 'react'
import { FlatList, Alert, ActivityIndicator } from 'react-native'
import styled from '../../styled-components'
import { Container, Text } from '../components'
import {
  ArchivedHabitsDocument,
  useArchivedHabitsQuery,
  useDestroyHabitMutation
} from '../generated/graphql'
import { daysOfWeek, useLogout } from '../utils'
import { Feather } from '@expo/vector-icons'

const HabitArchive: React.FC = () => {
  const [logout] = useLogout()
  const [destroyHabit] = useDestroyHabitMutation()
  const { data, error, loading } = useArchivedHabitsQuery({
    variables: {
      active: false,
      dayOfWeek: (daysOfWeek as unknown) as string[]
    },
    fetchPolicy: 'cache-and-network'
  })

  if (error) {
    logout()
  }

  return (
    <Container>
      <Text variant='h1' style={{ marginTop: 16 }}>
        Archive
      </Text>
      {loading ? (
        <ActivityIndicator size='large' color='#00C2CB' />
      ) : (
        <FlatList
          data={data?.habitIndex}
          renderItem={({ item }) => (
            <ArchivedHabitItem>
              <Text variant='h5' style={{ flex: 1 }}>
                {item.name}
              </Text>
              <DeleteArchivedHabit>
                <Feather
                  name='trash'
                  size={24}
                  color='#535353'
                  onPress={() => {
                    Alert.alert(
                      'Delete Habit',
                      `Delete ${item.name} Forever?`,
                      [
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
                                  }
                                ]
                              })
                            } catch (err) {
                              console.log(err)
                            }
                          },
                          style: 'destructive'
                        }
                      ]
                    )
                  }}
                />
              </DeleteArchivedHabit>
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

const DeleteArchivedHabit = styled.TouchableOpacity`
  padding: 8px;
`

export default HabitArchive
