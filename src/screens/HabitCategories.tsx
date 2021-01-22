import React from 'react'
import { FlatList } from 'react-native'
import styled from '../../styled-components'
import { Container } from '../components'
import { useCategoriesIndexQuery } from '../generated/graphql'
import { HabitStackNav } from '../types'
import { Text } from '../components'
import { rgba } from 'polished'

const HabitCategories: React.FC<HabitStackNav<'HabitCategories'>> = ({
  navigation
}) => {
  const { data: categoriesData } = useCategoriesIndexQuery()

  return (
    <Container notSafe>
      <FlatList
        contentContainerStyle={{ marginTop: 8 }}
        ListHeaderComponent={
          <CategoryCard
            onPress={() =>
              navigation.navigate('HabitsList', { category: undefined })
            }
          >
            <Text variant='h5'>all categories</Text>
          </CategoryCard>
        }
        data={categoriesData?.categoriesIndex}
        renderItem={({ item }) => (
          <CategoryCard
            onPress={() =>
              navigation.navigate('HabitsList', { category: item.name })
            }
          >
            <Text variant='h5'>{item.name}</Text>
          </CategoryCard>
        )}
        keyExtractor={item => item.id}
      />
    </Container>
  )
}

const CategoryCard = styled.TouchableOpacity`
  background-color: ${({ theme }) => rgba(theme.colors.colorPrimary, 0.333)};
  margin: 8px 0;
  padding: 10px 12px;
  flex-direction: row;
  align-items: center;
  border-radius: 2px;
`

export default HabitCategories
