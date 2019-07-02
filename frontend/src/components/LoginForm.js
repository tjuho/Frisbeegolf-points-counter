import React, { useState } from 'react'

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  if (!props.show) {
    return null
  }
  const login = async (event) => {
    event.preventDefault()
    try {
      const response = await props.login({
        variables: { username, password }
      })
      const token = response.data.login.value
      if (token) {
        props.doLogin(token)
      }
    } catch (error) {
      props.handleError(error)
    }
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
      <form onSubmit={login}>
        username:
          <input id='username'
          value={username}
          onChange={onUsernameChange} />
        password:
          <input id='password'
          value={password}
          onChange={onPasswordChange} />
        <button type="submit">
          login
        </button>
      </form>
    </div>
  )
}

export default LoginForm