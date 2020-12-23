import React from 'react'
import { Dimensions } from 'react-native'
import Text from './Text'
import styled from '../../styled-components'
import { Feather } from '@expo/vector-icons'

const { width } = Dimensions.get('window')

interface SlideProps {
  title: string
  subtitle: string
  icon: string
  backgroundColor: string
  idx: number
}

const Slide: React.FC<SlideProps> = ({
  title,
  subtitle,
  icon,
  backgroundColor,
  idx
}) => {
  const textColor = idx > 1 ? 'rgba(0,0,0,0.75)' : 'white'
  return (
    <_Slide {...{ backgroundColor }}>
      <SlideContainer>
        <Feather
          name={icon as any}
          size={80}
          color={textColor}
          style={{ marginBottom: 32 }}
        />
        <Text variant='h2' style={{ color: textColor, marginBottom: 16 }}>
          {title}
        </Text>
        <Text variant='p' style={{ color: textColor, textAlign: 'center' }}>
          {subtitle}
        </Text>
      </SlideContainer>
    </_Slide>
  )
}

const _Slide = styled.View<{ backgroundColor: string }>`
  width: ${width}px;
  background-color: ${props => props.backgroundColor};
`

const SlideContainer = styled.View`
  padding: 0 16px;

  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`

export default Slide
