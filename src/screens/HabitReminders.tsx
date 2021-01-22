import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Modal } from 'react-native'
import styled, { ThemeContext } from '../../styled-components'

import {
  Button,
  Container,
  DatePickerField,
  ReminderCard,
  SectionSpacer,
  SelectField,
  Spacer,
  Title
} from '../components'
import { Feather } from '@expo/vector-icons'
import { Formik } from 'formik'
import * as Localization from 'expo-localization'
import * as Hapitcs from 'expo-haptics'
import {
  HabitIndexDocument,
  RemindersIndexDocument,
  useArchivedHabitsQuery,
  useCreateReminderMutation,
  useDestroyReminderMutation,
  useRemindersIndexQuery
} from '../generated/graphql'
import { daysOfWeek } from '../utils'
import { MainTabNav } from '../types'

const fakeData = [{ habitId: '12', time: new Date(), reminderId: '12' }]

const HabitReminders: React.FC<MainTabNav<'HabitReminders'>> = ({
  navigation,
  route: { params }
}) => {
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [itemToUpdate, setItemToUpdate] = useState<
    null | typeof fakeData[number]
  >(null)

  const [createReminder] = useCreateReminderMutation()
  // @todo get cache working with reminders
  const { data: remindersData, loading } = useRemindersIndexQuery()
  const [destroyReminder] = useDestroyReminderMutation()

  const { data } = useArchivedHabitsQuery({
    variables: {
      active: true,
      dayOfWeek: (daysOfWeek as unknown) as string[]
    },
    fetchPolicy: 'cache-and-network'
  })
  const themeContext = useContext(ThemeContext)

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setUpdating(false)
    })

    if (params?.habitParamId) {
      setShowReminderModal(true)
    }

    return unsubscribe
  }, [navigation, params])

  const onUpdate = (reminderId: string, habitId: string, time: Date): void => {
    setItemToUpdate({ reminderId, habitId, time })
    setShowReminderModal(true)
  }
  const none = !remindersData?.remindersIndex.length
  const noneHabits = !data?.habitIndex.length

  return (
    <Container>
      <SectionSpacer>
        <Top>
          <Title>Reminders</Title>
          {none && !loading ? (
            <ReminderIcon
              onPress={() => {
                if (noneHabits) {
                  Alert.alert(
                    'No Habits',
                    'You have no habits to add a reminder for'
                  )
                } else {
                  setShowReminderModal(true)
                  setUpdating(false)
                }
              }}
            >
              <Feather
                name='plus'
                size={24}
                color={themeContext.colors.colorText}
              />
            </ReminderIcon>
          ) : (
            <ReminderIcon
              onPress={async () => {
                await Hapitcs.impactAsync(Hapitcs.ImpactFeedbackStyle.Light)
                setUpdating(isUpdating => !isUpdating)
              }}
            >
              <Feather
                name='edit'
                size={24}
                color={themeContext.colors.colorText}
              />
            </ReminderIcon>
          )}
        </Top>
        {loading ? (
          <ActivityIndicator size='large' color='#00C2CB' />
        ) : (
          <FlatList
            data={remindersData?.remindersIndex}
            renderItem={({ item }) => (
              <ReminderCard
                {...{ updating, onUpdate }}
                name={item.habit.name}
                habitId={item.habit.id}
                time={item.remindAt}
                id={item.id}
              />
            )}
            keyExtractor={(_, index) => `${index}`}
            contentContainerStyle={{ paddingHorizontal: updating ? 16 : 0 }}
            ListFooterComponent={() =>
              none ? null : (
                <ReminderIcon
                  onPress={() => {
                    if (noneHabits) {
                      Alert.alert(
                        'No Habits',
                        'You have no habits to add a reminder for'
                      )
                    } else {
                      setShowReminderModal(true)
                      setUpdating(false)
                    }
                  }}
                >
                  <Feather
                    name='plus'
                    size={24}
                    color={themeContext.colors.colorText}
                  />
                </ReminderIcon>
              )
            }
          />
        )}

        <Modal
          animationType='slide'
          transparent={true}
          visible={showReminderModal}
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
                <Feather
                  name='x'
                  size={24}
                  color={themeContext.colors.colorText}
                />
              </ModalIcon>
              <Formik
                enableReinitialize
                validateOnBlur={false}
                validateOnChange={false}
                initialValues={{
                  time: itemToUpdate ? itemToUpdate.time : new Date(),
                  id: itemToUpdate
                    ? itemToUpdate.habitId
                    : params?.habitParamId || ''
                }}
                onSubmit={async values => {
                  if (itemToUpdate) {
                    try {
                      await destroyReminder({
                        variables: { reminderId: itemToUpdate.reminderId }
                      })
                      await createReminder({
                        variables: {
                          timeZone: Localization.timezone,
                          remindAt: values.time,
                          habitId: values.id
                          // @todo fix cache update
                        },
                        refetchQueries: [{ query: RemindersIndexDocument }]
                      })
                      setUpdating(false)
                    } catch (err) {
                      console.log(err)
                    }
                  } else {
                    try {
                      await createReminder({
                        variables: {
                          timeZone: Localization.timezone,
                          remindAt: values.time,
                          habitId: values.id
                        },
                        refetchQueries: [
                          ...(params
                            ? [
                                {
                                  query: RemindersIndexDocument
                                },
                                {
                                  query: HabitIndexDocument,
                                  variables: {
                                    dayOfWeek: params.dayOfWeek,
                                    active: true,
                                    selectedDate: params.dateString
                                  }
                                }
                              ]
                            : [
                                {
                                  query: RemindersIndexDocument
                                }
                              ])
                        ]
                      })
                    } catch (err) {
                      console.log(err)
                    }
                  }
                }}
              >
                {({ handleSubmit, isSubmitting }) => (
                  <>
                    {!itemToUpdate ? (
                      <Spacer>
                        <SelectField
                          name='id'
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
      </SectionSpacer>
    </Container>
  )
}

const Top = styled.View`
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
  background-color: ${({ theme }) => theme.colors.colorModalBackground};
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
