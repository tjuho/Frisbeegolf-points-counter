import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import gql from "graphql-tag";
import Round from './components/Round'
import './App.css';
const ADD_POINT = gql`
  mutation addPoint($roundId: ID!, $trackIndex:Int!, $userId: ID!, $points: Int!){
    addPoint(
      roundId: $roundId,
      userId: $userId,
      trackIndex: $trackIndex,
      points: $points
    ){
      trackIndex,
      user{id, username},
      round{id},
      points,
      id
    }
  }
`
const ADD_NEW_TRACK = gql`
  mutation addNewTrack($roundId: ID!){
    addNewTrack(
      roundId: $roundId
    ){
      trackIndex,
      user{id, username},
      round{id},
      points,
      id
    }
  }
`
const DELETE_LAST_TRACK = gql`
  mutation deleteLastTrack($roundId: ID!){
    deleteLastTrack(
      roundId: $roundId
    )
  }
`
const ALL_POINTS = gql`

  query ($roundId: ID!) {
    allPoints(
      roundId: $roundId
    ){
    trackIndex,
    user{id, username},
    round{id},
    points,
    id
    }
  }
`
const ALL_USERS = gql`
query {
  allUsers{
    username,
    id
  }
}
`


function Appql() {
  const [roundId, setRoundId] = useState("5d4d5ce0638b3f73e19104fe")
  //  const [currentPlayers, setCurrentPlayers] = useState(["5d18f79935fc7623c728bed7", "5d19bb0b462f0454243492d9"])
  const [currentPlayers, setCurrentPlayers] = useState([])
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
  const allUsersQuery = useQuery(ALL_USERS, {
    skip: currentPlayers && currentPlayers.length > 0
  })
  if (!allUsersQuery.loading && !allUsersQuery.error && allUsersQuery.data) {
    setCurrentPlayers(allUsersQuery.data.allUsers)
  }
  const allPointsQuery = useQuery(ALL_POINTS, {
    skip: false,
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

  return (
    <div>
      {errorMessage && <div>errorMessage</div>}
      <Round
        result={useQuery(ALL_POINTS, {
          variables: {
            roundId: roundId
          }
        }
        )}
        addNewTrack={addNewTrack}
        updatePoint={updatePoint}
        deleteLastTrack={deleteLastTrack}
        changeTrack={changeTrack}
        players={currentPlayers}
        trackIndex={trackIndex}
      />
    </div>
  )

}

export default Appql;
