import React from 'react'
import { Pressable, PressableProps } from 'react-native'
import styled from '../../styled-components'
import { lighten } from 'polished'

interface LinkProps extends PressableProps {
  navigationCallBack: () => void
}

const Link: React.FC<LinkProps> = ({
  navigationCallBack,
  children,
  ...props
}) => {
  return (
    <Pressable onPress={navigationCallBack} {...props}>
      {({ pressed }) => <_Link {...{ pressed }}>{children}</_Link>}
    </Pressable>
  )
}

const _Link = styled.Text<{ pressed: boolean }>`
  color: ${({ theme, pressed }) =>
    pressed
      ? lighten(0.2, theme.colors.colorPrimary)
      : theme.colors.colorPrimary};
  font-family: 'OpenSans-Bold';
`

export default Link
