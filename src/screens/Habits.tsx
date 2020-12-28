import React, { useState } from 'react'

import { Container, Dates, SectionSpacer } from '../components'

import { HabitStackNav } from '../types'
import { getCurrentWeek } from '../utils'

const currentWeek = getCurrentWeek()

const Habits: React.FC<HabitStackNav<'HabitsList'>> = () => {
  const [day, setDay] = useState(new Date())

  return (
    <Container>
      <Dates dates={currentWeek} selected={day} changeSelected={setDay} />
      <SectionSpacer></SectionSpacer>
    </Container>
  )
}

export default Habits
