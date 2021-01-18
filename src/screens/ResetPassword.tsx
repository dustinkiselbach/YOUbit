import React from 'react'
import { View } from 'react-native'
import {
  Container,
  TextField,
  Button,
  Spacer,
  Text,
  Link,
  Title,
  SectionSpacer
} from '../components'
import { Formik } from 'formik'
import { AuthStackNav } from '../types'
import { useUserSendPasswordResetMutation } from '../generated/graphql'

const Login: React.FC<AuthStackNav<'ResetPassword'>> = ({ navigation }) => {
  const [sendResetToken] = useUserSendPasswordResetMutation()
  return (
    <Container>
      <SectionSpacer>
        <Title>Reset Password</Title>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{ email: '' }}
          onSubmit={async (values, { setErrors }) => {
            try {
              await sendResetToken({ variables: values })

              navigation.navigate('ChangePassword')
              // redirect to change password form
            } catch (err) {
              setErrors({ email: "doesn't exist" })
            }
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <View>
              <Spacer>
                <TextField
                  label='Email'
                  textContentType='emailAddress'
                  autoCapitalize='none'
                  name='email'
                />
              </Spacer>

              <Spacer>
                <Button
                  title='Reset Password'
                  disabled={isSubmitting}
                  onPress={() => handleSubmit()}
                />
              </Spacer>
            </View>
          )}
        </Formik>
        {/* flex to line up link and text */}
        <Spacer>
          <View style={{ flexDirection: 'row' }}>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <Text variant='p'>If you haven't registered yet, </Text>
            <Link navigationCallBack={() => navigation.navigate('Register')}>
              Register
            </Link>
          </View>
        </Spacer>
      </SectionSpacer>
    </Container>
  )
}

export default Login
