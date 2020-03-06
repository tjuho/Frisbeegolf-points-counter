import React from 'react'
import '../styles.css'
const Rounds = (props) => {
  if (!props.show) {
    return null
  }
  if (props.allRoundsQuery.loading) {
    return <div>loading...</div>
  }
  if (props.allRoundsQuery.error) {
    console.log('error', props.allRoundsQuery.error)
    return <div>error...</div>
  }

  const handleRoundClick = (round) =>
    () => {
      props.setRound(round)
    }
  const deleteRound = (round) => {
    props.deleteRound(round)
  }
  const rounds = props.allRoundsQuery.data.allRounds
  rounds.sort((r1, r2) => r2.date - r1.date)
  if (!rounds) {
    return null
  }
  return (
    <div>
      <table className="ui celled table">
        <thead>
          <tr key='header'>
            <th>location</th><th>date</th><th>players</th><th>delete</th>
          </tr>
        </thead>
        <tbody>
          {rounds.map(round => {
            const d = new Date(round.date)
            const dateString = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
            let userFields = []
            for (let i = 0; i < round.users.length; i++) {
              const user = round.users[i]
              const total = round.totals ? round.totals[i] : null
              userFields.push(user.username.toString() + (total ? ':' + total.toString() : ''))
            }
            const userField = userFields.join('\n')
            return (
              <tr key={round.id}>
                <td className="pointer" onClick={handleRoundClick(round)}>{round.location.name}</td><td>{dateString}</td>
                <td><span>{userField}</span></td>
                <td>
                  <button className='ui button' onClick={() => { if (window.confirm('Are you sure you wish to delete this round?')) deleteRound(round) }} >X</button>
                </td>
              </tr>
            )
          }
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Rounds