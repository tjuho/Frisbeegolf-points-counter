import React from 'react'
import Locations from './Locations'
import Users from './Users'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
const AddRound = (props) => {

  if (!props.show) {
    return null
  }

  const startNewRound = () => {
    props.startNewRound()
  }

  if (props.allLocationsQuery.loading || props.allUsersQuery.loading) {
    console.log('loading')
    return <View><Text>loading...</Text></View>
  }
  if (props.allLocationsQuery.error || props.allUsersQuery.error) {
    console.log('errors', props.allUsersQuery.error, props.allLocationsQuery.error)
    return <View><Text>error...</Text></View>
  }

  const allLocations = props.allLocationsQuery.data.allLocations
  const allUsers = props.allUsersQuery.data.allUsers
  const currentLocation = props.currentLocation
  const currentPlayers = props.currentPlayers

  const tempAllUsers = {
    allUsers: allUsers.filter(user => currentPlayers.indexOf(user) === -1)
  }
  const tempData = {
    data: tempAllUsers
  }
  const selectableUsersQuery = {
    ...props.allUsersQuery,
    data: tempAllUsers
  }
  const selectedUsers = {
    allUsers: currentPlayers
  }
  const selectedUsersQuery = {
    ...props.allUsersQuery,
    data: selectedUsers
  }
  console.log('all users query', props.allUsersQuery)
  console.log('selectable users', selectableUsersQuery.data.allUsers)
  console.log('selected users', selectedUsersQuery.data.allUsers)
  console.log('selected users query', selectedUsersQuery)

  if (!currentLocation) {
    return (
      <View>
        <Text>Select location</Text>
        <Locations
          allLocationsQuery={props.allLocationsQuery}
          handleLocationClick={props.handleLocationClick} />
      </View >
    )
  } else {
    return (
      <View>
        <Text>{currentLocation.name}</Text>
        {
          currentPlayers.length > 0 && currentLocation &&
          <View>
            <TouchableOpacity onPress={startNewRound}><Text>START</Text></TouchableOpacity>
          </View>
        }
        <View>
          <Text>Selected players</Text>
          <Users
            allUsersQuery={selectedUsersQuery}
            handleUserClick={props.handleUserClick} />
        </View>
        <View>
          <Text>Select players</Text>
          <Users
            allUsersQuery={selectableUsersQuery}
            handleUserClick={props.handleUserClick} />
        </View >
      </View>
    )
  }
}

export default AddRound