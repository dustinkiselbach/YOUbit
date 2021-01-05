import { Formik } from 'formik'
import React from 'react'
import {
  Button,
  CheckWeekFieldGroup,
  Container,
  DatePickerField,
  RadioFieldGroup,
  SectionSpacer,
  Spacer,
  Text,
  TextField
} from '../components'
import { MainTabNav } from '../types'
import {
  useCreateHabitMutation,
  HabitIndexDocument,
  HabitIndexQuery
} from '../generated/graphql'
import { ApolloError } from '@apollo/client'
import { daysOfWeek, getCurrentWeek, useLogout } from '../utils'

const week = getCurrentWeek()
const getIndexOfDay = (day: typeof daysOfWeek[number]): number => {
  return daysOfWeek.indexOf(day)
}

const HabitCreate: React.FC<MainTabNav<'HabitCreate'>> = ({ navigation }) => {
  const [createHabit] = useCreateHabitMutation()
  const [logout] = useLogout()

  return (
    <Container>
      <SectionSpacer>
        <Text variant='h1' style={{ marginBottom: 16 }}>
          Add Habit
        </Text>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            habitType: '',
            name: '',
            period: '',
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
                  categoryName: 'fart'
                },
                // always dependant on variables
                // going to loop through and revalidate based on days in frequency array
                update: (store, { data }) => {
                  if (!data) {
                    throw new Error('habit has not been created')
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
                      data: {
                        habitIndex: [...habitData.habitIndex, data.createHabit]
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
              console.log((err as Error).message)
              if (
                (err as ApolloError).graphQLErrors[0].extensions?.code ===
                'AUTHENTICATION ERROR'
              ) {
                logout()
              }
              const {
                detailed_errors: { name, habitType, frequency, startDate }
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
                <DatePickerField name='startDate' label='Start Date' />
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
    </Container>
  )
}

export default HabitCreate
