import { Formik } from 'formik'
import React from 'react'
import {
  Button,
  CheckWeekFieldGroup,
  Container,
  RadioFieldGroup,
  SectionSpacer,
  Spacer,
  Text,
  TextField
} from '../components'
import { MainTabNav } from '../types'

// type checkbox goal limit
// name form field
// default every day or select which days you want to do

const HabitCreate: React.FC<MainTabNav<'HabitCreate'>> = () => {
  return (
    <Container>
      <SectionSpacer>
        <Text variant='h1' style={{ marginBottom: 16 }}>
          Add Habit
        </Text>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{ type: '', name: '', period: '', days: [] }}
          onSubmit={async (values, { setErrors }) => {
            console.log(values)
          }}
        >
          {({ handleSubmit, isSubmitting, values }) => (
            <>
              <Spacer>
                <RadioFieldGroup
                  name='type'
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
                  <CheckWeekFieldGroup name='days' />
                </Spacer>
              ) : null}
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
