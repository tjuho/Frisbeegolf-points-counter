import React from 'react'

const AddRound = (props) => {
  if (!props.show) {
    return null
  }
  const startNewRound = (event) => {
    console.log('start new round with', currentLocation, currentUsers)
    event.preventDefault()
    props.startNewRound()
  }
  const finishRoundClicked = () =>
    () => {
      props.finishRound()
    }
  if (props.allLocationsQuery.loading || props.allUsersQuery.loading) {
    console.log('loading')
    return <div>loading...</div>
  }
  if (props.allLocationsQuery.error || props.allUsersQuery.error) {
    console.log('error', props.result.error)
    return <div>error...</div>
  }
  const allLocations = props.allLocationsQuery.data.allLocations
  const allUsers = props.allUsersQuery.data.allUsers
  const currentLocation = props.currentLocation
  const currentUsers = props.currentUsers
  if (!currentLocation) {
    // select location
    return (
      <div>
        <h3>Select location</h3>
        <div>
          <table>
            <tbody>
              <tr key='header'>
                <th>locations</th>
              </tr>
              {allLocations.map(location =>
                <tr key={location.id}>
                  <td onClick={props.handleLocationClick(location)}>{location.name}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  return (
    <div>
      <h3>New round</h3>
      <div onClick={props.handleLocationClick(currentLocation)}>
        {currentLocation.name}
      </div>
      <div>
        <table>
          <tbody>
            <tr key='header'>
              <th>selected players</th>
            </tr>
            {currentUsers.map(user =>
              <tr key={user.id}>
                <td onClick={props.handleUserClick(user)}>{user.username}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {
        currentUsers.length > 0 && currentLocation &&
        <div>
          <form onSubmit={startNewRound}>
            <button type='submit'>start</button>
          </form>
        </div>
      }
      <div>
        <table>
          <tbody>
            <tr key='header'>
              <th>all players</th>
            </tr>
            {allUsers.map(user =>
              <tr key={user.id}>
                <td onClick={props.handleUserClick(user)}>{user.username}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default AddRound