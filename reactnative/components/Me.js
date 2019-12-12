import React from 'react'

const Me = (props) => {
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
  const me = props.result.data.me
  if (!me) {
    return null
  }
  return (
    <div>
      <table>
        <tbody>
          <tr key='header'>
            <th>Me</th>
          </tr>
          <tr key='me'>
            <td onClick={props.onUserClicked ?
              props.onUserClicked(me) :
              () => { console.log('I was clicked') }}>
              {me.username}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Me