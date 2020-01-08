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
    <View style={{ alignSelf: 'center' }}>
      <View style={{ paddingBottom: 20 }}>
        <Text style={styles.cellText}>Login to application</Text>
      </View>
      <View style={{ paddingBottom: 20 }}>
        <Text style={styles.cellText}>Username</Text>
        <TextInput
          onChangeText={text => setUsername(text)}
          value={username}
        />
      </View>
      <View style={{ paddingBottom: 20 }}>
        <Text style={styles.cellText}>Password</Text>
        <TextInput
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry={true}
        />
      </View>
      <View style={{ alignSelf: 'center' }}>
        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default LoginForm