import React from 'react'

const Friends = (props) => {
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
  const friends = props.result.data.me.friends
  if (!friends) {
    return null
  }

  return (
    <div>
      <table>
        <h2>Friends</h2>
        <tbody>
          {friends.map(friend =>
            <tr key={friend.id}>
              <td>
                {friend.username}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Friends