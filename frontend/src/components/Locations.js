import React from 'react'

const Locations = (props) => {
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
  const locations = props.result.data.allLocations
  return (
    <div>
      <table>
        <tbody>
          <tr key='header'>
            <th>Locations</th>
          </tr>
          {locations.map(location =>
            <tr key={location.id}  >
              <td onClick={props.onLocationClicked ?
                props.onLocationClicked(location) :
                () => { console.log('location id clicked', location.id) }}>
                {location.name}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
export default Locations