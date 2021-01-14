import { HttpLink, ApolloClient, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistCache, AsyncStorageWrapper } from 'apollo3-cache-persist'

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        habitIndex: {
          merge (_, incoming) {
            return incoming
          }
        },
        remindersIndex: {
          merge (_, incoming) {
            return incoming
          }
        }
      }
    }
  }
})

const setUpAsyncCache = async (): Promise<void> => {
  await persistCache({
    cache,
    storage: new AsyncStorageWrapper(AsyncStorage)
  })
}

setUpAsyncCache()

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

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await AsyncStorage.getItem('ACCESS_TOKEN')
  const client = await AsyncStorage.getItem('CLIENT')
  const uid = await AsyncStorage.getItem('UID')

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      'access-token': token,
      client,
      uid
    }
  }
})

const client = new ApolloClient({
  cache,
  link: authLink.concat(httpLink)
})

export default client
