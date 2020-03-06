import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ApolloProvider } from '@apollo/react-common'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'

import { ApolloClient } from '@apollo/client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'

import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
const wshost = window.location.origin.replace(/^http/, 'ws')
let wsuri = `${wshost}/graphql`
let httpUri = '/graphql'
if (process.env.NODE_ENV !== 'production') {
  console.log('development or testing environment')
  httpUri = 'http://localhost:4000/graphql'
  wsuri = `ws://localhost:4000/graphql`
  //httpUri = 'http://frisbeegolfappi.herokuapp.com/graphql'
  //wsuri = `ws://frisbeegolfappi.herokuapp.com/graphql`
}
console.log('websocket uri', wsuri)
console.log('http uri', httpUri)

const wsLink = new WebSocketLink({
  uri: wsuri,
  //options: { reconnect: true }
})

const httpLink = createHttpLink({
  uri: httpUri,
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink),
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <App />
    </ApolloHooksProvider>
  </ApolloProvider>,
  document.getElementById('root')
)