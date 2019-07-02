import React, { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import gql from "graphql-tag";
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import { Subscription } from 'react-apollo'

const LOGIN = gql`
mutation login($username: String!, $password: String! ){
  login(username: $username, password: $password){
    value
  }
  
}
`

const App = () => {
  const client = useApolloClient()

  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [selectedGenre, setSelectedGenre] = useState(null)

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  const handleError = (error) => {
    if (error.graphQLErrors.length > 0) {
      setErrorMessage(error.graphQLErrors[0].message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 10000)
    }
    else if (error.networkError) {
      const errorArray = error.networkError.result.errors
      if (errorArray && errorArray.length > 0) {
        setErrorMessage(errorArray[0].message)
        setTimeout(() => {
          setErrorMessage(null)
        }, 10000)
      }
    }
  }
  const doLogin = (token) => {
    console.log('login', token)
    setToken(token)
    localStorage.setItem('token', token)
    setPage('authors')
    client.resetStore()
  }
  const logout = () => {
    console.log('logout')
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const loginMutation = useMutation(LOGIN, {
    onError: handleError
  })

  return (
    <div>
      <div>
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={() => setPage('main')}>main page</button>}
        {token && <button onClick={() => setPage('locations')}>locations</button>}
        {token && <button onClick={() => { logout() }}>logout</button>}
      </div>
      {errorMessage &&
        <div style={{ color: 'red' }}>
          {errorMessage}
        </div>
      }
      {!token &&
        <LoginForm login={loginMutation} token={token}
          doLogin={doLogin}
          handleError={handleError}
          show={page === 'login'} />
      }
    </div>
  )
}

export default App;
