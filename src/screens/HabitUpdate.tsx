import { ApolloError } from '@apollo/client'
import { Formik } from 'formik'
import React from 'react'

import {
  Container,
  SectionSpacer,
  Spacer,
  RadioFieldGroup,
  TextField,
  CheckWeekFieldGroup,
  DatePickerField,
  Text,
  Button
} from '../components'
import { useUpdateHabitMutation } from '../generated/graphql'
import { HabitStackNav } from '../types'
import { useLogout } from '../utils'

const HabitUpdate: React.FC<HabitStackNav<'HabitUpdate'>> = ({
  route,
  navigation
}) => {
  const [updateHabit] = useUpdateHabitMutation()
  const [logout] = useLogout()
  return (
    <Container>
      <SectionSpacer>
        <Text variant='h1' style={{ marginBottom: 16 }}>
          Update Habit
        </Text>
        <Formik
          enableReinitialize
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            habitType: route.params.habitType,
            name: route.params.name,
            period:
              route.params.frequency[0] === 'daily' ? 'daily' : 'select days',
            frequency:
              route.params.frequency[0] !== 'daily'
                ? route.params.frequency
                : [],
            startDate: new Date(route.params.startDate)
          }}
          onSubmit={async (values, { setErrors }) => {
            try {
              const res = await updateHabit({
                variables: {
                  habitId: route.params.id,
                  name: values.name,
                  habitType: values.habitType,
                  frequency:
                    values.period === 'daily' ? ['daily'] : values.frequency,
                  startDate: values.startDate,
                  categoryName: 'fart'
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

export default HabitUpdate
