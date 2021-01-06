import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from '../../styled-components'

interface ContainerProps {
  notSafe?: boolean
}

const Container: React.FC<ContainerProps> = ({ notSafe, children }) => {
  if (notSafe) {
    return (
      <Background>
        <_Container>{children}</_Container>
      </Background>
    )
  } else {
    return (
      <Background>
        <SafeAreaView>
          <_Container>{children}</_Container>
        </SafeAreaView>
      </Background>
    )
  }
}

const Background = styled.View`
  background-color: ${props => props.theme.colors.colorBackground};
`

const _Container = styled.View`
  padding: 0 16px;
  height: 100%;
`

export default Container
