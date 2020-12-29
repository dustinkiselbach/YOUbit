import { useField } from 'formik'
import React from 'react'
import styled from '../../styled-components'
import { daysOfWeek } from '../utils'

interface CheckWeekFieldGroupProps {
  name: string
}

const CheckWeekFieldGroup: React.FC<CheckWeekFieldGroupProps> = ({ name }) => {
  const [field, meta, { setValue }] = useField<string[]>({ name })

  return (
    <_CheckWeekFieldGroup>
      {daysOfWeek.map(day => {
        const selected = field.value.includes(day)
        return (
          <CheckDay
            selected={selected}
            style={{ marginRight: 1 }}
            key={day}
            onPress={() =>
              setValue(
                field.value.includes(day)
                  ? field.value.filter(val => val !== day)
                  : [...field.value, day]
              )
            }
          >
            <CheckDayLabel selected={selected}>
              {day[0].toUpperCase()}
            </CheckDayLabel>
          </CheckDay>
        )
      })}
    </_CheckWeekFieldGroup>
  )
}

const _CheckWeekFieldGroup = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
`

const CheckDay = styled.TouchableOpacity<{ selected?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.colorPrimary : theme.colors.colorLightGrey};
  align-items: center;
  justify-content: center;
`

const CheckDayLabel = styled.Text<{ selected?: boolean }>`
  font-size: 16px;
  font-family: 'OpenSans-Bold';
  color: ${({ theme, selected }) =>
    selected ? 'rgba(255,255,255,0.9)' : theme.colors.colorText};
`

export default CheckWeekFieldGroup
