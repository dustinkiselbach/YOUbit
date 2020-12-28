import React from 'react'
import { View } from 'react-native'
import { useField } from 'formik'
import RadioButton from './RadioButton'
import Error from './Error'

import Label from './Label'

interface RadioFieldGroupProps {
  name: string
  label: string
  options: { value: string; label: string }[]
}

const RadioFieldGroup: React.FC<RadioFieldGroupProps> = ({
  name,
  label,
  options
}) => {
  const [field, meta, { setValue }] = useField({ name })
  return (
    <>
      <Label>{label}</Label>
      <View
        style={{
          flexDirection: 'row',
          width: '100%'
        }}
      >
        {options.map(({ value, label }, idx) => (
          <RadioButton
            key={label}
            {...{ label }}
            onPress={() => setValue(value)}
            selected={field.value === value}
            style={{ marginRight: idx % 2 === 1 ? 0 : 8 }}
          />
        ))}
        {meta.error ? <Error>{meta.error}</Error> : null}
      </View>
    </>
  )
}

export default RadioFieldGroup
