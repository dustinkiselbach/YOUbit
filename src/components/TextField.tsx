import React from 'react'
import { useField } from 'formik'
import styled from '../../styled-components'
import { TextInputProps } from 'react-native'

interface TextFieldProps extends TextInputProps {
  name: string
  label: string
}

const TextField: React.FC<TextFieldProps> = ({ name, label, ...props }) => {
  const [field, meta, { setValue }] = useField({ name })
  console.log(meta)
  return (
    <>
      <Label>{label}</Label>
      <Input
        {...props}
        value={field.value}
        onChangeText={t => setValue(t)}
        placeholder={label}
      />
    </>
  )
}

const Label = styled.Text`
  font-family: 'OpenSans-Bold';
  margin-bottom: 6px;
  color: ${props => props.theme.colors.colorText};
`

const Input = styled.TextInput`
  font-family: 'OpenSans-Regular';
  height: auto;
  padding: 10px;
  background-color: ${props => props.theme.colors.colorLightGrey};
  color: ${props => props.theme.colors.colorText};
  border-radius: ${props => props.theme.borderRadius};
`

export default TextField
