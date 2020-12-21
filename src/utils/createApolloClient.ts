import {
  HttpLink,
  ApolloLink,
  ApolloClient,
  InMemoryCache,
  from
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import AsyncStorage from '@react-native-async-storage/async-storage'

// apollo
const httpLink = new HttpLink({
  uri: 'https://damp-cove-03421.herokuapp.com/graphql'
})

const logoutLink = onError(({ networkError }) => {
  // if (networkError.statusCode === 401) {
  //   console.log('bad!')
  // }
  console.log('poop')
  console.log(networkError)
})

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
  link: from([authMiddleware, logoutLink, httpLink])
})

export default client
