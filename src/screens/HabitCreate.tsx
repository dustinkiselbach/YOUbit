import { Formik } from 'formik'
import React from 'react'
import {
  Button,
  CategoryTextAndSelectField,
  CheckWeekFieldGroup,
  Container,
  DatePickerField,
  KeyboardAvoidingScrollView,
  RadioFieldGroup,
  SectionSpacer,
  Spacer,
  TextField,
  Title
} from '../components'
import { MainTabNav } from '../types'
import {
  useCreateHabitMutation,
  HabitIndexDocument,
  HabitIndexQuery,
  useCategoriesIndexQuery,
  ArchivedHabitsQuery,
  ArchivedHabitsDocument,
  CategoriesIndexDocument
} from '../generated/graphql'
import { ApolloError } from '@apollo/client'

import { daysOfWeek, getCurrentWeek, useLogout } from '../utils'

const week = getCurrentWeek()
const getIndexOfDay = (day: typeof daysOfWeek[number]): number => {
  return daysOfWeek.indexOf(day)
}

const HabitCreate: React.FC<MainTabNav<'HabitCreate'>> = ({ navigation }) => {
  const { data: categoriesData } = useCategoriesIndexQuery()
  const [createHabit] = useCreateHabitMutation()
  const [logout] = useLogout()

  return (
    <Container>
      <KeyboardAvoidingScrollView>
        <SectionSpacer>
          <Title>Add Habit</Title>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={{
              habitType: '',
              name: '',
              period: '',
              category: '',
              frequency: [],
              startDate: new Date()
            }}
            onSubmit={async (values, { setErrors, resetForm }) => {
              try {
                const res = await createHabit({
                  variables: {
                    name: values.name,
                    habitType: values.habitType,
                    frequency:
                      values.period === 'daily' ? ['daily'] : values.frequency,
                    startDate: values.startDate,
                    // @todo allow categories
                    categoryName: values.category
                  },
                  refetchQueries: [{ query: CategoriesIndexDocument }],

                  // always dependant on variables
                  // going to loop through and revalidate based on days in frequency array
                  update: (store, { data }) => {
                    if (!data) {
                      throw new Error('habit has not been created')
                    }
                    // updating for reminders
                    const habitData = store.readQuery<ArchivedHabitsQuery>({
                      query: ArchivedHabitsDocument,
                      variables: {
                        active: true,
                        dayOfWeek: (daysOfWeek as unknown) as string[]
                      }
                    })
                    if (habitData) {
                      store.writeQuery({
                        query: ArchivedHabitsDocument,
                        variables: {
                          active: true,
                          dayOfWeek: (daysOfWeek as unknown) as string[]
                        },
                        data: {
                          ...habitData,
                          habitIndex: [
                            ...habitData?.habitIndex,
                            data.createHabit
                          ]
                        }
                      })
                    }

                    for (const day of values.period === 'daily'
                      ? daysOfWeek
                      : values.frequency) {
                      const habitData = store.readQuery<HabitIndexQuery>({
                        query: HabitIndexDocument,
                        variables: {
                          dayOfWeek: [day],
                          active: true,
                          selectedDate: week[getIndexOfDay(day)]
                            .toISOString()
                            .split('T')[0]
                        }
                      })

                      // if the query hasn't been executed no need to update
                      if (!habitData) {
                        continue
                      }

                      store.writeQuery({
                        query: HabitIndexDocument,
                        variables: {
                          dayOfWeek: [day],
                          active: true,
                          selectedDate: week[getIndexOfDay(day)]
                            .toISOString()
                            .split('T')[0]
                        },
                        // see if this works lol
                        data: {
                          ...habitData,
                          habitIndex: [
                            ...habitData.habitIndex,
                            data.createHabit
                          ]
                        }
                      })
                    }
                  }
                })

                if (res.data?.createHabit?.habit.name) {
                  // @todo invalidate cache

                  resetForm()
                  navigation.navigate('Habits')
                }
              } catch (err) {
                console.log(err as ApolloError)
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
                    startDate
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
        </SectionSpacer>
      </KeyboardAvoidingScrollView>
    </Container>
  )
}

export default HabitCreate
