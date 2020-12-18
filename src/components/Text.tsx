import React from 'react'
import { TextProps } from 'react-native'
import styled from '../../styled-components'

const variants = ['p', 'h1', 'h2', 'h3', 'h4', 'h5'] as const

interface ITextProps extends TextProps {
  variant: typeof variants[number]
}

const Text: React.FC<ITextProps> = ({ variant, children, ...props }) => {
  switch (variant) {
    case 'p':
      return <P {...props}>{children}</P>
    case 'h1':
      return <H1 {...props}>{children}</H1>
    case 'h2':
      return <H2 {...props}>{children}</H2>
    case 'h3':
      return <H3 {...props}>{children}</H3>
    case 'h4':
      return <H4 {...props}>{children}</H4>
    case 'h5':
      return <H5 {...props}>{children}</H5>
    default:
      return null
  }
}

const P = styled.Text`
  font-family: 'OpenSans-Regular';
  color: ${props => props.theme.colors.colorText};
`
const H1 = styled.Text`
  font-size: 40px;
  font-family: 'Glacial-Bold';
  letter-spacing: 2px;
  color: ${props => props.theme.colors.colorText};
`

const H2 = styled.Text`
  font-size: 30px;
  font-family: 'Glacial-Bold';
  letter-spacing: 1px;
  color: ${props => props.theme.colors.colorText};
`

const H3 = styled.Text`
  font-size: 25px;
  font-family: 'OpenSans-Bold';
  color: ${props => props.theme.colors.colorText};
`
const H4 = styled.Text`
  font-size: 20px;
  font-family: 'OpenSans-Bold';
  color: ${props => props.theme.colors.colorText};
`
const H5 = styled.Text`
  font-size: 16px;
  font-family: 'OpenSans-Bold';
  color: ${props => props.theme.colors.colorText};
`

export default Text
