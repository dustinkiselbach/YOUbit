import React from 'react'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'

interface KeyboardAvoidingScrollViewProps {
  headerHeight?: number
}

const KeyboardAvoidingScrollView: React.FC<KeyboardAvoidingScrollViewProps> = ({
  headerHeight,
  children
}) => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
      behavior={Platform.select({ android: undefined, ios: 'padding' })}
      enabled
      keyboardVerticalOffset={headerHeight ? headerHeight : 0 + 20}
    >
      <ScrollView>{children}</ScrollView>
    </KeyboardAvoidingView>
  )
}

export default KeyboardAvoidingScrollView
