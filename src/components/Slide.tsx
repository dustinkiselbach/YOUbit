import React from 'react'
import { Dimensions } from 'react-native'
import Text from './Text'
import styled from '../../styled-components'

const { width } = Dimensions.get('window')

interface SlideProps {
  title: string
  subTitle: string
}

const Slide: React.FC<SlideProps> = ({ title, subTitle }) => {
  return (
    <_Slide>
      <SlideContainer>
        <Text variant='h2' style={{ color: 'white', marginBottom: 16 }}>
          {title}
        </Text>
        <Text variant='p' style={{ color: 'white', textAlign: 'center' }}>
          {subTitle}
        </Text>
      </SlideContainer>
    </_Slide>
  )
}

const _Slide = styled.View`
  width: ${width}px;
  background-color: ${props => props.theme.colors.colorPrimary};
`

const SlideContainer = styled.View`
  padding: 0 16px;

  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`

export default Slide
