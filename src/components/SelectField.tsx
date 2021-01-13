import { useField } from 'formik'
import React, { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
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

  return (
    <>
      <Label>{label}</Label>
      <SelectButton>
        <SelectButtonText>
          {field.value ? field.value : defaultValue}
        </SelectButtonText>
        <SelectChevron onPress={() => setShowOptions(true)}>
          <Feather name='chevron-down' size={24} color='#535353' />
        </SelectChevron>
      </SelectButton>
      {showOptions ? (
        <SelectListOptions>
          <FlatList
            data={options?.habitIndex}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setValue(item.name)
                  setShowOptions(false)
                }}
              >
                <SelectButtonText
                  style={{ fontFamily: 'OpenSans-Regular', color: 'white' }}
                >
                  {item.name}
                </SelectButtonText>
              </TouchableOpacity>
            )}
          />
        </SelectListOptions>
      ) : null}
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
  max-height: 80px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 2px;
  padding: 10px 12px;
  background-color: rgba(0, 0, 0, 0.566);
`

export default SelectField
