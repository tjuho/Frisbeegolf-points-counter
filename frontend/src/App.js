import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import { Container, Menu, Router } from 'semantic-ui-react'
import Round from './components/Round'
import AddRound from './components/AddRound'
import Rounds from './components/Rounds'
import LoginForm from './components/LoginForm'
import Friends from './components/Friends'
import Me from './components/Me'
import crypto from 'crypto'
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
  ADD_POINTS,
  ADD_NEW_TRACK,
  DELETE_LAST_TRACK,
  ADD_CACHED_POINTS,
} from './querys'


function App() {
  const [tempState, setTempState] = useState(null)
  const [localPointStorage, setLocalPointStorage] = useState([])
  const [currentRoundId, setCurrentRoundId] = useState(null)
  const [currentRound, setCurrentRound] = useState(null)
  //  const [currentUsers, setCurrentPlayers] = useState(["5d18f79935fc7623c728bed7", "5d19bb0b462f0454243492d9"])
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
    //setToken(localStorage.getItem('token'))
    const username = localStorage.getItem('username')
    const token = localStorage.getItem('token')
    console.log('restore logged user', username, token)
    setToken(token)
    setUsername(username)
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
    const token = response.data.login.token
    const tusername = response.data.login.username
    console.log('login token and username', token, tusername)
    if (token) {
      //localStorage.setItem('token', token)
      setToken(token)
      setUsername(username)
      localStorage.setItem('username', tusername)
      localStorage.setItem('token', token)
      setPage('main')
      client.resetStore()
    }
  }

  const doLogout = () => {
    console.log('logout')
    setToken(null)
    setUsername(null)
    localStorage.clear()
    client.resetStore()
  }

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
  /*
  if (!allUsersQuery.loading && !allUsersQuery.error && allUsersQuery.data) {
    setCurrentPlayers(allUsersQuery.data.allUsers)
  }
  */

  const addPointsMutation = useMutation(ADD_POINTS, {
    onError: handleError,
    update: (store, response) => {
      console.log('add points response', response)
      let dataInStore = store.readQuery({
        query: ALL_POINTS,
        variables: {
          roundId: currentRoundId
        },
      })
      console.log('data in store before points update', dataInStore.allPoints)
      const addedPoints = response.data.addPoints
      console.log('added point', addedPoints)
      const addedIds = addedPoints
        .filter(point => point.roundId === currentRoundId)
        .map(addedPoint => addedPoint.id)
      const temp = dataInStore.allPoints
        .filter(point => addedIds.indexOf(point.id) < 0)
        .concat(addedPoints)
      console.log('store after', temp)
      client.writeQuery({
        query: ALL_POINTS,
        variables: {
          roundId: currentRoundId
        },
        data: { allPoints: temp }
      })
    }
  })
  const addPointMutation = useMutation(ADD_POINT, {
    onError: handleError,
    update: (store, response) => {
      console.log('add point response', response)
      let dataInStore = store.readQuery({
        query: ALL_POINTS,
        variables: {
          roundId: currentRoundId
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
          roundId: currentRoundId
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
            roundId: currentRoundId
          },
        })
        console.log('points before deletion', dataInStore.allPoints)
        const temp = dataInStore.allPoints.filter(point => point.trackIndex !== deletedTrackIndex)
        console.log('filtered', temp)
        client.writeQuery({
          query: ALL_POINTS,
          variables: {
            roundId: currentRoundId
          },
          data: { allPoints: temp }
        })
        if (trackIndex > deletedTrackIndex - 1) {
          setTrackIndex(deletedTrackIndex - 1)
        }
        const dataInStoreAfter = store.readQuery({
          query: ALL_POINTS,
          variables: {
            roundId: currentRoundId
          },
        })
        console.log('data in store after deletion', dataInStoreAfter.allPoints, 'track index now', trackIndex)
      }
    }
  })

  const addCachedPointsMutation = useMutation(ADD_CACHED_POINTS, {
    onError: handleError,
    update: (store, response) => {
      const serverPoints = response.data.addCachedPoints
      /*
      client.writeQuery({
        query: ALL_POINTS,
        variables: {
          roundId: currentRoundId
        },
        data: { allPoints: points }
      })*/
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

  const addNewTrackMutation = useMutation(ADD_NEW_TRACK, {
    onError: handleError,
    update: (store, response) => {
      let dataInStore = store.readQuery({
        query: ALL_POINTS,
        variables: {
          roundId: currentRoundId
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
            roundId: currentRoundId
          },
          data: { allPoints: temp }
        })
        console.log('new track index', newTrackPoints[0].trackIndex)
        setTrackIndex(newTrackPoints[0].trackIndex)
        dataInStore = store.readQuery({
          query: ALL_POINTS,
          variables: {
            roundId: currentRoundId
          },
        })
        console.log('data in store after new track push', dataInStore)
      }
    }
  })
  const addRoundMutation = useMutation(ADD_ROUND, {
    onError: handleError,
    update: (store, response) => {
      console.log('add round response', response)
      let dataInStore = store.readQuery({
        query: ALL_ROUNDS
      })
      console.log('data in store before round update', dataInStore.allRounds)
      const addedRound = response.data.addRound
      console.log('added round', addedRound)
      const temp = dataInStore.allRounds.filter(round => round.id !== addedRound.id).concat(addedRound)
      console.log('store after', temp)
      client.writeQuery({
        query: ALL_ROUNDS,
        data: { allRounds: temp }
      })
    }
  })
  const loginMutation = useMutation(LOGIN, {
    onError: handleError
  })
  const addPointToCache = (roundId, userId, trackIndex, points) => {
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
    const mutatedState = client.readQuery({
      query: ALL_POINTS,
      variables: {
        roundId: roundId
      }
    })
    console.log('mutated state', mutatedState.allPoints)
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
    if (trackIndex >= maxTrackIndex) {
      setTrackIndex(maxTrackIndex - 1)
    }
    const mutatedState = client.readQuery({
      query: ALL_POINTS,
      variables: {
        roundId: roundId
      }
    })
    console.log('mutated state', mutatedState.allPoints)
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
      //await setSavedState(true)
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

  const addNewTrack = async () => {
    const currentUsers = currentRound.users
    console.log('add new track to round and trackindex', currentRound.id, trackIndex, 'for users', currentUsers)
    //try {
    for (let i = 0; i < currentUsers.length; i++) {
      addPointToCache(currentRoundId, currentUsers[i].id, trackIndex + 1, 3)
    }
    //uploadPoints()
    return
    let response = await addNewTrackMutation({
      variables: {
        roundId: currentRoundId
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
    deleteLastTrackFromCache(currentRoundId)
    /*
    try {
      const response = await deleteLastTrackMutation({
        variables: {
          roundId: currentRoundId
        }
      })
      console.log('response', response.data)
    } catch (error) {
      handleError(error)
    }*/
  }
  const updatePoint = async (points, userId) => {
    console.log('add point with points and userId', points, 'trackIndex', trackIndex, userId, currentRoundId)
    addPointToCache(currentRoundId, userId, trackIndex, points)
    /*
    try {
      const response = await addPointMutation({
        variables: {
          points: points,
          trackIndex: trackIndex,
          userId: userId,
          roundId: currentRoundId
        }
      })
      //console.log('response', response.data)
    } catch (error) {
      handleError(error)
    }*/
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
  const allLocationsQuery = useQuery(ALL_LOCATIONS)
  const allUsersQuery = useQuery(ALL_USERS, {
    skip: false
  })
  const allPointsQuery = useQuery(ALL_POINTS, {
    skip: !currentRoundId,
    variables: {
      roundId: currentRoundId
    },
  })

  const allRoundsQuery = useQuery(ALL_ROUNDS, {
    skip: false
  })
  const handleLocationClick = (location) =>
    () => {
      console.log('location clicked', location)
      if (location === currentLocation) {
        setCurrentLocation(null)
      } else {
        setCurrentLocation(location)
      }
    }
  const handleUserClick = (user) =>
    () => {
      console.log('user clicked', user)
      if (currentPlayers.includes(user)) {
        setCurrentPlayers(currentPlayers.filter(player => player !== user))
      } else {
        setCurrentPlayers(currentPlayers.concat(user))
      }
    }
  const startNewRound = async () => {
    console.log('start new round', currentLocation.name, currentPlayers.map(user => user.username))
    const response = await addRoundMutation(
      {
        variables: {
          userIds: currentPlayers.map(user => user.id),
          locationId: currentLocation.id
        }
      }
    )
    console.log('response', response)
    setCurrentLocation(null)
    setCurrentPlayers([])
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
    <Container>
      {token &&
        <div className="ui secondary menu">
          <div className="item" onClick={() => { setPage('main'); console.log('main') }}>main</div>
          {currentRoundId ?
            <div className="item" onClick={() => { setPage('round'); console.log('continue round') }}>continue round</div>
            : <div className="item" onClick={() => { setPage('round'); console.log('new round') }}>new round</div>
          }
          <div className="item">{username} logged in</div>
          <div className="item" onClick={() => { setPage(null); doLogout() }}>logout</div>

        </div>
      }
      {errorMessage && <div>errorMessage</div>}
      {
        !token &&
        <LoginForm
          doLogin={doLogin}
          show={true}
          handleError={handleError} />
      }
      {token && !currentRoundId && <AddRound
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
        result={allRoundsQuery}
        setRound={setNewRound}
        show={page === 'main'}
      />}
      {token && currentRoundId && <Round
        allPointsQuery={allPointsQuery}
        round={currentRound}
        addNewTrack={addNewTrack}
        updatePoint={updatePoint}
        deleteLastTrack={deleteLastTrack}
        changeTrack={changeTrack}
        trackIndex={trackIndex}
        finishRound={finishRound}
        uploadPoints={uploadPointsFromCacheToServer}
        show={page === 'round'}
        savedState={savedState && currentRoundId}
        uploadingPoints={uploadingPointsState && currentRoundId}
      />}
      <div>
        <br />
        <em>Frisbeegolf app, Juho Taipale 2019</em>
      </div>
    </Container>
  )

}

export default App;
