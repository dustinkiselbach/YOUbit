import {
  BottomTabBarOptions,
  BottomTabBarProps
} from '@react-navigation/bottom-tabs'
import React from 'react'
import styled from '../../styled-components'
import { Feather } from '@expo/vector-icons'
import { MainTabParamList } from '../types'
import { lighten } from 'polished'

import { Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

function getIcon (
  route: keyof MainTabParamList
): 'list' | 'plus-circle' | 'settings' | 'alert-triangle' {
  switch (route) {
    case 'Habits':
      return 'list'
    case 'HabitCreate':
      return 'plus-circle'
    case 'Settings':
      return 'settings'
    default:
      return 'alert-triangle'
  }
}

const TabBar: React.FC<BottomTabBarProps<BottomTabBarOptions>> = ({
  state,
  descriptors,
  navigation
}) => {
  return (
    <SafeAreaView>
      <_TabBar>
        {state.routes.map((route, index) => {
          // if you need title use options
          const { options } = descriptors[route.key]
          const label = route.name
          const focused = state.index === index
          const icon = getIcon(route.name as keyof MainTabParamList)

          const onPress = (): void => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            })

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          const onLongPress = (): void => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key
            })
          }

          return (
            <Pressable
              key={label}
              {...{ onPress, onLongPress }}
              style={{ flex: 1 }}
            >
              {({ pressed }) => (
                <TabBarItem {...{ focused, pressed }}>
                  <Feather
                    name={icon}
                    size={40}
                    color={focused || pressed ? 'black' : '#535353'}
                  />
                </TabBarItem>
              )}
            </Pressable>
          )
        })}
      </_TabBar>
    </SafeAreaView>
  )
}

const _TabBar = styled.View`
  height: 50px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => lighten(0.4, props.theme.colors.colorPrimary)};
  padding: 0 16px;
`

const TabBarItem = styled.View<{ focused: boolean; pressed: boolean }>`
  flex: 1;
  background-color: ${props =>
    props.focused
      ? 'rgba(255,255,255,0.4)'
      : props.pressed
      ? 'rgba(255,255,255,0.2)'
      : 'transparent'};
  align-items: center;
  border-radius: ${props => props.theme.borderRadius};
  padding: 4px 0;
`

export default TabBar
