import React from 'react'
import { View, Dimensions, Text } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import styled from '../../styled-components'
import { Container, Slide } from '../components'
import { AuthStackNav } from '../types'

const { width, height } = Dimensions.get('window')

const Onboarding: React.FC<AuthStackNav<'Onboarding'>> = () => {
  return (
    <View>
      <Slides>
        <ScrollView
          horizontal
          snapToInterval={width}
          decelerationRate='fast'
          showsHorizontalScrollIndicator={false}
          bounces={false}
        >
          <Slide
            title='Welcome to YOUbit'
            subTitle='hello my name is dustin i have a cat named myko and another named fart'
          />
          <Slide
            title='Lorem Ipsum'
            subTitle='hello my name is dustin i have a cat named myko and another named fart'
          />
        </ScrollView>
      </Slides>
      <Container>
        <Text>hello</Text>
      </Container>
    </View>
  )
}

const Slides = styled.View`
  height: ${0.61 * height}px;
`

export default Onboarding
