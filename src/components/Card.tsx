import React from 'react'
import Text from './Text'
import Day from './Day'
import styled from '../../styled-components'
import { FlatList } from 'react-native'

const weekDays = [1, 2, 3, 4, 5, 6, 7]

const Card: React.FC = () => {
  return (
    <_Card onPress={() => console.log('pressed parent')}>
      <Text variant='h4' style={{ color: 'black', marginBottom: 8 }}>
        Practice Bass
      </Text>
      <FlatList
        data={weekDays}
        renderItem={({ item }) => <Day weekDay={item} completed={false} />}
        keyExtractor={item => `{${item}}`}
        horizontal
        contentContainerStyle={{
          justifyContent: 'space-between',
          width: '100%'
        }}
      />
    </_Card>
  )
}

const _Card = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.colorLightGrey};
  border-radius: ${props => props.theme.borderRadius};
  padding: 8px 20px;
`

export default Card
