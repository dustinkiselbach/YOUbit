import React from 'react'

import { Card, Container, SectionSpacer, Text } from '../components'

import { HabitStackNav } from '../types'

const Habits: React.FC<HabitStackNav<'HabitsList'>> = () => {
  return (
    <Container>
      <SectionSpacer>
        <Text variant='h1' style={{ marginBottom: 16 }}>
          All Habits
        </Text>
        <Card />
      </SectionSpacer>
    </Container>
  )
}

export default Habits
