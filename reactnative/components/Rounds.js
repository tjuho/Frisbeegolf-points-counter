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
import { styles } from '../utils/styles'

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
  /*
  const renderRoundRow = (round) => {
    const d = new Date(round.date)
    const dateString = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    return (
      <View style={alignments.container} key={round.id}>
        <View style={alignments.item}>
          <TouchableOpacity onPress={handleRoundClick(round)}>
            <Text>{round.location.name}</Text>
          </TouchableOpacity>
        </View>
        <View style={alignments.item} >
          <Text>{dateString}</Text>
        </View>
        <View style={alignments.container} >
          {
            round.users.map(user => <View style={alignments.item} key={user.username}><Text>{user.username}</Text></View>)
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
      <View style={alignments.container}>
        <View style={alignments.item} ><Text>location</Text></View>
        <View style={alignments.item} ><Text>date</Text></View>
        <View style={alignments.item} ><Text>players</Text></View>
      </View>
    )
  }
  */
  const ClickableRoundCell = ({ round }) => (
    <View style={alignments.selectedPlayCell, styles.button}>
      <TouchableOpacity onPress={handleRoundClick(round)}>
        <Text style={styles.buttonText}>{round.location.name}</Text>
      </TouchableOpacity>
    </View>
  )
  const TextCell = ({ text }) => (
    <View style={alignments.item}>
      <Text style={styles.cellText}>{text}</Text>
    </View>
  )
  const ArrayTextCell = ({ array }) => (
    <View style={alignments.container}>
      {array.map(text => <Text style={{ ...(styles.cellText), paddingHorizontal: 3 }} key={text}>{text}</Text>)}
    </View>
  )
  const HeaderTextCell = ({ text }) => (
    <View style={alignments.header}>
      <Text style={styles.cellText}>{text}</Text>
    </View>
  )
  const DelButton = ({ round }) => (
    <View style={alignments.button, styles.button}>
      <TouchableOpacity onPress={handleDeleteRoundClick(round)}>
        <Text style={styles.buttonText}>Y</Text>
      </TouchableOpacity>
    </View>
  )

  const createComponentTable = () => {
    let table = []
    let row = []
    row.push(<HeaderTextCell text='LOCATION' />)
    row.push(<HeaderTextCell text='DATE' />)
    row.push(<HeaderTextCell text='PLAYERS' />)
    row.push(<HeaderTextCell text='DEL?' />)
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
            <View key={j} style={alignments.cell}>
              {item}
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}
const alignments = StyleSheet.create({
  cell: { padding: 3, alignItems: 'center', },
  item: { paddingHorizontal: 5, alignItems: 'center' },
  container: { flex: 1, alignSelf: 'stretch', flexDirection: 'row' },
  header: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  buttonHeader: { flex: 1, alignItems: 'flex-end' },
  button: { alignItems: 'flex-end' }
})
export default Rounds