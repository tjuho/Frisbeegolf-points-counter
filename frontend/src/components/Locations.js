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
  console.log('all locations', locations)
  locations.forEach(location => {
    console.log('location', location.name, location.id)
  })
  return (
    <div>
      <h2>Locations</h2>
      <table>
        <tbody>
          {locations.map(location =>
            <tr key={location.id}  >
              <td>
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