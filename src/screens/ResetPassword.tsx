import React from 'react'
import { View } from 'react-native'
import { Container, TextField, Button, Spacer, Text, Link } from '../components'
import { Formik } from 'formik'
import { AuthStackNav } from '../types'

const Login: React.FC<AuthStackNav<'ResetPassword'>> = ({ navigation }) => {
  return (
    <Container>
      <Text variant='h1'>Reset Password</Text>
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{ email: '' }}
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
    </Container>
  )
}

export default Login
