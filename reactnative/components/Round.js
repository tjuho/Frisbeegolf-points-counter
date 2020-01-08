import React from 'react';
import { styles } from '../utils/styles'
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

const alignments = StyleSheet.create({
  cell: { padding: 3, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
  textCell: { flex: 1 },
  HeaderTextCell: { flex: 1 },
  playCell: { flex: 1 },
  selectedPlayCell: {
    flexDirection: 'row',
  },
})


const Round = (props) => {
  if (!props.show) {
    return null
  }
  if (!props.round) {
    console.log('no round chosen')
    return null
  }
  if (props.allPointsQuery.loading) {
    return <View><Text>loading...</Text></View>
  }
  if (props.allPointsQuery.error) {
    console.log('error', props.allPointsQuery.error)
    return <View><Text>error...</Text></View>
  }
  const savedState = props.savedState
  const uploadingPoints = props.uploadingPoints
  const buttonDisabled = savedState || uploadingPoints
  const players = props.round.users
  const selectedTrackIndex = props.trackIndex
  const allPoints = props.allPointsQuery.data.allPoints
  const round = props.round
  let order = players.slice()

  const maxTrackIndex = maxValue(allPoints.map(play => play.trackIndex), -1)
  if (selectedTrackIndex === -1 && maxTrackIndex > -1) {
    props.changeTrack(maxTrackIndex)
    return null
  }
  if (allPoints.length === 0) {
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
      if (maxTrackIndex + 1 === index) {
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
  const orderOf = (player) => {
    for (let i = 0; i < order.length; i++) {
      if (player === order[i]) {
        return i + 1 + '.'
      }
    }
    return 'err'
  }
  const trackNumbers = []
  for (let i = 0; i < maxTrackIndex + 1; i++) {
    trackNumbers.push(i + 1)
  }
  const TrackIndex = () => (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity style={styles.button} onPress={handleTrackIndexChangeClick(selectedTrackIndex - 1)}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.cellText}>Track {selectedTrackIndex + 1}</Text>
      <TouchableOpacity style={styles.button} onPress={handleTrackIndexChangeClick(selectedTrackIndex + 1)}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  )
  const SelectedPlayCell = ({ play }) => (
    //<View style={alignments.selectedPlayCell}>
    <View style={alignments.selectedPlayCell}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePointChangeClick(play.points - 1, play.user)}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text style={{ ...(styles.cellText), paddingHorizontal: 2 }} >{play.points}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePointChangeClick(play.points + 1, play.user)}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  )
  const PlayCell = ({ play }) => (
    <View>
      <Text style={{ ...(styles.cellText), fontSize: styles.cellText.fontSize - 1 }}>{play.points}</Text>
    </View>
  )
  const TextCell = ({ text }) => (
    <View>
      <Text style={styles.cellText}>{text}</Text>
    </View>
  )
  const HeaderTextCell = ({ text }) => (
    <View>
      <Text style={styles.cellText}>{text}</Text>
    </View>
  )
  const FlexTextCell = ({ text }) => (

    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={styles.cellText}>{text}</Text>
    </View>
  )
  const MyButton = ({ text, action, disabled }) => (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <TouchableOpacity style={disabled ? styles.disabledButton : styles.button} onPress={disabled ? () => null : action}>
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
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

  return (
    <View>
      <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
        <FlexTextCell text={round.location.name} />
        <TrackIndex style={{ flex: 1 }} />
        {savedState && <FlexTextCell text={'saved state'} />}
        {!savedState && <FlexTextCell text={'unsaved state'} />}
      </View>
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
      <View style={{ flexDirection: 'row' }}>
        <MyButton text='DELETE LAST TRACK' action={handleDeleteLastTrackClick} />
        <MyButton text='FINISH ROUND' action={handleRoundFinishClick} />
        <MyButton text='UPLOAD POINTS' action={handleUploadPointsClick} disabled={buttonDisabled} />
      </View>
    </View >
  )
}

export default Round