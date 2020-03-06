import React from 'react';
import '../styles.css'

const maxValue = (arr, def = -1) => {
  let temp = def
  arr.forEach(element => {
    if (temp < element) {
      temp = element
    }
  });
  return temp
}

const Round = (props) => {
  if (!props.show) {
    return null
  }
  if (!props.round) {
    console.log('no round chosen')
    return null
  }
  if (props.allPointsQuery.loading) {
    return <div>loading...</div>
  }
  if (props.allPointsQuery.error) {
    console.log('error', props.allPointsQuery.error)
    return <div>error...</div>
  }
  const savedState = props.savedState
  const uploadingPoints = props.uploadingPoints
  const buttonDisabled = savedState || uploadingPoints
  const players = props.round.users
  const trackIndex = props.trackIndex
  const allPoints = props.allPointsQuery.data.allPoints
  const round = props.round
  let order = players.slice()

  const maxTrackIndex = maxValue(allPoints.map(play => play.trackIndex), -1)
  if (trackIndex === -1 && maxTrackIndex > -1) {
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
    trackNumbers.push(<th key={i}>{i + 1}</th>)
  }
  return (
    <div className="App">
      <div>
        <h3>{round.location.name}</h3>
        <h3>
          <div className="row">
            <div className="ui centered grid">
              <button onClick={handleTrackIndexChangeClick(trackIndex - 1)}>{"<"}</button>
              Track {trackIndex + 1}
              <button onClick={handleTrackIndexChangeClick(trackIndex + 1)}>{">"}</button>
            </div>
          </div>
        </h3>
        <br />

        <table className="ui celled table">
          <thead>
            <tr>
              <th>order</th><th><div className="center">player</div></th>
              {
                trackNumbers
              }
              <th>total</th>
            </tr>
          </thead>
          <tbody>

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
                            <strong>
                              <button className="ui button" onClick={handlePointChangeClick(play.points - 1, play.user)}>-</button>
                              {play.points}
                              <button className="ui button" onClick={handlePointChangeClick(play.points + 1, play.user)}>+</button>
                            </strong>
                          </td>)
                        } else {
                          return (<td key={play.trackIndex + player.id}>{play.points}</td>)
                        }
                      })
                    }
                    <td>{total}</td>
                  </tr>
                )
              } else return (
                <tr><td>no plays</td></tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <br />
      <div className="ui centered grid">
        {savedState && <div>saved state</div>}
        {!savedState && <div className="error"><strong>unsaved state</strong></div>}
      </div>
      <br />
      <div className="row">
        <button className="ui button" text='delete last track' onClick={handleDeleteLastTrackClick}>delete last track</button>
        <button className="ui button" text='finish round' onClick={handleRoundFinishClick}>finnish round</button>
        {!buttonDisabled && <button className="ui button" disabled={buttonDisabled} onClick={handleUploadPointsClick}>upload points</button>}
      </div>
    </div>
  )
}

export default Round