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
  console.log('Users', users)
  const handleUserClick = (user) =>
    () => {
      console.log('user clicked', user)
      props.handleUserClick(user)
    }
  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {users.map(user => {
          { console.log('user item', user) }
          return (
            <View key={user.id}>
              <TouchableOpacity onClick={props.handleUserClick ?
                handleUserClick(user) :
                () => { console.log('user id clicked', user.id) }}>
                <Text>{user.username}</Text>
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}
export default Users