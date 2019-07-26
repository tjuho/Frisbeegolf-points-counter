import React from 'react'

const Round = (props) => {
  const maxValue = (arr) => {
    let result = -1;
    arr.forEach(value => {
      if (value > result) {
        result = value
      }
    })
    return result
  }

  if (!props.show) {
    return null
  }
  if (props.result.loading) {
    return <div>loading...</div>
  }
  if (props.result.error) {
    console.log('error', props.result.error)
    return <div>error...</div>
  }
  const round = props.round
  const playArray = props.result.data.allTees
  const users = props.users
  const trackIndex = props.trackIndex
  let order = users.slice()

  const handleTrackChangeClick = (newIndex) =>
    () => {
      // console.log('set number', newIndex)
      if (newIndex >= 0 && newIndex < 99)
        setTrackIndex(newIndex)
    }

  const handlePointChangeClick = (points, playNumber, player) =>
    () => {
      updatePoints(points, playNumber, player)
    }
  const handleDeleteLastTrackClick = () => {
    const maxTrackIndex = maxValue(playArray.plays.map(play => play.playNumber))
    const newArray = {
      plays: playArray.plays.filter(play => play.playNumber !== maxTrackIndex)
    }
    console.log('max track', maxTrackIndex, 'new array', newArray)
    if (trackIndex === maxTrackIndex && trackIndex > 0) {
      setTrackIndex(trackIndex - 1)
    }
    setPlayArray(newArray)
    console.log('playArray', playArray)
  }
  const whoseTurn = () => {
    // console.log('trackIndex', trackIndex, 'points plays', playArray.plays)
    order.sort((u1, u2) => {
      for (let i = trackIndex; i >= 0; i--) {
        const temp = playArray.plays.filter(play => play.playNumber === i)
        // console.log('temp', temp)
        const u1playArray = temp.filter(play => play.user === u1)
        const u2playArray = temp.filter(play => play.user === u2)
        if (u1playArray.length === 0 || u2playArray.length === 0) {
          return 0
        }
        // console.log('u1playArray', u1playArray, 'u2playArray', u2playArray)
        const u1p = u1playArray[0].points
        const u2p = u2playArray[0].points
        if (u1p > u2p) {
          return 1
        } else if (u1p < u2p) {
          return -1
        }
      }
      return 0
    })
    // console.log('order', order)
  }
  const orderOf = (player) => {
    for (let i = 0; i < order.length; i++) {
      if (player === order[i]) {
        return i + 1 + '.'
      }
    }
    return 'err'
  }
  users.forEach(player => {
    const playerPlays = playArray.plays.filter(play => play.user === player).sort((p1, p2) => p1.playNumber - p2.playNumber)
    if (maxValue(playerPlays.map(play => play.playNumber)) + 1 === trackIndex) {
      updatePoints(3, trackIndex, player)
    }
  })
  whoseTurn()
  return (
    <div className="App">
      <div>
        <h3>
          <button text='-' onClick={handleTrackChangeClick(trackIndex - 1)}>-</button>
          Track {trackIndex + 1}
          <button text='+' onClick={handleTrackChangeClick(trackIndex + 1)}>+</button>
        </h3>
        <table>
          <tbody>
            <tr><th>order</th><th>player</th></tr>
            {users.map(player => {
              const playerPlays = playArray.plays.filter(play => play.user === player).sort((p1, p2) => p1.playNumber - p2.playNumber)
              const total = playerPlays.length === 0 ? 0 : playerPlays.map(play => play.points).reduce((tot, point) => tot + point)
              // console.log('player', player, playerPlays)
              return (
                <tr key={player}>
                  <td key='order'>{orderOf(player)}</td>
                  <td key={player}>{player}</td>
                  {playerPlays.map(play => {
                    if (play.playNumber === trackIndex) {
                      return (<td key={play.playNumber}>
                        <button onClick={handlePointChangeClick(play.points - 1, play.playNumber, play.user)}>-</button>
                        {play.points}
                        <button onClick={handlePointChangeClick(play.points + 1, play.playNumber, play.user)}>+</button>
                      </td>)
                    } else {
                      return (<td key={play.playNumber}>{play.points}</td>)
                    }
                  })}
                  <td>tot:{total}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div>
        <button text='delete last track' onClick={handleDeleteLastTrackClick}>delete last track</button>
      </div>
    </div>
  );
}

export default Round