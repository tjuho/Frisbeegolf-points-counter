import React, { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import { Subscription } from 'react-apollo'
import AddLocation from './components/AddLocation';
import AddRound from './components/AddRound'
import Locations from './components/Locations';
import Rounds from './components/Rounds'
import Round from './components/Round'
import Friends from './components/Friends'
import Me from './components/Me'
import {
  ALL_FRIENDS,
  ALL_LOCATIONS,
  ALL_ROUNDS,
  ALL_POINTS,
  ALL_USERS,
  LOGIN,
  ADD_LOCATION,
  ADD_ROUND,
  ADD_POINT,
  ADD_NEW_TRACK,
  DELETE_LAST_TRACK
} from './querys'

const App = () => {
  let arr = ['foo', 'bar', 'riii', 'foor']
  arr.splice(2, 1)
  console.log('index 1 remove', arr)
  const client = useApolloClient()

  const [page, setPage] = useState('main')
  const [token, setToken] = useState(null)
  const [users, setUsers] = useState([])
  const [location, setLocation] = useState(null)
  const [round, setRound] = useState(null)
  const [playNumber, setPlayNumber] = useState(0)
  const [pointChanges, setPointChanges] = useState([])
  const [players, setPlayers] = useState([])
  const [roundId, setRoundId] = useState(null)
  //  const [currentPlayers, setCurrentPlayers] = useState(["5d18f79935fc7623c728bed7", "5d19bb0b462f0454243492d9"])
  const [currentPlayers, setCurrentPlayers] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [trackIndex, setTrackIndex] = useState(0)
  const [finished, setFinished] = useState(false)

  const handleError = (error) => {
    console.log('error', error)
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
  const allUsersQuery = useQuery(ALL_USERS, {
    skip: currentPlayers && currentPlayers.length > 0
  })
  if (!allUsersQuery.loading && !allUsersQuery.error && allUsersQuery.data) {
    setCurrentPlayers(allUsersQuery.data.allUsers)
  }
  const allPointsQuery = useQuery(ALL_POINTS, {
    skip: !token || !roundId,
    variables: {
      roundId
    },
  })
  const addPointMutation = useMutation(ADD_POINT, {
    onError: handleError,
    update: (store, response) => {
      console.log('add point response', response)
      let dataInStore = store.readQuery({
        query: ALL_POINTS,
        variables: {
          roundId
        },
      })
      console.log('data in store before point update', dataInStore.allPoints)
      const addedPoint = response.data.addPoint
      console.log('added point', addedPoint)
      const temp = dataInStore.allPoints.filter(point => point.id !== addedPoint.id).concat(addedPoint)
      console.log('store after', temp)
      client.writeQuery({
        query: ALL_POINTS,
        variables: {
          roundId
        },
        data: { allPoints: temp }
      })
    }
  })
  const deleteLastTrackMutation = useMutation(DELETE_LAST_TRACK, {
    onError: handleError,
    update: (store, response) => {
      const deletedTrackIndex = response.data.deleteLastTrack
      console.log('deleted track index', deletedTrackIndex)

      if (deletedTrackIndex > -1) {
        const dataInStore = store.readQuery({
          query: ALL_POINTS,
          variables: {
            roundId
          },
        })
        console.log('points before deletion', dataInStore.allPoints)
        const temp = dataInStore.allPoints.filter(point => point.trackIndex !== deletedTrackIndex)
        console.log('filtered', temp)
        client.writeQuery({
          query: ALL_POINTS,
          variables: {
            roundId
          },
          data: { allPoints: temp }
        })
        if (trackIndex > deletedTrackIndex - 1) {
          setTrackIndex(deletedTrackIndex - 1)
        }
        const dataInStoreAfter = store.readQuery({
          query: ALL_POINTS,
          variables: {
            roundId
          },
        })
        console.log('data in store after deletion', dataInStoreAfter.allPoints, 'track index now', trackIndex)
      }
    }
  })

  const addNewTrackMutation = useMutation(ADD_NEW_TRACK, {
    onError: handleError,
    update: (store, response) => {
      let dataInStore = store.readQuery({
        query: ALL_POINTS,
        variables: {
          roundId
        },
      })
      console.log('data in store before new track push', dataInStore.allPoints)
      console.log('new track response', response.data)
      const newTrackPoints = response.data.addNewTrack
      console.log('returned data', newTrackPoints)
      if (newTrackPoints && newTrackPoints.length > 0) {
        let temp = dataInStore.allPoints
        for (let i = 0; i < newTrackPoints.length; i++) {
          temp.push(newTrackPoints[i])
        }
        console.log('new points', temp)
        client.writeQuery({
          query: ALL_POINTS,
          variables: {
            roundId
          },
          data: { allPoints: temp }
        })
        console.log('new track index', newTrackPoints[0].trackIndex)
        setTrackIndex(newTrackPoints[0].trackIndex)
        dataInStore = store.readQuery({
          query: ALL_POINTS,
          variables: {
            roundId
          },
        })
        console.log('data in store after new track push', dataInStore)
      }
    }
  })
  const addNewTrack = async () => {
    //console.log('add new track to round', roundId)
    //try {
    let response = await addNewTrackMutation({
      variables: {
        roundId: roundId
      }
    })
    const points = response.data
    //console.log('response', response.data)
    /*
    } catch (error) {
      handleError(error)
    }*/
  }
  const deleteLastTrack = async () => {
    console.log('delete last track')
    try {
      const response = await deleteLastTrackMutation({
        variables: {
          roundId: roundId
        }
      })
      console.log('response', response.data)
    } catch (error) {
      handleError(error)
    }
  }
  const updatePoint = async (points, userId) => {
    //console.log('add point with points and userId', points, userId)
    try {
      const response = await addPointMutation({
        variables: {
          points: points,
          trackIndex: trackIndex,
          userId: userId,
          roundId: roundId
        }
      })
      //console.log('response', response.data)
    } catch (error) {
      handleError(error)
    }
  }

  const changeTrack = (index) => {
    setTrackIndex(index)
  }
  console.log('users', users)
  console.log('location', location)
  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  const handlePointsChange = (player, newPoints) =>
    () => {
      let temp = []
      for (let i = 0; i < players.length; i++) {
        temp[i] = pointChanges[i]
        if (player === players[i]) {
          temp[i] = newPoints
        }
      }
      setPointChanges(temp)
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
      const friends = store.readQuery({ query: ALL_FRIENDS })
      console.log('firends store', friends)
      const addedLocation = response.data.addLocation
      console.log('addedLocation', addedLocation)
      console.log('data in store all locations', dataInStore.allLocations)
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
          result={allRoundsQuery}
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
      {
        token && currentPlayers.length > 0 && round &&
        <Round
          result={allPointsQuery}
          addNewTrack={addNewTrack}
          updatePoint={updatePoint}
          deleteLastTrack={deleteLastTrack}
          changeTrack={changeTrack}
          players={currentPlayers}
          trackIndex={trackIndex}
        />
      }
      {

      }
    </div >
  )
}

export default App;
