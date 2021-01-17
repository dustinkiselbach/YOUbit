import React from 'react'
import { View, FlatList } from 'react-native'
import Text from './Text'
import styled from '../../styled-components'
import { setDay } from 'date-fns'

interface DatesProps {
  dates: Date[]
  selected: Date
  changeSelected: React.Dispatch<React.SetStateAction<Date>>
}

const Dates: React.FC<DatesProps> = ({ dates, selected, changeSelected }) => {
  return (
    <View style={{ marginTop: 16 }}>
      <FlatList
        data={dates}
        renderItem={({ item, index }) => (
          <Day
            selected={selected.getDay() === item.getDay()}
            onPress={() => changeSelected(currDate => setDay(currDate, index))}
          >
            <Text variant='h3'>{item.getDate()}</Text>
            <Text variant='p'>{item.toString().split(' ')[0]}</Text>
          </Day>
        )}
        keyExtractor={item => item.toString()}
        horizontal
        contentContainerStyle={{
          width: '100%',
          justifyContent: 'space-between'
        }}
      />
    </View>
  )
}

const Day = styled.TouchableOpacity<{ selected: boolean }>`
  align-items: center;
  background-color: ${props =>
    props.selected ? props.theme.colors.contrastColorPrimary : 'transparent'};
  padding: 8px;
  border-radius: 2px;
`

export default Dates
