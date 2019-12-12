import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Button,
  View,
  TouchableOpacity,
} from 'react-native';

const maxValue = (arr, def = -1) => {
  let temp = def
  arr.forEach(element => {
    if (temp < element) {
      temp = element
    }
  });
  return temp
}

const styles = StyleSheet.create({
  cell: { padding: 4, alignItems: 'center' },
  textCell: { flex: 1 },
  HeaderTextCell: { flex: 1 },
  playCell: { flex: 1 },
  selectedPlayCell: {
    flex: 1, flexDirection: 'row',
  },
})


const Round = (props) => {
  if (!props.show) {
    return null
  }
  //console.log('round', props.round)
  if (!props.round) {
    console.log('no round chosen')
    return null
  }
  if (props.allPointsQuery.loading) {
    console.log('loading')
    return <View><Text>loading...</Text></View>
  }
  if (props.allPointsQuery.error) {
    console.log('error', props.allPointsQuery.error)
    return <View><Text>error...</Text></View>
  }
  //console.log('saved state and uploading points state', props.savedState, props.uploadingPoints)
  const savedState = props.savedState
  const uploadingPoints = props.uploadingPoints
  const buttonDisabled = savedState || uploadingPoints
  const players = props.round.users
  const selectedTrackIndex = props.trackIndex
  const allPoints = props.allPointsQuery.data.allPoints
  const round = props.round
  let order = players.slice()
  console.log('all points', allPoints)
  console.log('players ', props.round.users)

  const maxTrackIndex = maxValue(allPoints.map(play => play.trackIndex), -1)
  if (selectedTrackIndex === -1 && maxTrackIndex > -1) {
    props.changeTrack(maxTrackIndex)
    return null
  }
  if (allPoints.length === 0) {
    console.log('new round', props.round)
    props.addNewTrack()
    props.changeTrack(0)
  }
  const handleDeleteLastTrackClick = () => {
    props.deleteLastTrack()
  }
  const handleRoundFinishClick = () => {
    props.finishRound()
  }
  const handleUploadPointsClick = () => {
    props.uploadPoints()
  }
  const handleTrackIndexChangeClick = (index) =>
    () => {
      console.log('new index', index, 'max index', maxTrackIndex)
      if (maxTrackIndex + 1 === index) {
        console.log('add new track')
        props.addNewTrack()
      }
      props.changeTrack(index)
    }
  const handlePointChangeClick = (points, user) =>
    () => {
      if (points > -1) {
        props.updatePoint(points, user.id)
      }
    }
  order.sort((u1, u2) => {
    for (let i = selectedTrackIndex; i >= 0; i--) {
      const temp = allPoints.filter(point => point.trackIndex === i)
      const u1pointArray = temp.filter(point => point.user.id === u1.id)
      const u2pointArray = temp.filter(point => point.user.id === u2.id)
      if (u1pointArray.length === 0 || u2pointArray.length === 0) {
        return 0
      }
      const u1p = u1pointArray[0].points
      const u2p = u2pointArray[0].points
      if (u1p > u2p) {
        return 1
      } else if (u1p < u2p) {
        return -1
      }
    }
    return 0
  })
  //console.log('order', order)
  const orderOf = (player) => {
    for (let i = 0; i < order.length; i++) {
      if (player === order[i]) {
        return i + 1 + '.'
      }
    }
    return 'err'
  }


  const trackNumbers = []
  console.log('max track index', maxTrackIndex, 'track index', selectedTrackIndex)
  for (let i = 0; i < maxTrackIndex + 1; i++) {
    trackNumbers.push(i + 1)
  }
  console.log('track numbers th', trackNumbers, 'all points', allPoints)

  const TrackIndex = () => (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity style={{ paddingHorizontal: 5, borderWidth: 1 }} onPress={handleTrackIndexChangeClick(selectedTrackIndex - 1)}>
        <Text>-</Text>
      </TouchableOpacity>
      <Text style={{ paddingHorizontal: 2 }}>Track {selectedTrackIndex + 1}</Text>
      <TouchableOpacity style={{ paddingHorizontal: 5, borderWidth: 1 }} onPress={handleTrackIndexChangeClick(selectedTrackIndex + 1)}>
        <Text>+</Text>
      </TouchableOpacity>
    </View>
  )

  const SelectedPlayCell = ({ play }) => (
    //<View style={styles.selectedPlayCell}>
    <View style={styles.selectedPlayCell}>
      <TouchableOpacity style={{ borderWidth: 1, paddingHorizontal: 5 }} onPress={handlePointChangeClick(play.points - 1, play.user)}>
        <Text>-</Text>
      </TouchableOpacity>
      <Text style={{ paddingHorizontal: 2 }} >{play.points}</Text>
      <TouchableOpacity style={{ borderWidth: 1, paddingHorizontal: 5 }} onPress={handlePointChangeClick(play.points + 1, play.user)}>
        <Text>+</Text>
      </TouchableOpacity>
    </View>
  )
  const PlayCell = ({ play }) => (
    <View style={styles.playCell}>
      <Text>{play.points}</Text>
    </View>
  )
  const TextCell = ({ text }) => (
    <View style={styles.textCell}>
      <Text>{text}</Text>
    </View>
  )
  const HeaderTextCell = ({ text }) => (
    <View style={styles.textCell}>
      <Text>{text}</Text>
    </View>
  )

  const createComponentTable = () => {
    let table = []
    let row = []
    row.push(<HeaderTextCell text='order' />)
    row.push(<HeaderTextCell text='player' />)
    row = row.concat(trackNumbers.map(trackNumber => <HeaderTextCell text={trackNumber} />))
    row.push(<HeaderTextCell text='total' />)
    table.push(row)
    players.forEach(player => {
      row = []
      row.push(<TextCell text={orderOf(player)} />)
      row.push(<TextCell text={player.username} />)
      const playerPlays = allPoints.filter(point => point.user.id === player.id)
      playerPlays.sort((p1, p2) => p1.trackIndex - p2.trackIndex)
      playerPlays.forEach(play => {
        if (play.trackIndex === selectedTrackIndex) {
          row.push(<SelectedPlayCell play={play} />)
        } else {
          row.push(<PlayCell play={play} />)
        }
      })
      const totalPoints = playerPlays.length === 0 ?
        0 : playerPlays.map(play => play.points).reduce((tot, point) => tot + point)
      row.push(<TextCell text={totalPoints} />)
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
  const componentTable = createComponentTable()

  return (
    <View>
      <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ flex: 1 }}>{round.location.name}</Text>
        <TrackIndex style={{ flex: 1 }} />
        {savedState && <Text style={{ flex: 1 }}>saved state</Text>}
        {!savedState && <Text style={{ flex: 1 }}>unsaved state</Text>}
      </View>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        {componentTable.map((col, i) => (
          <View key={i}>
            {col.map((item, j) => (
              <View key={j} style={styles.cell}>
                {item}
              </View>
            ))}
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <TouchableOpacity style={{ padding: 10 }} title='delete last track' onPress={handleDeleteLastTrackClick}>
          <Text>delete last track</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 10 }} title='finish round' onPress={handleRoundFinishClick}>
          <Text>finish round</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 10 }} title='upload points' disabled={buttonDisabled} onPress={handleUploadPointsClick}>
          <Text>upload points</Text>
        </TouchableOpacity>
      </View>
    </View >
  )
}

export default Round