import React from 'react'
import Text from './Text'

const Title: React.FC = ({ children }) => {
  return (
    <Text variant='h1' style={{ marginVertical: 16 }}>
      {children}
    </Text>
  )
}

export default Title
