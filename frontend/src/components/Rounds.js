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
  const rounds = props.result.data.allRounds
  if (!rounds) {
    return null
  }
  return (
    <div>
      <table>
        <tbody>
          <tr key='header'>
            <th>Rounds</th>
          </tr>
          {rounds.map(round =>
            <tr key={round.id}>
              <td onClick={props.onRoundClicked ? props.onRoundClicked(round.id) : () => { console.log('round id clicked', round.id) }}>
                {round.location.name} {round.date}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Rounds