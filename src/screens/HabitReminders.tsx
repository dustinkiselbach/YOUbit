import React, { useState } from 'react'
import { Alert, FlatList, Modal } from 'react-native'
import styled from '../../styled-components'

import {
  Button,
  Container,
  DatePickerField,
  ReminderCard,
  SelectField,
  Spacer,
  Text
} from '../components'
import { Feather } from '@expo/vector-icons'
import { Formik } from 'formik'
import * as Localization from 'expo-localization'
import { useArchivedHabitsQuery } from '../generated/graphql'
import { daysOfWeek } from '../utils'

const fakeData = [
  { name: 'fart', time: new Date() },
  { name: 'number 22', time: new Date() }
]

const HabitReminders: React.FC = () => {
  console.log(Localization.timezone)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [itemToUpdate, setItemToUpdate] = useState<
    null | typeof fakeData[number]
  >(null)

  const { data } = useArchivedHabitsQuery({
    variables: {
      active: true,
      dayOfWeek: (daysOfWeek as unknown) as string[]
    }
  })

  const onUpdate = (name: string, time: Date): void => {
    setItemToUpdate({ name, time })
    setShowReminderModal(true)
  }

  return (
    <Container>
      <Top>
        <Text variant='h1'>Reminders</Text>
        <ReminderIcon onPress={() => setUpdating(isUpdating => !isUpdating)}>
          <Feather name='edit' size={24} color='#535353' />
        </ReminderIcon>
      </Top>
      <FlatList
        data={fakeData}
        renderItem={({ item }) => (
          <ReminderCard
            {...{ updating, onUpdate }}
            name={item.name}
            time={item.time}
          />
        )}
        keyExtractor={(_, index) => `${index}`}
        contentContainerStyle={{ paddingHorizontal: updating ? 16 : 0 }}
        ListFooterComponent={() => (
          <ReminderIcon
            onPress={() => {
              setShowReminderModal(true)
              setUpdating(false)
            }}
          >
            <Feather name='plus' size={24} color='#535353' />
          </ReminderIcon>
        )}
      />

      <Modal
        animationType='slide'
        transparent={true}
        visible={showReminderModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
        }}
      >
        <CenteredView>
          <ModalContainer
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5
            }}
          >
            <ModalIcon
              onPress={() => {
                if (itemToUpdate) {
                  setItemToUpdate(null)
                }
                setShowReminderModal(false)
              }}
            >
              <Feather name='x' size={24} color='#535353' />
            </ModalIcon>
            <Formik
              enableReinitialize
              validateOnBlur={false}
              validateOnChange={false}
              initialValues={{
                habitName: itemToUpdate ? itemToUpdate.name : '',
                time: itemToUpdate ? itemToUpdate.time : new Date()
              }}
              onSubmit={values => {
                if (itemToUpdate) {
                  console.log('updating...')
                  console.log(values)
                  // update
                } else {
                  console.log('saving...')
                  console.log(values)
                }
              }}
            >
              {({ handleSubmit, isSubmitting, values }) => (
                <>
                  {!itemToUpdate ? (
                    <Spacer>
                      <SelectField
                        name='habitName'
                        label='Name'
                        defaultValue='Select Habit'
                        options={data}
                      />
                    </Spacer>
                  ) : null}

                  <Spacer>
                    <DatePickerField name='time' label='Time' mode='time' />
                  </Spacer>
                  <Spacer>
                    <Button
                      title={itemToUpdate ? 'Update' : 'Save'}
                      onPress={() => {
                        handleSubmit()
                        setShowReminderModal(false)
                        setItemToUpdate(null)
                      }}
                      disabled={isSubmitting}
                    />
                  </Spacer>
                </>
              )}
            </Formik>
          </ModalContainer>
        </CenteredView>
      </Modal>
    </Container>
  )
}

const Top = styled.View`
  margin-top: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const CenteredView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

const ModalContainer = styled.View`
  padding: 20px;
  background-color: white;
  width: 75%;
  position: relative;
`

const ReminderIcon = styled.TouchableOpacity`
  padding: 4px;
  width: 32px;
`

const ModalIcon = styled.TouchableOpacity`
  padding: 4px;
  width: 32px;
  position: absolute;
  right: 0;
`

export default HabitReminders
