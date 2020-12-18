import React from 'react'
import { View } from 'react-native'
import { Container, TextField, Button, Spacer, Text, Link } from '../components'
import { Formik } from 'formik'
import { AuthStackNav } from '../types'

const Register: React.FC<AuthStackNav<'Register'>> = ({ navigation }) => {
  return (
    <Container>
      <Text variant='h1'>Register</Text>
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{ email: '', password: '' }}
        onSubmit={async values => {
          console.log(values)
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
    </Container>
  )
}

export default Register
