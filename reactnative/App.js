import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import {
  Platform,
  AsyncStorage,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { setContext } from 'apollo-link-context'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import { WebSocketLink } from 'apollo-link-ws'

//import your ApolloProvider from react-apollo to wrap your app.
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
//import ApolloClient, InMemoryCache, and HttpLink to define your client to cnnect to your graphql server.//#endregion
import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-client-preset';
import Root from './Root'
let ioshttp = 'http://frisbeegolfappi.herokuapp.com/graphql'
let androidhttp = 'http://frisbeegolfappi.herokuapp.com/graphql'
let webhttp = 'http://frisbeegolfappi.herokuapp.com/graphql'
let wsuri = `ws://frisbeegolfappi.herokuapp.com/graphql`
if (__DEV__) {
  ioshttp = 'http://localhost:4000/graphql'
  androidhttp = 'http://10.0.2.2:4000/graphql'
  webhttp = 'http://localhost:4000/graphql'
  wsuri = `ws://localhost:4000/graphql`
  console.log('start in development mode')
}

console.log('http', webhttp, 'ws link', wsuri)

const httpLink = new HttpLink({
  uri: Platform.select({
    ios: ioshttp,
    android: androidhttp,
    web: webhttp,
  })
})
const wsLink = new WebSocketLink({
  uri: wsuri,
  options: { reconnect: true }
})
const authLink = setContext(async (_, { headers }) => {
  let token = null
  try {
    token = await AsyncStorage.getItem('token')
  }
  catch (error) {
    console.log('error loading token for auth link', error)
  }
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
  //Assign to your cache property a instance of a InMemoryCache
  cache: new InMemoryCache(),
  //Assign your link with a new instance of a HttpLink linking to your graphql server.
  link
})
export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>
          <Root />
        </ApolloHooksProvider>
      </ApolloProvider>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/app_icon.png'),
    ]),/*
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),*/
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}


