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
        <tbody>
          <tr key='header'>
            <th>Friends</th>
          </tr>
          {friends.map(friend =>
            <tr key={friend.id}>
              <td onClick={props.onFriendClicked ?
                props.onFriendClicked(friend) :
                () => { console.log('friend id clicked', friend.id) }}>
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