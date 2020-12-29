import React, { useState } from 'react'
import { View, Text, TouchableOpacityProps } from 'react-native'
import styled from '../../styled-components'
import { Feather } from '@expo/vector-icons'

interface HabitCardProps extends TouchableOpacityProps {
  name: string
  id: string
}

const HabitCard: React.FC<HabitCardProps> = ({ name, id, ...props }) => {
  const [showMore, setShowMore] = useState(false)

  if (showMore) {
    return (
      <HabitMore>
        <Close onPress={() => setShowMore(false)}>
          <Feather name='x' size={24} color='#535353' />
        </Close>
        <HabitCardButton>
          <HabitCardLabel>Edit</HabitCardLabel>
        </HabitCardButton>
        <HabitCardButton>
          <HabitCardLabel>Archive</HabitCardLabel>
        </HabitCardButton>
      </HabitMore>
    )
  }

  return (
    <_HabitCard {...props}>
      <HabitCompleted></HabitCompleted>
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

const HabitCompleted = styled.TouchableOpacity`
  width: 33px;
  height: 33px;
  border-radius: 33px;
  border: 3px solid ${({ theme }) => theme.colors.colorText};
  margin-right: 16px;
  align-items: center;
  justify-content: center;
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
