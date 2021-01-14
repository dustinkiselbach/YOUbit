import React, { useEffect, useRef } from 'react'
import Text from './Text'
import styled from '../../styled-components'
import { Feather } from '@expo/vector-icons'
import { Alert, Animated } from 'react-native'
import {
  RemindersIndexDocument,
  useDestroyReminderMutation
} from '../generated/graphql'

interface ReminderCardProps {
  updating: boolean
  name: string
  time: Date
  id: string
  onUpdate: (id: string, time: Date) => void
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  name,
  time,
  id,
  updating,
  onUpdate
}) => {
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
            onPress={() => onUpdate(id, timeAsDate)}
          >
            <Feather name='edit-2' size={24} color='#535353' />
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
                          {
                            query: RemindersIndexDocument
                          }
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
            <Feather name='trash' size={24} color='#535353' />
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
