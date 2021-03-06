import React, { useContext, useEffect, useRef } from 'react'
import Text from './Text'
import styled, { ThemeContext } from '../../styled-components'
import { Feather } from '@expo/vector-icons'
import { Alert, Animated } from 'react-native'
import {
  HabitIndexDocument,
  RemindersIndexDocument,
  useDestroyReminderMutation
} from '../generated/graphql'
import { useRoute } from '@react-navigation/native'
import { MainTabNav } from '../types'

interface ReminderCardProps {
  updating: boolean
  name: string
  time: Date
  id: string
  habitId: string
  onUpdate: (reminderId: string, habitId: string, time: Date) => void
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  name,
  time,
  id,
  habitId,
  updating,
  onUpdate
}) => {
  const { params } = useRoute<MainTabNav<'HabitReminders'>['route']>()
  const themeContext = useContext(ThemeContext)

  const [destroyReminder] = useDestroyReminderMutation()
  // Wiggle Animation
  const timeAsDate = new Date(time)
  const wiggleAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const wiggle = (): void => {
      Animated.sequence([
        Animated.timing(wiggleAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true
        }),
        Animated.timing(wiggleAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true
        }),
        Animated.timing(wiggleAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true
        }),
        Animated.timing(wiggleAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true
        })
      ]).start()
    }
    if (updating) {
      wiggle()
    }
  }, [updating, wiggleAnim])

  return (
    <_ReminderCard style={{ transform: [{ translateX: wiggleAnim }] }}>
      <Text variant='p'>
        <Text variant='h5'>{name}</Text> at {timeAsDate.toLocaleTimeString()}
      </Text>
      {updating ? (
        <Icons>
          <ReminderCardIcon
            style={{ marginRight: 8 }}
            onPress={() => onUpdate(id, habitId, timeAsDate)}
          >
            <Feather
              name='edit-2'
              size={24}
              color={themeContext.colors.colorText}
            />
          </ReminderCardIcon>
          <ReminderCardIcon
            onPress={() => {
              Alert.alert('Delete Reminder', `Delete Reminder for ${name}?`, [
                {
                  text: 'Cancel',
                  style: 'cancel'
                },
                {
                  text: 'OK',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await destroyReminder({
                        variables: { reminderId: id },
                        refetchQueries: [
                          ...(params
                            ? [
                                {
                                  query: RemindersIndexDocument
                                },
                                {
                                  query: HabitIndexDocument,
                                  variables: {
                                    dayOfWeek: params.dayOfWeek,
                                    active: true,
                                    selectedDate: params.dateString
                                  }
                                }
                              ]
                            : [
                                {
                                  query: RemindersIndexDocument
                                }
                              ])
                        ]
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
              name='trash'
              size={24}
              color={themeContext.colors.colorText}
            />
          </ReminderCardIcon>
        </Icons>
      ) : null}
    </_ReminderCard>
  )
}

const _ReminderCard = styled(Animated.View)`
  background-color: ${({ theme }) => theme.colors.colorLightGrey};
  margin: 8px 0;
  padding: 10px 12px;
  flex-direction: row;
  align-items: center;
  border-radius: 2px;
`

const Icons = styled.View`
  margin-left: auto;
  flex-direction: row;
`

const ReminderCardIcon = styled.TouchableOpacity`
  padding: 4px;
  width: 32px;
`

export default ReminderCard
