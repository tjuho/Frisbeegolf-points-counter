import React, { useState, useEffect } from 'react';
{/*import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'*/ }
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks'
import Navigation from '../components/Navigation'
import Round from '../components/Round'
import AddRound from '../components/AddRound'
import Rounds from '../components/Rounds'
import LoginForm from '../components/LoginForm'
import { styles } from '../utils/styles'
import {
  ALL_FRIENDS,
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
} from '../querys'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
} from 'react-native';


const HomeScreen = (props) => {
  const [currentRoundId, setCurrentRoundId] = useState(null)
  const [currentRound, setCurrentRound] = useState(null)
  const [currentPlayers, setCurrentPlayers] = useState([])
  const [currentLocation, setCurrentLocation] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [trackIndex, setTrackIndex] = useState(0)
  const [token, setToken] = useState(null)
  const [username, setUsername] = useState(null)
  const [page, setPage] = useState("main")
  const client = useApolloClient()
  const [savedState, setSavedState] = useState(true)
  const [uploadingPointsState, setUploadingPointsState] = useState(false)
  useEffect(() => {

    AsyncStorage.getItem('token')
      .then((token) => {
        setToken(token)
      })
      .catch(error => {
        console.log('error loading token', error)
      })
    AsyncStorage.getItem('username')
      .then((username) => {
        setUsername(username)
      })
      .catch(error => {
        console.log('error loading username', error)
      })
  }, [])

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
      console.log('local and server lengths', localPoints.length, serverPoints.length)
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
              console.log('found match')
              return
            }
          })
          if (!foundMatch) {
            console.log('set saved state to false')
            setSavedState(false)
          }
        });
      }
      console.log('local and server points', localPoints, serverPoints)
    }
  })

  const [addRoundMutation] = useMutation(ADD_ROUND, {
    onError: handleError,
    update: (store, response) => {
      let dataInStore = store.readQuery({
        query: ALL_ROUNDS
      })
      const addedRound = response.data.addRound
      const temp = dataInStore.allRounds.filter(round => round.id !== addedRound.id).concat(addedRound)
      client.writeQuery({
        query: ALL_ROUNDS,
        data: { allRounds: temp }
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
      console.log('deleted round', deletedRound, 'rounds before', dataInStore.allRounds)
      const temp = dataInStore.allRounds.filter(round => round.id !== deletedRound.id)
      console.log('new data in store', temp)
      client.writeQuery({
        query: ALL_ROUNDS,
        data: { allRounds: temp }
      })
    }
  })
  const [loginMutation] = useMutation(LOGIN, {
    onError: handleError
  })

  const getRandomId = () => {
    const min = 1;
    const max = 1000000;
    const rand = min + Math.random() * (max - min);
    return rand.toString(16)
  }

  const doLogin = async (username, password) => {
    const response = await loginMutation({
      variables: {
        username,
        password
      }
    })
    const token = response.data.login.token
    const tusername = response.data.login.username
    if (token) {
      try {
        client.resetStore()
        await AsyncStorage.setItem('token', token)
        await AsyncStorage.setItem('username', tusername)
        setToken(token)
        setUsername(username)
        setPage('main')
      }
      catch (error) {
        console.log('error savin token', error)
      }
    }
  }

  const doLogout = async () => {
    try {
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('username')
      setToken(null)
      setUsername(null)
      client.resetStore()
      console.log('logged out')
    }
    catch (error) {
      console.log('error removing token', error)
    }
  }

  const handleError = (error, text = 'default') => {
    console.error(text, error)
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

  const addNewTrackToCache = () => {
    const originalState = client.readQuery({
      query: ALL_POINTS,
      variables: {
        roundId: currentRoundId
      }
    })
    const allPoints = originalState.allPoints
    console.log('all points', allPoints)
    let max = -1
    allPoints.forEach(point => {
      if (point.trackIndex > max) {
        max = point.trackIndex
      }
    })
    currentRound.users.forEach(player => {
      addPointToCache(currentRoundId, player.id, max + 1, 3)
    })
    //TODO: get max track index and add new track
  }
  const addPointToCache = (roundId, userId, trackIndex, points) => {
    console.log('add point with roundId userId, trackindex, points', roundId, userId, trackIndex, points)
    const originalState = client.readQuery({
      query: ALL_POINTS,
      variables: {
        roundId: roundId
      }
    })
    console.log('original state', originalState.allPoints)
    const temp = originalState.allPoints.filter(point =>
      point.user.id === userId && point.trackIndex === trackIndex)
    console.log('found data from cache', temp.length > 0 ? temp : false)
    if (temp.length > 0) {
      const data = temp[0]
      console.log('new state', originalState.allPoints
        .filter(point => point.id !== data.id)
        .concat({
          ...data,
          points
        }))
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
      console.log('add new point', newPoint)
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
    console.log('original state', originalState.allPoints)
    const maxTrackIndex = originalState.allPoints
      .map(point => point.trackIndex)
      .sort((i1, i2) => i2 - i1)[0]
    console.log('maxTrackindex', maxTrackIndex)
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
    console.log('upload points from cache to server', allPoints)
    try {
      await setUploadingPointsState(true)
      let response = await addCachedPointsMutation({
        variables: {
          roundId: currentRoundId,
          pointIds: allPoints.map(point => point.id.toString()),
          userIds: allPoints.map(point => point.user.id.toString()),
          trackIndexes: allPoints.map(point => point.trackIndex),
          points: allPoints.map(point => point.points)
        }
      })
      setUploadingPointsState(false)
      console.log('response', response)
      console.log('server and local state match', savedState)
    } catch (error) {
      handleError(error)
    }
  }

  const deleteLastTrack = async () => {
    console.log('delete last track')
    deleteLastTrackFromCache(currentRoundId)
  }
  const updatePoint = async (points, userId) => {
    console.log('add point with points and userId', points, 'trackIndex', trackIndex, userId, currentRoundId)
    addPointToCache(currentRoundId, userId, trackIndex, points)
  }

  const changeTrack = (index) => {
    setTrackIndex(index)
  }
  const setNewRound = (round) => {
    console.log('round', round)
    setCurrentRound(round)
    setCurrentRoundId(round.id)
    setTrackIndex(-1)
  }
  const allLocationsQuery = useQuery(ALL_LOCATIONS, {
    onError: handleError,
    skip: !token
  })
  const allUsersQuery = useQuery(ALL_USERS, {
    onError: handleError,
    skip: !token
  })
  const allPointsQuery = useQuery(ALL_POINTS, {
    skip: !currentRoundId || !token,
    variables: {
      roundId: currentRoundId
    },
    onError: handleError
  })

  const allRoundsQuery = useQuery(ALL_ROUNDS, {
    onError: handleError,
    skip: !token
  })
  const meQuery = useQuery(ME, {
    onError: handleError,
    skip: !token
  })

  const selectLocation = (location) => {
    console.log('location to be set', location)
    if (location === currentLocation) {
      setCurrentLocation(null)
    } else {
      setCurrentLocation(location)
    }
  }
  const selectUser = (user) => {
    if (currentPlayers.includes(user)) {
      console.log('user deselected', user)
      setCurrentPlayers(currentPlayers.filter(player => player !== user))
    } else {
      console.log('user selected', user)
      setCurrentPlayers(currentPlayers.concat(user))
    }
  }
  const deleteRound = async (round) => {
    console.log('delte round with id', round.id)
    const response = await deleteRoundMutation(
      {
        variables: {
          roundId: round.id
        }
      }
    )
    console.log('response', response)
  }
  const startNewRound = async () => {
    console.log('start new round', currentLocation.id, currentPlayers.map(user => user.id))
    const response = await addRoundMutation(
      {
        variables: {
          userIds: currentPlayers.map(user => user.id),
          locationId: currentLocation.id
        }
      }
    )
    console.log('response', response)
    setCurrentRound(response.data.addRound)
    setCurrentRoundId(response.data.addRound.id)
  }
  const finishRound = () => {
    console.log('finish round')
    setCurrentRound(null)
    setCurrentRoundId(null)
    setCurrentPlayers([])
    setCurrentLocation(null)
    setPage('main')
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 20, paddingVertical: 20, alignSelf: "center" }}>Frisbeegolf app</Text>
      {token && <Navigation show={true}
        doLogout={doLogout}
        setPage={setPage}
        meQuery={meQuery}
        currentRoundId={currentRoundId} />
      }
      {errorMessage && <View><Text>errorMessage</Text></View>
      }
      {!token &&
        <LoginForm
          doLogin={doLogin}
          show={true} />
      }
      {token && !currentRoundId && <AddRound
        allLocationsQuery={allLocationsQuery}
        allUsersQuery={allUsersQuery}
        handleLocationClick={selectLocation}
        handleUserClick={selectUser}
        currentLocation={currentLocation}
        currentPlayers={currentPlayers}
        startNewRound={startNewRound}
        show={page === 'round'}
      />}
      {token && <Rounds
        result={allRoundsQuery}
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
      < View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', padding: 10 }} >
        <Text>
          Frisbeegolf app, Fullstack course 2019 assignment, Juho Taipale
        </Text>
      </View >
    </View >
  )

}

export default HomeScreen;
