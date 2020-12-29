import { useField } from 'formik'
import React from 'react'
import { View } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import styled from '../../styled-components'
import Error from './Error'
import Label from './Label'

interface DatePickerFieldProps {
  name: string
  label: string
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({ name, label }) => {
  const [open, setOpen] = React.useState(false)
  const [field, meta, { setValue }] = useField({ name })

  return (
    <>
      <Label>{label}</Label>
      <View style={{ flexDirection: 'row', width: '100%' }}>
        <DateButton onPress={() => setOpen(true)}>
          <DateButtonText>
            {field.value
              ? new Date(field.value).toLocaleDateString()
              : 'Select Date'}
          </DateButtonText>
        </DateButton>

        {meta.error ? <Error>{meta.error}</Error> : null}
      </View>
      <DateTimePickerModal
        date={field.value}
        isVisible={open}
        mode='date'
        onConfirm={dt => {
          setOpen(false)
          setValue(dt)
        }}
        onHide={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}

const DateButton = styled.TouchableOpacity`
  height: 40px;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 2px;
  padding: 10px 12px;
  background-color: ${({ theme }) => theme.colors.colorLightGrey};
`

const DateButtonText = styled.Text`
  font-size: 16px;
  font-family: 'OpenSans-Bold';
  color: ${({ theme }) => theme.colors.colorText};
`

export default DatePickerField
