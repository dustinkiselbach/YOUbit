import { ApolloError } from '@apollo/client'
import { useHeaderHeight } from '@react-navigation/stack'
import { Formik } from 'formik'
import React from 'react'

import {
  Container,
  Spacer,
  RadioFieldGroup,
  TextField,
  CheckWeekFieldGroup,
  DatePickerField,
  Text,
  Button,
  Title,
  KeyboardAvoidingScrollView,
  CategoryTextAndSelectField
} from '../components'
import {
  useCategoriesIndexQuery,
  useHabitIndexQuery,
  useUpdateHabitMutation
} from '../generated/graphql'
import { HabitStackNav } from '../types'
import { useLogout } from '../utils'

const HabitUpdate: React.FC<HabitStackNav<'HabitUpdate'>> = ({
  route: {
    params: { id, dateString, dayOfWeek }
  },
  navigation
}) => {
  const { data: categoriesData } = useCategoriesIndexQuery()
  const { data, error } = useHabitIndexQuery({
    variables: {
      dayOfWeek: dayOfWeek,
      active: true,
      selectedDate: dateString
    }
    // @todo seems to break sometimes needs more testing
  })
  const [updateHabit] = useUpdateHabitMutation()
  const [logout] = useLogout()
  const headerHeight = useHeaderHeight()

  const habit = data?.habitIndex.filter(habit => habit.id === id)

  if (!habit || error) {
    return <Text variant='h3'>The Specified habit was not found</Text>
  }

  const { name, frequency, habitType, startDate, category } = habit[0] ?? {
    name: null,
    frequency: null,
    habitType: null,
    startDate: null
  }

  return (
    <Container notSafe>
      <KeyboardAvoidingScrollView {...{ headerHeight }}>
        <Title>Update Habit</Title>
        <Formik
          enableReinitialize
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            habitType,
            name,
            period: frequency[0] === 'daily' ? 'daily' : 'select days',
            category: category.name,
            frequency: frequency[0] !== 'daily' ? frequency : [],
            startDate: new Date(startDate)
          }}
          onSubmit={async (values, { setErrors }) => {
            try {
              const res = await updateHabit({
                variables: {
                  habitId: id,
                  name: values.name,
                  habitType: values.habitType,
                  frequency:
                    values.period === 'daily' ? ['daily'] : values.frequency,
                  startDate: values.startDate,
                  categoryName: values.category
                },
                // @todo fix cache when changing days
                update: async store => {
                  await store.reset()
                }
              })

              if (res.data?.updateHabit?.habit.name) {
                navigation.navigate('HabitsList')
              }
            } catch (err) {
              console.log((err as Error).message)
              if (
                (err as ApolloError).graphQLErrors[0].extensions?.code ===
                'AUTHENTICATION ERROR'
              ) {
                logout()
              }
              const {
                detailed_errors: {
                  name,
                  habit_type: habitType,
                  frequency,
                  start_date: startDate
                }
              } = (err as ApolloError).graphQLErrors[0].extensions ?? {
                detailed_errors: null
              }

              setErrors({ name, habitType, frequency, startDate })
            }
          }}
        >
          {({ handleSubmit, isSubmitting, values }) => (
            <>
              <Spacer>
                <RadioFieldGroup
                  name='habitType'
                  label='Type'
                  options={[
                    { value: 'goal', label: 'Goal' },
                    { value: 'limit', label: 'Limit' }
                  ]}
                />
              </Spacer>
              <Spacer>
                <TextField
                  name='name'
                  label='Name'
                  autoCapitalize='words'
                  textContentType='name'
                />
              </Spacer>
              <Spacer>
                <CategoryTextAndSelectField
                  name='category'
                  label='Category'
                  autoCapitalize='words'
                  textContentType='nickname'
                  options={categoriesData}
                />
              </Spacer>
              <Spacer>
                <RadioFieldGroup
                  name='period'
                  label='Period'
                  options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'select days', label: 'Select Days' }
                  ]}
                />
              </Spacer>
              {values.period === 'select days' ? (
                <Spacer>
                  <CheckWeekFieldGroup name='frequency' />
                </Spacer>
              ) : null}
              <Spacer>
                <DatePickerField
                  name='startDate'
                  label='Start Date'
                  mode='date'
                />
              </Spacer>
              <Spacer>
                <Button
                  title='Save'
                  disabled={isSubmitting}
                  onPress={() => handleSubmit()}
                />
              </Spacer>
            </>
          )}
        </Formik>
      </KeyboardAvoidingScrollView>
    </Container>
  )
}

export default HabitUpdate
