import React, { useState } from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  if (!props.show) {
    return null
  }
  const login = async () => {
    props.doLogin(username, password)
  }
  const onPasswordChange = (text) => {
    setPassword(text)
  }
  const onUsernameChange = (text) => {
    setUsername(text)
  }

  return (
    <View>
      <View>
        <Text>Login to application</Text>
        <Text>Username</Text>
        <TextInput
          onChangeText={text => onUsernameChange(text)}
          value={username}
        />
      </View>
      <View>
        <Text>Password</Text>
        <TextInput
          onChangeText={text => onPasswordChange(text)}
          value={password}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity onPress={login}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  )
}

export default LoginForm