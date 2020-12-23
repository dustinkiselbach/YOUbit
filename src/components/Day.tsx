import { darken } from 'polished'
import React from 'react'

import styled from '../../styled-components'
import Text from './Text'

interface DayProps {
  weekDay: number
  completed: boolean
}

const Day: React.FC<DayProps> = ({ weekDay, completed }) => {
  return (
    <_Day>
      <Text variant='p' style={{ marginBottom: 2, color: 'black' }}>
        {weekDay}
      </Text>
      <Circle
        {...{ completed }}
        onPress={() => console.log('pressed circle')}
      />
    </_Day>
  )
}

const _Day = styled.View`
  align-items: center;
`

const Circle = styled.TouchableOpacity<{ completed: boolean }>`
  background-color: ${({ theme, completed }) =>
    completed
      ? theme.colors.colorPrimary
      : darken(0.2, theme.colors.colorLightGrey)};
  width: 25px;
  height: 25px;
  border-radius: 100px;
`

export default Day
