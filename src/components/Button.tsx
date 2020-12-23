import React from 'react'
import { TouchableOpacityProps } from 'react-native'

import styled from '../../styled-components'

interface ButtonProps extends TouchableOpacityProps {
  title: string
  variant?: 'secondary'
}

const Button: React.FC<ButtonProps> = ({ title, ...props }) => {
  return (
    <_Button {...props}>
      <ButtonText>{title}</ButtonText>
    </_Button>
  )
}

const _Button = styled.TouchableOpacity`
  height: 40px;
  background-color: ${props => props.theme.colors.colorPrimary};
  border-radius: ${props => props.theme.borderRadius};
  padding: 10px 12px;
`
// @todo text-color and elevation
const ButtonText = styled.Text`
  font-family: 'OpenSans-Bold';
  text-transform: capitalize;
  align-self: center;
  color: rgba(0, 0, 0, 0.75);
`

export default Button
