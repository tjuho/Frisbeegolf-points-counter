import React from 'react';

const Navigation = (props) => {
  if (!props.show) {
    return null
  }
  const setPage = (page) => {
    props.setPage(page)
  }
  const doLogout = () => {
    props.doLogout()
  }
  const username = props.username
  const currentRoundId = props.currentRoundId
  return (
    <div className="ui secondary menu">
      <div className="item" onClick={() => { setPage('main'); console.log('main') }}>main</div>
      {currentRoundId ?
        <div className="item" onClick={() => { setPage('round'); console.log('continue round') }}>continue round</div>
        : <div className="item" onClick={() => { setPage('round'); console.log('new round') }}>new round</div>
      }
      <div className="item">{username} logged in</div>
      <div className="item" onClick={() => { setPage(null); doLogout() }}>logout</div>

    </div>
  )
}

export default Navigation

