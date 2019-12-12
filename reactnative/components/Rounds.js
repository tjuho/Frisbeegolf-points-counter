import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';

const Rounds = (props) => {
  if (!props.show) {
    return null
  }
  if (props.result.loading) {
    return <View><Text>loading...</Text></View>
  }
  if (props.result.error) {
    console.log('error', props.result.error)
    return <View><Text>error...</Text></View>
  }
  const handleRoundClick = (round) =>
    () => {
      console.log('round clicked', round)
      props.setRound(round)
    }
  const handleDeleteRoundClick = (round) =>
    () => {
      console.log('delete round clicked', round)
      props.deleteRound(round)
    }
  const rounds = props.result.data.allRounds
  rounds.sort((r1, r2) => r2.date - r1.date)
  if (!rounds) {
    return null
  }
  const renderRoundRow = (round) => {
    const d = new Date(round.date)
    const dateString = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    return (
      <View style={styles.container} key={round.id}>
        <View style={styles.item}>
          <TouchableOpacity onPress={handleRoundClick(round)}>
            <Text>{round.location.name}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.item} >
          <Text>{dateString}</Text>
        </View>
        <View style={styles.container} >
          {
            round.users.map(user => <View style={styles.item} key={user.username}><Text>{user.username}</Text></View>)
          }
        </View>
        <View style={{ alignItems: 'center' }}>
          <Button title='del' onPress={handleDeleteRoundClick(round)} />
        </View>
      </View>
    )
  }
  const renderHeader = () => {
    return (
      <View style={styles.container}>
        <View style={styles.item} ><Text>location</Text></View>
        <View style={styles.item} ><Text>date</Text></View>
        <View style={styles.item} ><Text>players</Text></View>
      </View>
    )
  }
  return (
    <View>
      <ScrollView>
        <View style={styles.header}>
          {renderHeader()}
          {rounds.map(round => {
            return renderRoundRow(round)
          })}
        </View>
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  item: { flex: 1, alignSelf: 'stretch', alignItems: 'center' },
  container: { flex: 1, alignSelf: 'stretch', flexDirection: 'row' },
  header: { flex: 1, alignItems: 'center', justifyContent: 'center' }
})
export default Rounds