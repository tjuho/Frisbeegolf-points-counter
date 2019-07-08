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
        <h2>Rounds</h2>
        <tbody>
          {rounds.map(round =>
            <tr key={round.id}>
              <td>
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