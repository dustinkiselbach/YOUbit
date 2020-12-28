import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import styled from '../../styled-components'
import { TouchableOpacityProps } from 'react-native'

interface RadioButtonProps extends TouchableOpacityProps {
  label: string
  selected?: boolean
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  selected,
  ...props
}) => {
  return (
    <_RadioButton {...{ selected }} {...props}>
      <Radio {...{ selected }}>
        {selected ? (
          <FontAwesome5 name='check' size={14} color='rgba(255,255,255,0.9)' />
        ) : null}
      </Radio>
      <RadioButtonLabel {...{ selected }}>{label}</RadioButtonLabel>
    </_RadioButton>
  )
}

const _RadioButton = styled.TouchableOpacity<{ selected?: boolean }>`
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.colorPrimary : theme.colors.colorLightGrey};
  height: 40px;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 2px;
  padding: 10px 12px;
`

const Radio = styled.View<{ selected?: boolean }>`
  width: 23px;
  height: 23px;
  border-radius: 15px;
  border: 2px solid
    ${({ theme, selected }) =>
      selected ? 'rgba(255,255,255,0.9)' : theme.colors.colorText};
  margin-right: 16px;
  align-items: center;
  justify-content: center;
`

const RadioButtonLabel = styled.Text<{ selected?: boolean }>`
  font-size: 16px;
  font-family: 'OpenSans-Bold';
  color: ${({ theme, selected }) =>
    selected ? 'rgba(255,255,255,0.9)' : theme.colors.colorText};
`

export default RadioButton
