import React, { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import gql from "graphql-tag";
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import { Subscription } from 'react-apollo'
import AddLocation from './components/AddLocation';
import Locations from './components/Locations';
import Rounds from './components/Rounds'
import Friends from './components/Friends'
const LOGIN = gql`
mutation login($username: String!, $password: String! ){
  login(username: $username, password: $password){
    value
  }
  
}
`
const ALL_FRIENDS = gql`
{
  me {
    friends{username}
  }
}
`
const ALL_LOCATIONS = gql`
{
  allLocations {
    name
    id
  }
}  
`
const ALL_ROUNDS = gql`
{
  allRounds {
    locations{name}
    date
    id
  }
}
`
const ADD_LOCATION = gql`
  mutation createLocation($name: String!){
    addLocation(
      name: name
    ){
      id, name
    }
  }
`
const ADD_ROUND = gql`
  mutation createRound($locationId: ID!){
    addRound(
      locationId: locationId
    ){
      id
    }
  }
`
const ADD_PLAY = gql`
  mutation createPlay($roundId: ID!, $playNumber:Int!){
    addPlay(
      roundId: roundId,
      playNumber: playNumber
    ){
      id
    }
  }
`
const ADD_POINTS = gql`
  mutation createPoint($playId: ID!, $userId: ID!, $points: Int!){
    addPoint(
      playId: playId,
      userId: userId,
      points: points
    ){
      id
    }
  }
`
const App = () => {
  const client = useApolloClient()

  const [page, setPage] = useState('main')
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  const handleError = (error) => {
    if (error.graphQLErrors.length > 0) {
      setErrorMessage(error.graphQLErrors[0].message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 10000)
    }
    else if (error.networkError) {
      const errorArray = error.networkError.result.errors
      if (errorArray && errorArray.length > 0) {
        setErrorMessage(errorArray[0].message)
        setTimeout(() => {
          setErrorMessage(null)
        }, 10000)
      }
    }
  }
  const doLogin = (token) => {
    console.log('login', token)
    setToken(token)
    localStorage.setItem('token', token)
    setPage('main')
    client.resetStore()
  }
  const logout = () => {
    console.log('logout')
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const loginMutation = useMutation(LOGIN, {
    onError: handleError
  })
  const addLocationMutation = useMutation(ADD_LOCATION, {
    onError: handleError
  })
  const allLocationsQuery = useQuery(ALL_LOCATIONS, {
    skip: !token && page !== 'main'
  })
  const allRoundsQuery = useQuery(ALL_ROUNDS, {
    skip: !token && page !== 'main'
  })
  const allFriendsQuery = useQuery(ALL_FRIENDS, {
    skip: !token && page !== 'main'
  })
  return (
    <div>
      <div>
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={() => setPage('main')}>main page</button>}
        {token && <button onClick={() => setPage('locations')}>locations</button>}
        {token && <button onClick={() => { logout() }}>logout</button>}
      </div>
      {errorMessage &&
        <div style={{ color: 'red' }}>
          {errorMessage}
        </div>
      }
      {!token &&
        <LoginForm login={loginMutation}
          token={token}
          doLogin={doLogin}
          handleError={handleError}
          show={page === 'login'} />
      }
      {token &&
        <Rounds
          result={allLocationsQuery}
          show={page === 'main'} />
      }
      {token &&
        <Locations
          result={allLocationsQuery}
          show={page === 'main'} />
      }
      {token &&
        <Friends
          result={allFriendsQuery}
          show={page === 'main'} />
      }
      {token &&
        <AddLocation addLocation={addLocationMutation} />}
    </div>
  )
}

export default App;
