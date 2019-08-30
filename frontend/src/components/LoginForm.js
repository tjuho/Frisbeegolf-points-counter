import React, { useState } from 'react'

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  if (!props.show) {
    return null
  }
  const login = async (event) => {
    event.preventDefault()
    props.doLogin(username, password)
  }
  const onPasswordChange = (event) => {
    setPassword(event.target.value)
  }
  const onUsernameChange = (event) => {
    setUsername(event.target.value)
  }
  return (
    <div className='login'>
      <h2>Login to application</h2>
      <form onSubmit={login} className="ui form">
        <div className="field">
          <label>Username</label>
          <input id='username'
            type="text"
            placeholder="username"
            value={username}
            onChange={onUsernameChange} />
        </div>
        <div className="field">
          <label>Password</label>
          <input id='password'
            type="password"
            placeholder="password"
            value={password}
            onChange={onPasswordChange} />
        </div>
        <button className="ui button" type="submit">
          login
        </button>
      </form>
    </div>
  )
}

export default LoginForm