import React from 'react'

const AddRound = (props) => {
  if (!props.show) {
    return null
  }
  const startNewRound = (event) => {
    event.preventDefault()
    props.startNewRound()
  }
  return (
    <div>
      <h3>new round</h3>
      <div onClick={props.location ?
        props.onLocationClicked(props.location) :
        () => { console.log('no location selected') }}>
        {props.location ? props.location.name : null}
      </div>
      <div>
        <table>
          <tbody>
            <tr key='header'>
              <th>players</th>
            </tr>
            {props.users.map(user =>
              <tr key={user.id}>
                <td onClick={props.onUserClicked(user)}>{user.username}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {
        props.users.length > 0 && props.location &&
        <div>
          <form onSubmit={startNewRound}>
            <button type='submit'>start</button>
          </form>
        </div>
      }
    </div>
  )
}

export default AddRound