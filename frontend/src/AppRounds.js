import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import gql from "graphql-tag";
import Round from './components/Round'
import AddRound from './components/AddRound'
import Rounds from './components/Rounds'
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


function Appql() {
  const [roundId, setRoundId] = useState(null)
  const [round, setRound] = useState(null)
  //  const [currentUsers, setCurrentPlayers] = useState(["5d18f79935fc7623c728bed7", "5d19bb0b462f0454243492d9"])
  const [currentUsers, setCurrentPlayers] = useState([])
  const [currentLocation, setCurrentLocation] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [trackIndex, setTrackIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const client = useApolloClient()

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
  const setNewRound = (round) => {
    setRound(round)
    setRoundId(round.id)
    setTrackIndex(-1)
    console.log('round set to', round, 'roundId set to', roundId)
  }
  const allLocationsQuery = useQuery(ALL_LOCATIONS)
  const allUsersQuery = useQuery(ALL_USERS, {
    skip: false
  })
  const allPointsQuery = useQuery(ALL_POINTS, {
    skip: !roundId,
    variables: {
      roundId
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
      if (currentUsers.includes(user)) {
        setCurrentPlayers(currentUsers.filter(player => player !== user))
      } else {
        setCurrentPlayers(currentUsers.concat(user))
      }
    }
  const startNewRound = async () => {
    console.log('start new round', currentLocation.name, currentUsers.map(user => user.username))
    const response = await addRoundMutation(
      {
        variables: {
          userIds: currentUsers.map(user => user.id),
          locationId: currentLocation.id
        }
      }
    )
    console.log('response', response)
    setCurrentLocation(null)
    setCurrentPlayers([])
    setRound(response.data.addRound)
    setRoundId(response.data.addRound.id)
  }
  return (
    <div>
      {errorMessage && <div>errorMessage</div>}
      <AddRound
        allLocationsQuery={allLocationsQuery}
        allUsersQuery={allUsersQuery}
        handleLocationClick={handleLocationClick}
        handleUserClick={handleUserClick}
        currentLocation={currentLocation}
        currentUsers={currentUsers}
        startNewRound={startNewRound}
        show={true}
      />
      <Rounds
        result={allRoundsQuery}
        setRound={setNewRound}
        show={true}
      />
      {roundId && <Round
        result={allPointsQuery}
        round={round}
        addNewTrack={addNewTrack}
        updatePoint={updatePoint}
        deleteLastTrack={deleteLastTrack}
        changeTrack={changeTrack}
        trackIndex={trackIndex}
      />}
    </div>
  )

}

export default Appql;
