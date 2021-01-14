import { useField } from 'formik'
import React, { useState } from 'react'
import { FlatList, Modal, TouchableOpacity } from 'react-native'
import styled from '../../styled-components'
import Label from './Label'
import { Feather } from '@expo/vector-icons'
import { ArchivedHabitsQuery } from '../generated/graphql'

interface SelectFieldProps {
  name: string
  label: string
  defaultValue: string
  options?: ArchivedHabitsQuery
}

const SelectField: React.FC<SelectFieldProps> = ({
  defaultValue,
  name,
  label,
  options
}) => {
  const [showOptions, setShowOptions] = useState(false)
  const [field, meta, { setValue }] = useField({ name })
  const selected = options?.habitIndex.filter(
    habit => habit.id == field.value
  )[0]

  return (
    <>
      <Label>{label}</Label>
      <SelectButton>
        <SelectButtonText>
          {field.value ? selected?.name : defaultValue}
        </SelectButtonText>
        <SelectChevron onPress={() => setShowOptions(true)}>
          <Feather name='chevron-down' size={24} color='#535353' />
        </SelectChevron>
      </SelectButton>
      <Modal animationType='fade' transparent={true} visible={showOptions}>
        <CenteredView>
          <ModalContainer>
            <SelectListOptions>
              <FlatList
                data={options?.habitIndex}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setValue(item.id)
                      setShowOptions(false)
                    }}
                  >
                    <SelectButtonText
                      style={{ fontFamily: 'OpenSans-Regular', color: 'white' }}
                    >
                      {selected?.name === item.name ? (
                        <Feather name='check' size={18} color='white' />
                      ) : null}
                      {item.name}
                    </SelectButtonText>
                  </TouchableOpacity>
                )}
              />
            </SelectListOptions>
          </ModalContainer>
        </CenteredView>
      </Modal>
    </>
  )
}

const SelectButton = styled.View`
  height: 40px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 2px;
  padding: 10px 12px;
  background-color: ${({ theme }) => theme.colors.colorLightGrey};
`

const SelectButtonText = styled.Text`
  font-size: 16px;
  font-family: 'OpenSans-Bold';
  color: ${({ theme }) => theme.colors.colorText};
`

const SelectChevron = styled.TouchableOpacity`
  width: 32px;
  margin-left: auto;
`

const SelectListOptions = styled.View`
  margin-top: 2px;
  max-height: 200px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 10px;
  padding: 10px 12px;
  background-color: rgba(0, 0, 0, 0.8);
  margin-bottom: 120px;
`

const CenteredView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

const ModalContainer = styled.View`
  padding: 20px;
  width: 75%;
`

export default SelectField
