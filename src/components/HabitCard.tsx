import React, { useState } from 'react'
import { TouchableOpacityProps } from 'react-native'
import styled from '../../styled-components'
import { Feather, FontAwesome5 } from '@expo/vector-icons'
import {
  HabitIndexDocument,
  HabitIndexQuery,
  useArchiveOrActivateHabitMutation,
  useCreateHabitLogMutation,
  useDestroyHabitLogMutation
} from '../generated/graphql'
import { daysOfWeek } from '../utils'
import {
  CompositeNavigationProp,
  useNavigation
} from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { HabitStackParamList, MainTabParamList } from '../types'
import { StackNavigationProp } from '@react-navigation/stack'

type HabitCardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Habits'>,
  StackNavigationProp<HabitStackParamList>
>

interface HabitCardAdditionalProps {
  frequency: string[]
  isLogged: {
    logged: boolean
    habitLog?: { id: string } | null
  }
  startDate: any
}

interface HabitCardProps extends TouchableOpacityProps {
  name: string
  id: string
  habitType: string
  day: Date
  isLogged?: boolean
  rest: HabitCardAdditionalProps
}

const HabitCard: React.FC<HabitCardProps> = ({
  name,
  habitType,
  id,
  day,
  rest: { isLogged, frequency, startDate },
  ...props
}) => {
  const [showMore, setShowMore] = useState(false)
  const navigation = useNavigation<HabitCardNavigationProp>()
  const [createHabitLog] = useCreateHabitLogMutation()
  const [archiveOrActivateHabit] = useArchiveOrActivateHabitMutation()
  const [destroyHabitLog] = useDestroyHabitLogMutation()

  if (showMore) {
    return (
      <HabitMore>
        <Close onPress={() => setShowMore(false)}>
          <Feather name='x' size={24} color='#535353' />
        </Close>
        <HabitCardButton
          onPress={() => {
            navigation.navigate('HabitUpdate', {
              name,
              habitType,
              frequency,
              startDate,
              id
            })
            setShowMore(false)
          }}
        >
          <HabitCardLabel>Edit</HabitCardLabel>
        </HabitCardButton>
        <HabitCardButton>
          <HabitCardLabel
            onPress={async () => {
              try {
                await archiveOrActivateHabit({
                  variables: {
                    habitId: id,
                    active: false
                  },
                  update: (store, { data }) => {
                    const habitData = store.readQuery<HabitIndexQuery>({
                      query: HabitIndexDocument,
                      variables: {
                        dayOfWeek: [daysOfWeek[day.getDay()]],
                        active: true,
                        selectedDate: day.toISOString().split('T')[0]
                      }
                    })

                    store.evict({
                      fieldName: 'habitIndex',
                      broadcast: false
                    })
                    store.writeQuery<HabitIndexQuery>({
                      query: HabitIndexDocument,
                      variables: {
                        dayOfWeek: [daysOfWeek[day.getDay()]],
                        active: true
                      },
                      data: {
                        habitIndex: habitData!.habitIndex.filter(
                          habit => habit.id !== data?.updateHabit?.habit.id
                        )
                      }
                    })
                  }
                })
              } catch (err) {
                console.log((err as Error).message)
              }
            }}
          >
            Archive
          </HabitCardLabel>
        </HabitCardButton>
      </HabitMore>
    )
  }

  return (
    <_HabitCard {...props}>
      <HabitCompleted
        isLogged={isLogged.logged}
        onPress={async () => {
          if (isLogged.logged) {
            try {
              await destroyHabitLog({
                variables: { habitLogId: isLogged.habitLog?.id || '' },
                refetchQueries: [
                  {
                    query: HabitIndexDocument,
                    variables: {
                      dayOfWeek: [daysOfWeek[day.getDay()]],
                      active: true,
                      selectedDate: day.toISOString().split('T')[0]
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
                  loggedDate: day.toISOString()
                },
                refetchQueries: [
                  {
                    query: HabitIndexDocument,
                    variables: {
                      dayOfWeek: [daysOfWeek[day.getDay()]],
                      active: true,
                      selectedDate: day.toISOString().split('T')[0]
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
          <FontAwesome5 name='check' size={14} color='rgba(255,255,255,0.9)' />
        ) : null}
      </HabitCompleted>
      <HabitCardLabel>{name}</HabitCardLabel>
      <More onPress={() => setShowMore(true)}>
        <Feather name='more-vertical' size={24} color='#535353' />
      </More>
    </_HabitCard>
  )
}

const _HabitCard = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.colorLightGrey};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 10px 12px;
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
`

const HabitMore = styled.View`
  background-color: ${({ theme }) => theme.colors.colorLightGrey};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 10px 12px;
  margin-bottom: 8px;
  align-items: center;
  position: relative;
`

const HabitCardLabel = styled.Text`
  font-size: 16px;
  font-family: 'OpenSans-Bold';
  color: ${({ theme }) => theme.colors.colorText};
`

const HabitCardButton = styled.TouchableOpacity`
  padding: 8px;
`

const HabitCompleted = styled.TouchableOpacity<{ isLogged?: boolean }>`
  width: 33px;
  height: 33px;
  border-radius: 33px;
  border: 3px solid ${({ theme }) => theme.colors.colorText};
  margin-right: 16px;
  align-items: center;
  justify-content: center;
  background-color: ${({ isLogged, theme }) =>
    isLogged ? theme.colors.colorPrimary : 'transparent'};
`
const More = styled.TouchableOpacity`
  margin-left: auto;

  padding: 4px;
`
const Close = styled.TouchableOpacity`
  position: absolute;
  right: 12px;
  top: 12px;
  padding: 4px;
`

export default HabitCard

// const [destroyHabit, { loading }] = useDestroyHabitMutation()

// try {
//     await destroyHabit({
//       variables: { habitId: id },
//       update: (store, { data }) => {
//         const habitData = store.readQuery<HabitIndexQuery>({
//           query: HabitIndexDocument,
//           variables: { dayOfWeek: ['monday'], active: true }
//         })

//         store.evict({
//           fieldName: 'habitIndex',
//           broadcast: false
//         })

//         store.writeQuery<HabitIndexQuery>({
//           query: HabitIndexDocument,
//           variables: { dayOfWeek: ['monday'], active: true },
//           data: {
//             habitIndex: habitData!.habitIndex.filter(
//               habit => habit.id !== data?.destroyHabit?.habit.id
//             )
//           }
//         })
//       }
//     })
//   } catch (err) {
//     console.log((err as ApolloError).message)
//   }
