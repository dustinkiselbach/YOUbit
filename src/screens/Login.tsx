import React from 'react'
import { View } from 'react-native'
import {
  Container,
  TextField,
  Button,
  Spacer,
  Text,
  Link,
  SectionSpacer
} from '../components'
import { Formik } from 'formik'
import { AuthStackNav } from '../types'
import { useUserLoginMutation } from '../generated/graphql'
import { useLogin } from '../utils'

const Login: React.FC<AuthStackNav<'Login'>> = ({ navigation }) => {
  const [userLogin] = useUserLoginMutation()
  const [login] = useLogin()
  return (
    <Container>
      <SectionSpacer>
        <Text variant='h1'>Login</Text>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{ email: '', password: '' }}
          onSubmit={async values => {
            try {
              const res = await userLogin({ variables: values })
              if (res.data?.userLogin?.credentials) {
                login(res.data.userLogin.credentials)
              }
            } catch (err) {
              console.log((err as Error).message)
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
                <TextField
                  autoCapitalize='none'
                  label='Password'
                  secureTextEntry
                  textContentType='password'
                  name='password'
                />
              </Spacer>
              <Spacer>
                <Button
                  title='Login'
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
            <Text variant='p'>Don't have an account? </Text>
            <Link navigationCallBack={() => navigation.navigate('Register')}>
              Create one
            </Link>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <Text variant='p'>Forgot your password? </Text>
            <Link
              navigationCallBack={() => navigation.navigate('ResetPassword')}
            >
              Reset Password
            </Link>
          </View>
        </Spacer>
      </SectionSpacer>
    </Container>
  )
}

export default Login
