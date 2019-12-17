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
  const ClickableRoundCell = ({ round }) => (
    <View style={styles.selectedPlayCell}>
      <TouchableOpacity onPress={handleRoundClick(round)}>
        <Text>{round.location.name}</Text>
      </TouchableOpacity>
    </View>
  )
  const TextCell = ({ text }) => (
    <View style={styles.item}>
      <Text>{text}</Text>
    </View>
  )
  const ArrayTextCell = ({ array }) => (
    <View style={styles.container}>
      {array.map(text => <Text style={styles.item} key={text}>{text}</Text>)}
    </View>
  )
  const HeaderTextCell = ({ text }) => (
    <View style={styles.header}>
      <Text>{text}</Text>
    </View>
  )
  const ButtonHeaderCell = ({ }) => (
    <View style={styles.buttonHeader}>
    </View>
  )
  const DelButton = ({ round }) => (
    <View style={styles.button}>
      <TouchableOpacity onPress={handleDeleteRoundClick(round)}>
        <Text>Y</Text>
      </TouchableOpacity>
    </View>
  )

  const createComponentTable = () => {
    let table = []
    let row = []
    row.push(<HeaderTextCell text='Location' />)
    row.push(<HeaderTextCell text='Date' />)
    row.push(<HeaderTextCell text='Players' />)
    row.push(<HeaderTextCell text='Delete?' />)
    table.push(row)
    rounds.forEach(round => {
      row = []
      row.push(<ClickableRoundCell round={round} />)
      const d = new Date(round.date)
      const dateString = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
      row.push(<TextCell text={dateString} />)
      row.push(<ArrayTextCell array={round.users.map(user => user.username)} />)
      row.push(<DelButton round={round} />)
      table.push(row)
    })
    // next we transpose the table from array of rows to array of columns
    let ttable = []
    for (let r = 0; r < table[0].length; r++) {
      let col = []
      table.forEach(row => {
        col.push(row[r])
      })
      ttable.push(col)
    }
    return ttable
  }
  return (
    <View style={{ flexDirection: 'row' }}>
      {createComponentTable().map((col, i) => (
        <View key={i}>
          {col.map((item, j) => (
            <View key={j} style={styles.cell}>
              {item}
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}
const styles = StyleSheet.create({
  cell: { padding: 3, alignItems: 'center', },
  item: { paddingHorizontal: 5, alignItems: 'center' },
  container: { flex: 1, alignSelf: 'stretch', flexDirection: 'row' },
  header: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  buttonHeader: { flex: 1, alignItems: 'flex-end' },
  button: { alignItems: 'flex-end' }
})
export default Rounds