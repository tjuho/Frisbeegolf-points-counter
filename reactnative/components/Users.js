import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Users = (props) => {
  if (props.allUsersQuery.loading) {
    return <Text>loading...</Text>
  }
  if (props.allUsersQuery.error) {
    console.log('error', props.allUsersQuery.error)
    return <Text>error...</Text>
  }
  const users = props.allUsersQuery.data.allUsers
  const handleUserClick = (user) =>
    () => {
      props.handleUserClick(user)
    }
  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {users.map(user =>
          (
            <View key={user.id}>
              <TouchableOpacity onClick={props.handleUserClick ?
                handleUserClick(user) :
                () => { console.log('user id clicked', user.id) }}>
                <Text>{user.username}</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </View>
    </ScrollView>
  )
}
export default Users