import React, { useRef, useState } from 'react'
import { View, Dimensions } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import styled from '../../styled-components'
import { Button, Dot, Slide } from '../components'
import { AuthStackNav } from '../types'

const { width, height } = Dimensions.get('window')
const slides = [
  {
    title: 'Welcome to YOUbit',
    subtitle:
      'Join Thousands of people who use YOUbit daily to build a better life',
    icon: 'refresh-ccw',
    backgroundColor: '#03989e'
  },
  {
    title: 'Build Habits',
    subtitle: 'Get your streak on and keep growing',
    icon: 'check-circle',
    backgroundColor: '#32ced5'
  },
  {
    title: 'Reminders',
    subtitle:
      'Set Reminders to stay on track and never again forget to mark a day',
    icon: 'bell',
    backgroundColor: '#9cecef'
  }
]
//#ddf8f9

const Onboarding: React.FC<AuthStackNav<'Onboarding'>> = ({ navigation }) => {
  const [scrollIndex, setScrollIndex] = useState(0)
  const ref = useRef<ScrollView>(null)
  console.log(scrollIndex)

  return (
    <ScrollView>
      <Slides>
        <ScrollView
          horizontal
          snapToInterval={width}
          decelerationRate='fast'
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={e =>
            setScrollIndex(
              Math.floor(
                (e.nativeEvent.contentOffset.x /
                  e.nativeEvent.contentSize.width) *
                  slides.length
              )
            )
          }
          ref={ref}
        >
          {slides.map(({ title, subtitle, icon, backgroundColor }, idx) => (
            <Slide
              key={icon}
              {...{ title, subtitle, icon, backgroundColor, idx }}
            />
          ))}
        </ScrollView>
      </Slides>
      <Dots>
        {slides.map((_, idx) => (
          <Dot key={idx} {...{ scrollIndex, idx }} />
        ))}
      </Dots>
      <View style={{ padding: 16 }}>
        <Button
          title={scrollIndex === slides.length - 1 ? 'register' : 'next'}
          onPress={
            scrollIndex === slides.length - 1
              ? () => navigation.navigate('Register')
              : () => ref.current?.scrollTo({ x: 360 * (scrollIndex + 1) })
          }
        />
      </View>
    </ScrollView>
  )
}

const Slides = styled.View`
  height: ${0.8 * height}px;
`

const Dots = styled.View`
  height: ${0.1 * height}px;
  background-color: ${props => props.theme.colors.colorPrimary};
  align-items: center;
  justify-content: center;
  flex-direction: row;
`

export default Onboarding
