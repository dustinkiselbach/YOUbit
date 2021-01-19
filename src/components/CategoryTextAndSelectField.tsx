import { useField } from 'formik'
import React, { useContext } from 'react'

import styled, { ThemeContext } from '../../styled-components'
import Label from './Label'
import Error from './Error'
import { CategoriesIndexQuery } from '../generated/graphql'
import { TextInputProps, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useState } from 'react'

interface CategoryTextAndSelectFieldProps extends TextInputProps {
  name: string
  label: string
  options?: CategoriesIndexQuery
}

const CategoryTextAndSelectField: React.FC<CategoryTextAndSelectFieldProps> = ({
  name,
  label,
  options,
  ...props
}) => {
  const [field, meta, { setValue }] = useField<string>({ name })
  const [showOptions, setShowOptions] = useState(false)
  const themeContext = useContext(ThemeContext)
  const filteredCategories = options?.categoriesIndex.filter(({ name }) =>
    name.includes(field.value.toLocaleLowerCase())
  )
  const shouldShow = showOptions && filteredCategories?.length

  return (
    <>
      <Label>{label}</Label>
      <InputParent>
        <Input
          {...props}
          value={field.value}
          onChangeText={t => setValue(t)}
          placeholder={label}
          placeholderTextColor={themeContext.colors.colorPlaceholder}
          onFocus={() => setShowOptions(true)}
          onBlur={() => setShowOptions(false)}
          onChange={() => setShowOptions(true)}
        />
        {shouldShow ? (
          <SelectChevron>
            <Feather
              name='chevron-down'
              size={24}
              color={themeContext.colors.colorText}
            />
          </SelectChevron>
        ) : null}
      </InputParent>
      {shouldShow ? (
        <Options>
          {filteredCategories?.map(({ name, id }) => (
            <TouchableOpacity
              key={id}
              onPress={() => {
                setValue(name)
                setShowOptions(false)
              }}
            >
              <SelectText>{name}</SelectText>
            </TouchableOpacity>
          ))}
        </Options>
      ) : null}
      {meta.error ? <Error>{meta.error}</Error> : null}
    </>
  )
}

const InputParent = styled.View`
  position: relative;
`

const Input = styled.TextInput`
  font-family: 'OpenSans-Regular';
  height: auto;
  padding: 10px;
  background-color: ${props => props.theme.colors.colorLightGrey};
  color: ${props => props.theme.colors.colorText};
  border-radius: ${props => props.theme.borderRadius};
`

const SelectChevron = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  width: 32px;
  top: 20%;

  align-items: center;
`

const Options = styled.View`
  margin-top: 2px;
  border-radius: 2px;
  padding: 10px 12px;
  background-color: ${({ theme }) => theme.colors.colorText};
`

const SelectText = styled.Text`
  font-size: 14px;
  font-family: 'OpenSans-Regular';
  color: ${({ theme }) => theme.colors.colorBackground};
`

export default CategoryTextAndSelectField
