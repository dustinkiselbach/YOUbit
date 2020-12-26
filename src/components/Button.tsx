import React from 'react'
import { TouchableOpacityProps } from 'react-native'

import styled from '../../styled-components'

interface ButtonProps extends TouchableOpacityProps {
  title: string
  variant?: 'secondary'
}

const Button: React.FC<ButtonProps> = ({ title, variant, ...props }) => {
  return (
    <_Button {...props} {...{ variant }}>
      <ButtonText>{title}</ButtonText>
    </_Button>
  )
}

const _Button = styled.TouchableOpacity<{ variant?: 'secondary' }>`
  height: 40px;
  background-color: ${props =>
    props.variant === 'secondary'
      ? props.theme.colors.colorSecondary
      : props.theme.colors.colorPrimary};
  border-radius: ${props => props.theme.borderRadius};
  padding: 10px 12px;
`
// @todo text-color and elevation
const ButtonText = styled.Text`
  font-family: 'OpenSans-Bold';
  text-transform: capitalize;
  align-self: center;
  color: rgba(255, 255, 255, 0.9);
`

export default Button
