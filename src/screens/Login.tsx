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
  SectionSpacer,
  KeyboardAvoidingScrollView
} from '../components'
import { Formik } from 'formik'
import { AuthStackNav } from '../types'
import { useUserLoginMutation } from '../generated/graphql'
import { useLogin } from '../utils'
import { ApolloError } from '@apollo/client'

const Login: React.FC<AuthStackNav<'Login'>> = ({ navigation }) => {
  const [userLogin] = useUserLoginMutation()
  const [login] = useLogin()

  return (
    <Container>
      <KeyboardAvoidingScrollView>
        <SectionSpacer>
          <Title>Login</Title>
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={{ email: '', password: '' }}
            onSubmit={async (values, { setErrors }) => {
              try {
                const res = await userLogin({ variables: values })
                if (res.data?.userLogin?.credentials) {
                  login(res.data.userLogin.credentials)
                }
              } catch (err) {
                const {
                  detailed_errors: { email, password }
                } = (err as ApolloError).graphQLErrors[0].extensions ?? {
                  detailed_errors: null
                }

                setErrors({ email, password })
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
      </KeyboardAvoidingScrollView>
    </Container>
  )
}

export default Login
