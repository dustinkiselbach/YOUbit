import {
  HttpLink,
  ApolloLink,
  ApolloClient,
  InMemoryCache,
  concat
} from '@apollo/client'

import AsyncStorage from '@react-native-async-storage/async-storage'

// apollo
const httpLink = new HttpLink({
  uri: 'https://damp-cove-03421.herokuapp.com/graphql'
})

// if you want to implement logout link we need to nest it in react component
// to access useLogout hook which is made available by context
// current implementation will require handling of errors for each request
// on protected routes

// const logoutLink = onError(({ networkError }) => {
//   // if (networkError.statusCode === 401) {
//   //   console.log('bad!')
//   // }
//   console.log('poop')
//   console.log(networkError)
// })

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'access-token': AsyncStorage.getItem('ACCESS_TOKEN') || null,
      client: AsyncStorage.getItem('CLIENT') || null,
      uid: AsyncStorage.getItem('UID') || null
    }
  }))

  return forward(operation)
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink)
})

export default client
