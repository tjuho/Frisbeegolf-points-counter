import React from 'react';

const maxValue = (arr) => {
  let temp = -1
  arr.forEach(element => {
    if (temp < element) {
      temp = element
    }
  });
  return temp
}

const Round = (props) => {
  console.log('round', props.round)
  if (!props.round) {
    console.log('no round chosen')
    return null
  }
  if (props.allPointsQuery.loading) {
    console.log('loading')
    return <div>loading...</div>
  }
  if (props.allPointsQuery.error) {
    console.log('error', props.allPointsQuery.error)
    return <div>error...</div>
  }
  console.log('all points', props.allPointsQuery.data.allPoints)
  console.log('players ', props.round.users)
  const players = props.round.users
  const trackIndex = props.trackIndex
  const allPoints = props.allPointsQuery.data.allPoints
  const round = props.round
  let order = players.slice()
  const maxTrackIndex = maxValue(allPoints.map(play => play.trackIndex))
  if (trackIndex === -1) {
    props.changeTrack(maxTrackIndex)
    return null
  }
  const handleDeleteLastTrackClick = () => {
    props.deleteLastTrack()
  }
  const handleRoundFinishClick = () => {
    props.finishRound()
  }
  const handleTrackIndexChangeClick = (index) =>
    () => {
      props.changeTrack(index)
    }
  const handlePointChangeClick = (points, user) =>
    () => {
      if (points > -1) {
        props.updatePoint(points, user.id)
      }
    }
  order.sort((u1, u2) => {
    for (let i = trackIndex; i >= 0; i--) {
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
  console.log('order', order)
  const orderOf = (player) => {
    for (let i = 0; i < order.length; i++) {
      if (player === order[i]) {
        return i + 1 + '.'
      }
    }
    return 'err'
  }

  if (maxTrackIndex + 1 === trackIndex) {
    props.addNewTrack()
  }
  const trackNumbers = []
  for (let i = 0; i < maxTrackIndex + 1; i++) {
    trackNumbers.push(<th key={i}>{i + 1}</th>)
  }
  return (
    <div className="App">
      <div>
        <h3>{round.location.name}</h3>
        <h3>
          <button text='-' onClick={handleTrackIndexChangeClick(trackIndex - 1)}>-</button>
          Track {trackIndex + 1}
          <button text='+' onClick={handleTrackIndexChangeClick(trackIndex + 1)}>+</button>
        </h3>
        <table>
          <tbody>
            <tr>
              <th>order</th><th>player</th>
              {
                trackNumbers
              }

            </tr>
            {players.map(player => {
              const playerPlays = allPoints.filter(point => point.user.id === player.id)
              if (playerPlays) {
                playerPlays.sort((p1, p2) => p1.trackIndex - p2.trackIndex)
                const total = playerPlays.length === 0 ?
                  0 : playerPlays.map(play => play.points).reduce((tot, point) => tot + point)
                return (
                  < tr key={player.id} >
                    <td key='order'>{orderOf(player)}</td>
                    <td key={player.username}>{player.username}</td>
                    {
                      playerPlays.map(play => {
                        if (play.trackIndex === trackIndex) {
                          return (<td key={play.trackIndex + player.id}>
                            <button onClick={handlePointChangeClick(play.points - 1, play.user)}>-</button>
                            {play.points}
                            <button onClick={handlePointChangeClick(play.points + 1, play.user)}>+</button>
                          </td>)
                        } else {
                          return (<td key={play.trackIndex + player.id}>{play.points}</td>)
                        }
                      })
                    }
                    <td>tot:{total}</td>
                  </tr>
                )
              } else return (
                <tr><td>no plays</td></tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div>
        <button text='delete last track' onClick={handleDeleteLastTrackClick}>delete last track</button>
      </div>
      <div>
        <button text='finish round' onClick={handleRoundFinishClick}>finnish round</button>
      </div>
      {false && <div>round is finnished</div>}
    </div>
  )
}

export default Round