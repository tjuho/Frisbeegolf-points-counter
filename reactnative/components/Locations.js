import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
const Locations = (props) => {

  if (props.allLocationsQuery.loading) {
    return <View><Text>loading...</Text></View>
  }
  if (props.allLocationsQuery.error) {
    console.log('error', props.allLocationsQuery.error)
    return <View><Text>error...</Text></View>
  }
  const locations = props.allLocationsQuery.data.allLocations
  console.log('locations 1', locations)
  const handleLocationClick = (location) =>
    () => {
      props.handleLocationClick(location)
    }
  return (
    <View>
      <ScrollView>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Locations</Text>
          {locations.map(location => {
            return (
              <View key={location.id}>
                <TouchableOpacity onClick={props.handleLocationClick ?
                  () => props.handleLocationClick(location) :
                  () => { console.log('location id clicked', location.id) }}>
                  <Text>{location.name}</Text>
                </TouchableOpacity>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}
export default Locations