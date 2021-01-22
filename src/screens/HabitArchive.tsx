import React, { useState } from 'react'
import { FlatList, Alert, ActivityIndicator, View } from 'react-native'
import styled, { ThemeContext } from '../../styled-components'
import { Container, SectionSpacer, Text, Title } from '../components'
import {
  ArchivedHabitsDocument,
  ArchivedHabitsQuery,
  CategoriesIndexDocument,
  useArchivedHabitsQuery,
  useArchiveOrActivateHabitMutation,
  useDestroyHabitMutation
} from '../generated/graphql'
import { daysOfWeek, useLogout } from '../utils'
import { Feather } from '@expo/vector-icons'
import { useContext } from 'react'
import * as Haptics from 'expo-haptics'

// @todo weird cache stuff when changing multiple items
// needs to be refactored

const HabitArchive: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([])
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
  const hasSelectedAny = selected.length > 0

  if (error) {
    logout()
  }

  return (
    <Container>
      <SectionSpacer>
        <Top>
          <Title>Archive</Title>
          {hasSelectedAny ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ArchivedHabitIcon
                onPress={() => {
                  Alert.alert(
                    'Unarchive',
                    `Unarchive ${selected.length} habit${
                      selected.length > 1 ? 's' : ''
                    }?`,
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel'
                      },
                      {
                        text: 'OK',
                        onPress: async () => {
                          try {
                            for (const id of selected) {
                              await archiveOrActivateHabit({
                                variables: {
                                  habitId: id,
                                  active: true
                                },
                                // too much stuff to update *shrug*
                                update: async store => {
                                  await store.reset()
                                }
                              })
                            }
                            setSelected([])
                          } catch (err) {
                            console.log((err as Error).message)
                          }
                        }
                      }
                    ]
                  )
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
                  Alert.alert(
                    'Delete',
                    `Delete ${selected.length} habit${
                      selected.length > 1 ? 's' : ''
                    } forever?`,
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel'
                      },
                      {
                        text: 'OK',
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            for (const id of selected) {
                              await destroyHabit({
                                variables: { habitId: id },
                                refetchQueries: [
                                  { query: CategoriesIndexDocument }
                                ],
                                update: (store, { data }) => {
                                  const archivedHabits = store.readQuery<
                                    ArchivedHabitsQuery
                                  >({
                                    query: ArchivedHabitsDocument,
                                    variables: {
                                      active: false,
                                      dayOfWeek: (daysOfWeek as unknown) as string[]
                                    }
                                  })

                                  if (archivedHabits) {
                                    const newArchivedHabits = archivedHabits.habitIndex.filter(
                                      habit =>
                                        habit.id !==
                                        data?.destroyHabit?.habit.id
                                    )

                                    store.writeQuery<ArchivedHabitsQuery>({
                                      query: ArchivedHabitsDocument,
                                      variables: {
                                        active: false,
                                        dayOfWeek: (daysOfWeek as unknown) as string[]
                                      },
                                      data: {
                                        habitIndex: newArchivedHabits
                                      }
                                    })
                                  }
                                }
                              })
                            }
                            setSelected([])
                          } catch (err) {
                            console.log((err as Error).message)
                          }
                        }
                      }
                    ]
                  )
                }}
              >
                <Feather
                  name='trash'
                  size={24}
                  color={themeContext.colors.colorText}
                />
              </ArchivedHabitIcon>
              <Text variant='h4' style={{ padding: 8 }}>
                {selected.length}
              </Text>
            </View>
          ) : null}
        </Top>
        {!data?.habitIndex.length && !loading ? (
          <Text variant='h4'>Nothing currently archived</Text>
        ) : loading ? (
          <ActivityIndicator
            size='large'
            color={themeContext.colors.colorPrimary}
          />
        ) : (
          <FlatList
            data={data?.habitIndex}
            contentContainerStyle={{
              paddingHorizontal: hasSelectedAny ? 16 : 0
            }}
            renderItem={({ item }) => {
              const isSelected = selected.indexOf(item.id) !== -1

              return (
                <ArchivedHabitItem
                  isSelected={isSelected}
                  onLongPress={async () => {
                    await Haptics.impactAsync(
                      Haptics.ImpactFeedbackStyle.Medium
                    )
                    setSelected(currSelected =>
                      currSelected.indexOf(item.id) === -1
                        ? [...currSelected, item.id]
                        : currSelected
                    )
                  }}
                  onPress={async () => {
                    if (hasSelectedAny) {
                      await Haptics.impactAsync(
                        Haptics.ImpactFeedbackStyle.Light
                      )
                      if (isSelected) {
                        setSelected(currSelected =>
                          currSelected.filter(cs => cs !== item.id)
                        )
                      } else {
                        setSelected(currSelected => [...currSelected, item.id])
                      }
                    }
                  }}
                >
                  <Text variant='h5' style={{ flex: 1 }}>
                    {item.name}
                  </Text>
                  {hasSelectedAny ? null : (
                    <>
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
                                        { query: CategoriesIndexDocument }
                                      ],
                                      update: (store, { data }) => {
                                        const archivedHabits = store.readQuery<
                                          ArchivedHabitsQuery
                                        >({
                                          query: ArchivedHabitsDocument,
                                          variables: {
                                            active: false,
                                            dayOfWeek: (daysOfWeek as unknown) as string[]
                                          }
                                        })

                                        if (archivedHabits) {
                                          const newArchivedHabits = archivedHabits.habitIndex.filter(
                                            habit =>
                                              habit.id !==
                                              data?.destroyHabit?.habit.id
                                          )

                                          store.writeQuery<ArchivedHabitsQuery>(
                                            {
                                              query: ArchivedHabitsDocument,
                                              variables: {
                                                active: false,
                                                dayOfWeek: (daysOfWeek as unknown) as string[]
                                              },
                                              data: {
                                                habitIndex: newArchivedHabits
                                              }
                                            }
                                          )
                                        }
                                      }
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
                      >
                        <Feather
                          name='trash'
                          size={24}
                          color={themeContext.colors.colorText}
                        />
                      </ArchivedHabitIcon>
                    </>
                  )}
                </ArchivedHabitItem>
              )
            }}
          />
        )}
      </SectionSpacer>
    </Container>
  )
}

const Top = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const ArchivedHabitItem = styled.TouchableOpacity<{ isSelected: boolean }>`
  background-color: ${({ theme, isSelected }) =>
    isSelected
      ? theme.colors.colorLightGreySelected
      : theme.colors.colorLightGrey};
  margin: 8px 0;
  padding: 10px 12px;
  flex-direction: row;
  align-items: center;
  border-radius: 2px;
`

const ArchivedHabitIcon = styled.TouchableOpacity`
  padding: 8px;
`

export default HabitArchive
