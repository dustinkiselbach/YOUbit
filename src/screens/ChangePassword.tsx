import AsyncStorage from '@react-native-async-storage/async-storage'
import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import {
  Container,
  SectionSpacer,
  Spacer,
  TextField,
  Text,
  Button
} from '../components'
import { useAuthDispatchContext } from '../context'
import {
  useUserCheckPasswordTokenLazyQuery,
  useUserUpdatePasswordMutation
} from '../generated/graphql'
import { AuthStackNav } from '../types'

const ChangePassword: React.FC<AuthStackNav<'ChangePassword'>> = () => {
  const [checkPasswordToken, { data }] = useUserCheckPasswordTokenLazyQuery()
  const [updatePassword] = useUserUpdatePasswordMutation()
  const [fields, setFields] = useState({
    password: '',
    passwordConfirmation: ''
  })
  const dispatch = useAuthDispatchContext()!

  useEffect(() => {
    if (data) {
      const { userCheckPasswordToken } = data
      ;(async () => {
        try {
          await AsyncStorage.setItem(
            'ACCESS_TOKEN',
            userCheckPasswordToken.accessToken
          )
          await AsyncStorage.setItem('CLIENT', userCheckPasswordToken.client)
          await AsyncStorage.setItem('UID', userCheckPasswordToken.uid)
          await AsyncStorage.setItem(
            'EXPIRY',
            `${userCheckPasswordToken.expiry}`
          )
          const res = await updatePassword({
            variables: {
              password: fields.password,
              passwordConfirmation: fields.passwordConfirmation
            }
          })
          if (res.data?.userUpdatePassword?.authenticatable) {
            dispatch({ type: 'SIGN_IN' })
          }
        } catch (err) {
          console.log((err as Error).message)
        }
      })()
    }
  }, [data, fields, updatePassword, dispatch])

  return (
    <Container>
      <SectionSpacer>
        <Text variant='h1'>Change Password</Text>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{ token: '', password: '', passwordConfirmation: '' }}
          onSubmit={values => {
            checkPasswordToken({
              variables: { resetPasswordToken: values.token }
            })
            setFields({
              password: values.password,
              passwordConfirmation: values.passwordConfirmation
            })
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <View>
              <Spacer>
                <TextField
                  label='Reset Token'
                  textContentType='oneTimeCode'
                  autoCapitalize='none'
                  name='token'
                />
              </Spacer>
              <Spacer>
                <TextField
                  autoCapitalize='none'
                  label='New Password'
                  secureTextEntry
                  textContentType='newPassword'
                  name='password'
                />
              </Spacer>
              <Spacer>
                <TextField
                  autoCapitalize='none'
                  label='Confirm Password'
                  secureTextEntry
                  textContentType='newPassword'
                  name='passwordConfirmation'
                />
              </Spacer>
              <Spacer>
                <Button
                  title='Submit'
                  disabled={isSubmitting}
                  onPress={() => handleSubmit()}
                />
              </Spacer>
            </View>
          )}
        </Formik>
      </SectionSpacer>
    </Container>
  )
}

export default ChangePassword
