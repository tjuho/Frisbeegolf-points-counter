import React from 'react';
import { styles } from '../utils/styles'
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
  const currentRoundId = props.currentRoundId
  return (
    <View style={alignments.container}>
      <View style={alignments.item}>
        <TouchableOpacity style={styles.button} onPress={() => { setPage('main') }}><Text style={styles.buttonText}>MAIN</Text></TouchableOpacity>
      </View>
      <View style={alignments.item}>
        {currentRoundId ?
          <TouchableOpacity style={styles.button} onPress={() => { setPage('round') }}><Text style={styles.buttonText}>CONTINUE ROUND</Text></TouchableOpacity>
          :
          <TouchableOpacity style={styles.button} onPress={() => { setPage('round') }}><Text style={styles.buttonText}>NEW ROUND</Text></TouchableOpacity>
        }
      </View>
      <View style={alignments.item}>

        <View><Text style={styles.cellText}>{user.username} {user.admin ? '(admin) ' : ''}logged in</Text></View>
      </View>
      <View style={alignments.item}>
        <TouchableOpacity style={styles.button} onPress={() => { doLogout() }}><Text style={styles.buttonText}>LOGOUT</Text></TouchableOpacity>
      </View>

    </View>
  )
}
const alignments = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row', alignItems: 'center'
  },
})

export default Navigation

