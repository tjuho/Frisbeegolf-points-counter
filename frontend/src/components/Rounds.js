import React from 'react'

const Rounds = (props) => {
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
  const handleRoundClick = (round) =>
    () => {
      console.log('round clicked', round)
      props.setRound(round)
    }
  const rounds = props.result.data.allRounds
  rounds.sort((r1, r2) => r2.date - r1.date)
  console.log('all rounds', rounds)
  if (!rounds) {
    return null
  }
  return (
    <div>
      <table>
        <tbody>
          <tr key='header'>
            <th>location</th><th>date</th><th colSpan="99">players</th>
          </tr>
          {rounds.map(round => {
            const d = new Date(round.date)
            const dateString = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear()
            return (
              <tr onClick={handleRoundClick(round)} key={round.id}>
                <td>{round.location.name}</td><td>{dateString}</td>
                {round.users.map(user =>
                  <td key={user.username}>{user.username}</td>
                )}
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