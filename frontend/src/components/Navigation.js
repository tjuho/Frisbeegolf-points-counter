import React from 'react';

const Navigation = (props) => {
  if (!props.show) {
    return null
  }

  if (props.meQuery.loading) {
    return <div>loading...</div>
  }
  if (props.meQuery.error) {
    console.log('error', props.meQuery.error)
    return <div>error...</div>
  }

  const setPage = (page) => {
    props.setPage(page)
  }
  const doLogout = () => {
    props.doLogout()
  }
  const user = props.meQuery.data.me
  const currentRoundId = props.currentRoundId
  return (
    <div className="ui secondary menu">
      <div className="item" onClick={() => { setPage('main'); console.log('main') }}>main</div>
      {currentRoundId ?
        <div className="item" onClick={() => { setPage('round'); console.log('continue round') }}>continue round</div>
        : <div className="item" onClick={() => { setPage('round'); console.log('new round') }}>new round</div>
      }
      <div className="item">{user.username} {user.admin ? '(admin) ' : ''}logged in</div>
      <div className="item" onClick={() => { setPage(null); doLogout() }}>logout</div>

    </div>
  )
}

export default Navigation

