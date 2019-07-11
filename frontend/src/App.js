import React, { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import { Subscription } from 'react-apollo'
import AddLocation from './components/AddLocation';
import AddRound from './components/AddRound'
import Locations from './components/Locations';
import Rounds from './components/Rounds'
import Friends from './components/Friends'
import Me from './components/Me'
import {
  ALL_FRIENDS,
  ALL_LOCATIONS,
  ALL_ROUNDS,
  LOGIN,
  ADD_LOCATION,
  ADD_ROUND
} from './querys'

const App = () => {
  let arr = ['foo', 'bar', 'riii', 'foor']
  arr.splice(2, 1)
  console.log('index 1 remove', arr)
  const client = useApolloClient()

  const [page, setPage] = useState('main')
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [users, setUsers] = useState([])
  const [location, setLocation] = useState(null)
  const [round, setRound] = useState(null)
  console.log('users', users)
  console.log('location', location)
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

  const includedIn = (set, object) =>
    set.map(p => p.id).includes(object.id)

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

  const onUserClicked = (user) =>
    () => {
      const idx = users.indexOf(user)
      console.log('index', idx)
      if (idx > -1) {
        setUsers(users.filter((_, index) => index !== idx))
      } else {
        setUsers(users.concat(user))
      }
    }
  const onLocationClicked = (newLocation) =>
    () => {
      if (location === newLocation) {
        setLocation(null)
      } else {
        setLocation(newLocation)
      }
    }

  const startNewRound = () => {
    setPage('round with location and users', location, users)

  }
  const loginMutation = useMutation(LOGIN, {
    onError: handleError
  })
  const allLocationsQuery = useQuery(ALL_LOCATIONS, {
    skip: !token && page !== 'main'
  })
  const allFriendsQuery = useQuery(ALL_FRIENDS, {
    skip: !token && page !== 'main'
  })
  const allRoundsQuery = useQuery(ALL_ROUNDS, {
    skip: !token && page !== 'main'
  })
  const addLocationMutation = useMutation(ADD_LOCATION, {
    onError: handleError,
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_LOCATIONS })
      const addedLocation = response.data.addLocation

      if (!includedIn(dataInStore.allLocations, addedLocation)) {
        dataInStore.allLocations.push(addedLocation)
        client.writeQuery({
          query: ALL_LOCATIONS,
          data: dataInStore
        })
      }
    }
  })
  const addRoundMutation = useMutation(ADD_ROUND, {
    onError: handleError,
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_ROUNDS })
      const addedRound = response.data.addRound

      if (!includedIn(dataInStore.allRounds, addedRound)) {
        dataInStore.allRounds.push(addedRound)
        client.writeQuery({
          query: ALL_ROUNDS,
          data: dataInStore
        })
      }
    }
  })

  return (
    <div>
      <div>
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={() => setPage('main')}>main page</button>}
        {token && <button onClick={() => {
          setPage('new round')
          setUsers([])
          setLocation(null)
        }}>new round</button>}
        {token && <button onClick={() => { logout() }}>logout</button>}
      </div>
      {
        errorMessage &&
        <div style={{ color: 'red' }}>
          {errorMessage}
        </div>
      }
      {
        !token &&
        <LoginForm login={loginMutation}
          token={token}
          doLogin={doLogin}
          handleError={handleError}
          show={page === 'login'} />
      }
      {
        token &&
        <Rounds
          result={allLocationsQuery}
          show={page === 'main' || page === 'rounds'} />
      }
      {
        token &&
        <AddLocation
          addLocation={addLocationMutation}
          show={page === 'main'}
          handleError={handleError} />
      }
      {
        token &&
        <Locations
          result={allLocationsQuery}
          show={page === 'main' || page === 'new round'}
          onLocationClicked={onLocationClicked} />
      }
      {
        token &&
        <Me
          result={allFriendsQuery}
          show={page === 'main' || page === 'new round'}
          onUserClicked={onUserClicked} />
      }
      {
        token &&
        <Friends
          result={allFriendsQuery}
          show={page === 'main' || page === 'new round'}
          onFriendClicked={onUserClicked} />
      }
      {
        token &&
        <AddRound
          startNewRound={startNewRound}
          location={location}
          users={users}
          onLocationClicked={onLocationClicked}
          onUserClicked={onUserClicked}
          show={page === 'new round'}
        />
      }
    </div >
  )
}

export default App;
