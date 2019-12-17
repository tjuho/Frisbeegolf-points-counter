import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Navigation = (props) => {
  if (!props.show) {
    return null
  }

  if (props.meQuery.loading) {
    return <View><Text>loading...</Text></View>
  }
  if (props.meQuery.error) {
    console.log('error', props.meQuery.error)
    return <View><Text>error...</Text></View>
  }

  const setPage = (page) => {
    props.setPage(page)
  }
  const doLogout = () => {
    props.setPage(null)
    props.doLogout()
  }
  const user = props.meQuery.data.me
  console.log('user', user)
  const currentRoundId = props.currentRoundId
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <TouchableOpacity onPress={() => { setPage('main') }}><Text>main</Text></TouchableOpacity>
      </View>
      <View style={styles.item}>
        {currentRoundId ?
          <TouchableOpacity onPress={() => { setPage('round') }}><Text>continue round</Text></TouchableOpacity>
          :
          <TouchableOpacity onPress={() => { setPage('round') }}><Text>new round</Text></TouchableOpacity>
        }
      </View>
      <View style={styles.item}>

        <View><Text>{user.username} {user.admin ? '(admin)' : ''} logged in</Text></View>
      </View>
      <View style={styles.item}>
        <TouchableOpacity onPress={() => { doLogout() }}><Text>logout</Text></TouchableOpacity>
      </View>

    </View>
  )
}
const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row', alignItems: 'center'
  },
})

export default Navigation

