import React, { useContext, useState } from 'react'
import { TouchableOpacityProps } from 'react-native'
import styled, { ThemeContext } from '../../styled-components'
import { Feather, FontAwesome5 } from '@expo/vector-icons'
import { isFuture } from 'date-fns'
import {
  HabitIndexDocument,
  HabitIndexQuery,
  useArchiveOrActivateHabitMutation,
  useCreateHabitLogMutation,
  useDestroyHabitLogMutation
} from '../generated/graphql'
import { daysOfWeek, getCurrentWeek } from '../utils'
import {
  CompositeNavigationProp,
  useNavigation
} from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { HabitStackParamList, MainTabParamList } from '../types'
import { StackNavigationProp } from '@react-navigation/stack'
import HabitCompleted from './HabitCompleted'

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

const currentWeek = getCurrentWeek()

const HabitCard: React.FC<HabitCardProps> = ({
  name,
  habitType,
  id,
  day,
  rest: { isLogged, frequency },
  ...props
}) => {
  const future = isFuture(day)
  const dateString = currentWeek[day.getDay()].toISOString().split('T')[0]
  const dayOfWeek = [daysOfWeek[day.getDay()]]

  const [showMore, setShowMore] = useState(false)
  const navigation = useNavigation<HabitCardNavigationProp>()
  const [archiveOrActivateHabit] = useArchiveOrActivateHabitMutation()
  const [createHabitLog] = useCreateHabitLogMutation()
  const [destroyHabitLog] = useDestroyHabitLogMutation()
  const themeContext = useContext(ThemeContext)

  if (showMore) {
    return (
      <HabitMore>
        <Close onPress={() => setShowMore(false)}>
          <Feather name='x' size={24} color={themeContext.colors.colorText} />
        </Close>
        <HabitCardButton
          onPress={() => {
            navigation.navigate('HabitUpdate', {
              id,
              dateString,
              dayOfWeek
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

                    if (!habitData) {
                      // habitData is not cached for some reason
                      return
                    }

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
                        habitIndex: habitData.habitIndex.filter(
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
    <_HabitCard
      {...props}
      onPress={() =>
        navigation.navigate('HabitDetail', {
          id,
          dateString,
          dayOfWeek
        })
      }
    >
      <HabitCompleted
        isLogged={isLogged.logged}
        future={future}
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
          <FontAwesome5 name='check' size={14} color='rgba(255,255,255,0.9)' />
        ) : null}
      </HabitCompleted>
      <HabitCardText>
        <HabitCardLabel>{name}</HabitCardLabel>
        <HabitCardInfo>
          {habitType} - {frequency.length > 1 ? 'selected days' : frequency[0]}
        </HabitCardInfo>
      </HabitCardText>

      <More onPress={() => setShowMore(true)}>
        <Feather
          name='more-vertical'
          size={24}
          color={themeContext.colors.colorText}
        />
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

const HabitCardText = styled.View``

const HabitCardLabel = styled.Text`
  font-size: 16px;
  font-family: 'OpenSans-Bold';
  color: ${({ theme }) => theme.colors.colorText};
`

const HabitCardInfo = styled.Text`
  font-size: 16px;
  font-family: 'OpenSans-Regular';
  color: ${({ theme }) => theme.colors.colorText};
`

const HabitCardButton = styled.TouchableOpacity`
  padding: 8px;
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
