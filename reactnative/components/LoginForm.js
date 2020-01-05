import React, { useState } from 'react'
import { styles } from '../utils/styles'
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

  return (
    <View>
      <View>
        <Text>Login to application</Text>
        <Text>Username</Text>
        <TextInput
          onChangeText={text => setUsername(text)}
          value={username}
        />
      </View>
      <View>
        <Text>Password</Text>
        <TextInput
          onChangeText={text => setPassword(text)}
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