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
import { useUserSignUpMutation } from '../generated/graphql'
import { useLogin } from '../utils'
import { ApolloError } from '@apollo/client'

const Register: React.FC<AuthStackNav<'Register'>> = ({ navigation }) => {
  const [userSignUp] = useUserSignUpMutation()
  const [login] = useLogin()

  return (
    <Container>
      <SectionSpacer>
        <Text variant='h1'>Register</Text>
        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            email: '',
            password: '',
            passwordConfirmation: '',
            name: ''
          }}
          onSubmit={async (values, { setErrors }) => {
            try {
              const res = await userSignUp({ variables: values })
              if (res.data?.userSignUp?.credentials) {
                login(res.data.userSignUp.credentials)
              }
            } catch (err) {
              const {
                detailed_errors: {
                  email,
                  name,
                  password,
                  password_confirmation: passwordConfirmation
                }
              } = (err as ApolloError).graphQLErrors[0].extensions ?? {
                detailed_errors: null
              }

              setErrors({ email, name, password, passwordConfirmation })
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
                  label='Name'
                  textContentType='name'
                  name='name'
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
                <TextField
                  autoCapitalize='none'
                  label='Confirm Password'
                  secureTextEntry
                  textContentType='password'
                  name='passwordConfirmation'
                />
              </Spacer>

              <Spacer>
                <Button
                  title='Register'
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
            <Text variant='p'>Already have an account? </Text>
            <Link navigationCallBack={() => navigation.navigate('Login')}>
              Login
            </Link>
          </View>
        </Spacer>
      </SectionSpacer>
    </Container>
  )
}

export default Register
