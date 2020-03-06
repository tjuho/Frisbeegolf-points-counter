import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks'
import { Container, Menu, Router } from 'semantic-ui-react'
import Navigation from './components/Navigation'
import Round from './components/Round'
import AddRound from './components/AddRound'
import Rounds from './components/Rounds'
import LoginForm from './components/LoginForm'
import crypto from 'crypto'
import {
  ALL_LOCATIONS,
  ALL_ROUNDS,
  ALL_POINTS,
  ALL_USERS,
  LOGIN,
  ADD_LOCATION,
  ADD_ROUND,
  DELETE_ROUND,
  ADD_CACHED_POINTS,
  ME,
} from './querys'
import useTimeout from './useTimeout'
import './styles.css'

const App = (props) => {
  const [currentRoundId, setCurrentRoundId] = useState(null)
  const [currentRound, setCurrentRound] = useState(null)
  const [currentPlayers, setCurrentPlayers] = useState([])
  const [currentLocation, setCurrentLocation] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [trackIndex, setTrackIndex] = useState(0)
  const [token, setToken] = useState(null)
  //const [username, setUsername] = useState(null)
  const [page, setPage] = useState("main")
  const client = useApolloClient()
  const [savedState, setSavedState] = useState(true)
  const [uploadingPointsState, setUploadingPointsState] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setToken(token)
  }, [])

  const getRandomId = () => {
    return crypto.randomBytes(16).toString("hex")
  }

  const doLogin = async (username, password) => {
    const response = await loginMutation({
      variables: {
        username,
        password
      }
    })
    if (response) {
      const loginToken = response.data.login.token
      const loginUsername = response.data.login.username
      if (loginToken) {
        await client.resetStore()
        localStorage.setItem('token', loginToken)
        localStorage.setItem('username', loginUsername)
        setToken(loginToken)
        setPage('main')
      }
    }
  }

  const doLogout = async () => {
    setToken(null)
    localStorage.clear()
    await client.resetStore()
  }
  useTimeout(doLogout)
  if (props.sessionTimeout) {
    console.log('session time out received')
    doLogout()
  }
  const handleError = (error) => {
    console.log('error', error)
    if (error.graphQLErrors.length > 0) {
      setErrorMessage(error.graphQLErrors[0].message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 7000)
    }
    else if (error.networkError) {
      const errorArray = error.networkError.result.errors
      if (errorArray && errorArray.length > 0) {
        setErrorMessage(errorArray[0].message)
        setTimeout(() => {
          setErrorMessage(null)
        }, 7000)
      }
    }
  }


  // uploads cached points to server
  const [addCachedPointsMutation] = useMutation(ADD_CACHED_POINTS, {
    onError: handleError,
    update: (store, response) => {
      const serverPoints = response.data.addCachedPoints
      let dataInStore = store.readQuery({
        query: ALL_POINTS,
        variables: {
          roundId: currentRoundId
        },
      })
      const localPoints = dataInStore.allPoints
      setSavedState(true)
      if (serverPoints.length !== localPoints.length) {
        setSavedState(false)

      } else {
        serverPoints.forEach(serverPoint => {
          let foundMatch = false
          localPoints.forEach(localPoint => {
            if (serverPoint.round.id === localPoint.round.id
              && serverPoint.user.id === localPoint.user.id
              && serverPoint.trackIndex === localPoint.trackIndex
              && serverPoint.points === localPoint.points) {
              foundMatch = true
              return
            }
          })
          if (!foundMatch) {
            setSavedState(false)
          }
        });
        //TODO: update the points in the all rounds view
        /*
        if (savedState && serverPoints.length > 0) {
          const roundId = serverPoints[0].round.id
          const allRoundsInStore = store.readQuery({
            query: ALL_ROUNDS
          })
          allRoundsInStore.allRounds.forEach(round => {
            if (round.id === roundId) {

            }
          })*//*
    store.writeQuery({
      query: ALL_ROUNDS
    })
  }*/
      }
    }
  })

  const [addRoundMutation] = useMutation(ADD_ROUND, {
    onError: handleError,
    update: (store, response) => {
      let dataInStore = store.readQuery({
        query: ALL_ROUNDS
      })
      console.log('data in store before', dataInStore.allRounds)
      const addedRound = response.data.addRound
      const temp = dataInStore.allRounds.filter(round => round.id !== addedRound.id).concat(addedRound)
      console.log('added round', addedRound)
      console.log('all rounds', temp)
      client.writeQuery({
        query: ALL_ROUNDS,
        data: { allRounds: temp }
      })
    }
  })
  const [addLocationMutation] = useMutation(ADD_LOCATION, {
    onError: handleError,
    update: (store, response) => {
      let dataInStore = store.readQuery({
        query: ALL_LOCATIONS
      })
      const addedLocation = response.data.addLocation
      const temp = dataInStore.allLocations.filter(location => location.id !== addedLocation.id).concat(addedLocation)
      client.writeQuery({
        query: ALL_LOCATIONS,
        data: { allLocations: temp }
      })
    }
  })
  const [deleteRoundMutation] = useMutation(DELETE_ROUND, {
    onError: handleError,
    update: (store, response) => {
      let dataInStore = store.readQuery({
        query: ALL_ROUNDS
      })
      const deletedRound = response.data.deleteRound
      const temp = dataInStore.allRounds.filter(round => round.id !== deletedRound.id)
      client.writeQuery({
        query: ALL_ROUNDS,
        data: { allRounds: temp }
      })
    }
  })
  const [loginMutation] = useMutation(LOGIN, {
    onError: handleError,
    update: (store, response) => {
    }
  })
  const addNewTrackToCache = () => {
    const originalState = client.readQuery({
      query: ALL_POINTS,
      variables: {
        roundId: currentRoundId
      }
    })
    const allPoints = originalState.allPoints
    let max = -1
    allPoints.forEach(point => {
      if (point.trackIndex > max) {
        max = point.trackIndex
      }
    })
    currentRound.users.forEach(player => {
      addPointToCache(currentRoundId, player.id, max + 1, 3)
    })
  }
  const addPointToCache = (roundId, userId, trackIndex, points) => {
    const originalState = client.readQuery({
      query: ALL_POINTS,
      variables: {
        roundId: roundId
      }
    })
    const temp = originalState.allPoints.filter(point =>
      point.user.id === userId && point.trackIndex === trackIndex)
    if (temp.length > 0) {
      const data = temp[0]
      client.writeQuery({
        query: ALL_POINTS,
        variables: {
          roundId: roundId
        },
        data: {
          allPoints: originalState.allPoints
            .filter(point => point.id !== data.id)
            .concat({
              ...data,
              points
            })
        }
      })
    } else {
      const newPoint = {
        round: { id: roundId, __typename: "Round" },
        user: { id: userId, __typename: "User" },
        trackIndex,
        points,
        id: getRandomId(),
        __typename: 'Point'
      }
      client.writeQuery({
        query: ALL_POINTS,
        variables: {
          roundId: roundId
        },
        data: {
          allPoints: originalState.allPoints
            .concat(newPoint)
        }
      })
    }
    setSavedState(false)
  }

  const deleteLastTrackFromCache = (roundId) => {
    const originalState = client.readQuery({
      query: ALL_POINTS,
      variables: {
        roundId: roundId
      }
    })
    if (originalState.allPoints.length === 0) {
      return
    }
    const maxTrackIndex = originalState.allPoints
      .map(point => point.trackIndex)
      .sort((i1, i2) => i2 - i1)[0]
    client.writeQuery({
      query: ALL_POINTS,
      variables: {
        roundId: roundId
      },
      data: {
        allPoints: originalState.allPoints.filter(point => point.trackIndex !== maxTrackIndex)
      }
    })
    setSavedState(false)
    if (trackIndex >= maxTrackIndex) {
      setTrackIndex(maxTrackIndex - 1)
    }
  }

  const uploadPointsFromCacheToServer = async () => {
    const originalState = client.readQuery({
      query: ALL_POINTS,
      variables: {
        roundId: currentRoundId
      }
    })
    if (originalState.allPoints.length === 0) {
      return
    }
    const allPoints = originalState.allPoints
    try {
      await setUploadingPointsState(true)
      await addCachedPointsMutation({
        variables: {
          roundId: currentRoundId,
          pointIds: allPoints.map(point => point.id.toString()),
          userIds: allPoints.map(point => point.user.id.toString()),
          trackIndexes: allPoints.map(point => point.trackIndex),
          points: allPoints.map(point => point.points)
        }
      })
      setUploadingPointsState(false)
    } catch (error) {
      handleError(error)
    }
  }

  const deleteLastTrack = async () => {
    deleteLastTrackFromCache(currentRoundId)
  }
  const updatePoint = async (points, userId) => {
    addPointToCache(currentRoundId, userId, trackIndex, points)
  }

  const changeTrack = (index) => {
    setTrackIndex(index)
  }
  const setNewRound = (round) => {
    setCurrentRound(round)
    setCurrentRoundId(round.id)
    setTrackIndex(-1)
    setPage('round')
  }
  const allLocationsQuery = useQuery(ALL_LOCATIONS, {
    skip: !token
  })
  const allUsersQuery = useQuery(ALL_USERS, {
    skip: !token
  })
  const allPointsQuery = useQuery(ALL_POINTS, {
    skip: !currentRoundId || !token,
    variables: {
      roundId: currentRoundId
    },
  })

  const allRoundsQuery = useQuery(ALL_ROUNDS, {
    skip: !token
  })
  const handleLocationClick = (location) =>
    () => {
      if (location === currentLocation) {
        setCurrentLocation(null)
      } else {
        setCurrentLocation(location)
      }
    }
  const handleUserClick = (user) =>
    () => {
      if (currentPlayers.includes(user)) {
        setCurrentPlayers(currentPlayers.filter(player => player !== user))
      } else {
        setCurrentPlayers(currentPlayers.concat(user))
      }
    }

  const addNewLocation = async (locationName) => {
    await addLocationMutation(
      {
        variables: {
          name: locationName
        }
      }
    )
  }

  const deleteRound = async (round) => {
    await deleteRoundMutation(
      {
        variables: {
          roundId: round.id
        }
      }
    )
  }
  const startNewRound = async () => {
    const response = await addRoundMutation(
      {
        variables: {
          userIds: currentPlayers.map(user => user.id),
          locationId: currentLocation.id
        }
      }
    )
    setCurrentRound(response.data.addRound)
    setCurrentRoundId(response.data.addRound.id)
  }
  const finishRound = async () => {
    await uploadPointsFromCacheToServer()
    setCurrentRound(null)
    setCurrentRoundId(null)
    setCurrentPlayers([])
    setCurrentLocation(null)
    setPage('main')
  }
  const meQuery = useQuery(ME, {
    skip: !token
  })
  return (
    <Container>
      {token && <Navigation show={true}
        doLogout={doLogout}
        setPage={setPage}
        meQuery={meQuery}
        currentRoundId={currentRoundId} />
      }
      {errorMessage && <div className="error">{errorMessage}</div>
      }
      {!token &&
        <LoginForm
          doLogin={doLogin}
          show={true}
          handleError={handleError} />
      }
      {token && !currentRoundId && <AddRound
        addNewLocation={addNewLocation}
        allLocationsQuery={allLocationsQuery}
        allUsersQuery={allUsersQuery}
        handleLocationClick={handleLocationClick}
        handleUserClick={handleUserClick}
        currentLocation={currentLocation}
        currentPlayers={currentPlayers}
        startNewRound={startNewRound}
        show={page === 'round'}
      />}
      {token && <Rounds
        allRoundsQuery={allRoundsQuery}
        setRound={setNewRound}
        deleteRound={deleteRound}
        show={page === 'main'}
      />}
      {token && currentRoundId && <Round
        allPointsQuery={allPointsQuery}
        round={currentRound}
        addNewTrack={addNewTrackToCache}
        updatePoint={updatePoint}
        deleteLastTrack={deleteLastTrack}
        changeTrack={changeTrack}
        trackIndex={trackIndex}
        finishRound={finishRound}
        uploadPoints={uploadPointsFromCacheToServer}
        show={page === 'round'}
        savedState={savedState}
        uploadingPoints={uploadingPointsState}
      />}
      <div>
        <br />
        <em>Frisbeegolf app {'\u00A9'} 2020 Juho Taipale</em>
      </div>
    </Container>
  )

}

export default App;
