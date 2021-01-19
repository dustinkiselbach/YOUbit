import React from 'react'
import { View, Text } from 'react-native'
import { Container } from '../components'
import { useCategoriesIndexQuery } from '../generated/graphql'
import { HabitStackNav } from '../types'

const HabitCategories: React.FC<HabitStackNav<'HabitCategories'>> = ({
  navigation
}) => {
  const { data: categoriesData } = useCategoriesIndexQuery()

  return (
    <Container notSafe>
      <Text
        onPress={() =>
          navigation.navigate('HabitsList', { category: undefined })
        }
      >
        all categories
      </Text>
      {categoriesData?.categoriesIndex.map(({ name, id }) => (
        <Text
          onPress={() => navigation.navigate('HabitsList', { category: name })}
          key={id}
        >
          {name}
        </Text>
      ))}
    </Container>
  )
}

export default HabitCategories
