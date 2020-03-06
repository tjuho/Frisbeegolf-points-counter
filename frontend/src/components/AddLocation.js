import React, { useState } from 'react'

const AddLocation = (props) => {
  const [location, setLocation] = useState('')

  if (!props.show) {
    return null
  }
  const handleClick = () => {
    props.addNewLocation(location)
    setLocation('')
  }

  return (
    <div>
      <div>
        <input
          value={location}
          onChange={({ target }) => setLocation(target.value)}
        />
      </div>
      <button className="ui button" onClick={handleClick}>add new location</button>
    </div>
  )
}

export default AddLocation