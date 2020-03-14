import React, { useState } from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '../utils/styles'
const AddLocation = (props) => {
  const [location, setLocation] = useState('')

  if (!props.show) {
    return null
  }
  const addLocation = async () => {
    if (location.length < 2) {
      return
    }
    props.addNewLocation(location)
    setLocation('')
  }

  return (
    <View>
      <View style={{ paddingVertical: 20 }}>
        <Text style={styles.cellText}>New location</Text>
        <TextInput
          onChangeText={text => setLocation(text)}
          value={location}
        />
      </View>
      <View style={{ alignSelf: 'center' }}>
        <TouchableOpacity style={styles.button} onPress={addLocation}>
          <Text style={styles.buttonText}>Add new location</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AddLocation