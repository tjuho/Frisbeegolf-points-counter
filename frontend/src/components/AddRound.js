import React from 'react'

const AddRound = (props) => {
  if (!props.show) {
    return null
  }
  const allLocations = props.allLocationsQuery.data.allLocations
  const allUsers = props.allUsersQuery.data.allUsers
  const currentLocation = props.currentLocation
  const currentPlayers = props.currentPlayers

  const startNewRound = (event) => {
    console.log('start new round with', currentLocation, currentPlayers)
    event.preventDefault()
    props.startNewRound()
  }

  if (props.allLocationsQuery.loading || props.allUsersQuery.loading) {
    console.log('loading')
    return <div>loading...</div>
  }
  if (props.allLocationsQuery.error || props.allUsersQuery.error) {
    console.log('errors', props.allUsersQuery.error, props.allLocationsQuery.error)
    return <div>error...</div>
  }
  if (!currentLocation) {
    // select location
    return (
      <div>
        <h3>Select location</h3>
        <div>
          <table className="ui celled table">
            <thead>
              <tr key='header'>
                <th>locations</th>
              </tr>
            </thead>
            <tbody>
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
        <table className="ui celled table">
          <thead>
            <tr key='header'>
              <th>selected players</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {currentPlayers.map(user =>
                <td key={user.id} onClick={props.handleUserClick(user)}>{user.username}</td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
      {
        currentPlayers.length > 0 && currentLocation &&
        <div>
          <form onSubmit={startNewRound}>
            <button className="ui button" type='submit'>start</button>
          </form>
        </div>
      }
      <div>
        <table className="ui celled table">
          <thead>
            <tr>
              <th>all players</th>
            </tr>
          </thead>
          <tbody>
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