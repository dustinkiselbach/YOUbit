import React from 'react'
import { useField } from 'formik'
import styled from '../../styled-components'
import { TextInputProps } from 'react-native'
import Error from './Error'
import Label from './Label'

interface TextFieldProps extends TextInputProps {
  name: string
  label: string
}

const TextField: React.FC<TextFieldProps> = ({ name, label, ...props }) => {
  const [field, meta, { setValue }] = useField({ name })
  // console.log(meta)

  return (
    <>
      <Label>{label}</Label>
      <Input
        {...props}
        value={field.value}
        onChangeText={t => setValue(t)}
        placeholder={label}
      />
      {meta.error ? <Error>{meta.error}</Error> : null}
    </>
  )
}

const Input = styled.TextInput`
  font-family: 'OpenSans-Regular';
  height: auto;
  padding: 10px;
  background-color: ${props => props.theme.colors.colorLightGrey};
  color: ${props => props.theme.colors.colorText};
  border-radius: ${props => props.theme.borderRadius};
`

export default TextField
