import React, { useState } from 'react'

const AddLocation = (props) => {
  const [location, setLocation] = useState('')

  if (!props.show) {
    return null
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      await props.addLocation({
        variables: { name: location }
      })
    } catch (error) {
      props.handleError(error)
    }
    setLocation('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          location name
          <input
            value={location}
            onChange={({ target }) => setLocation(target.value)}
          />
        </div>
        <button type='submit'>add new location</button>
      </form>
    </div>
  )
}

export default AddLocation