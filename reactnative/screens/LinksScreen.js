import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import {
  ALL_FRIENDS,
  ALL_LOCATIONS,
  ALL_ROUNDS,
  ALL_POINTS,
  ALL_USERS,
  LOGIN,
  ADD_LOCATION,
  ADD_ROUND,
  DELETE_ROUND,
  ADD_CACHED_POINTS,
} from '../querys'
import Locations from '../components/Locations'

export default function LinksScreen() {
  const allLocationsQuery = useQuery(ALL_LOCATIONS)

  return (
    <ScrollView style={styles.container}>
      {/**
       * Go ahead and delete ExpoLinksView and replace it with your content;
       * we just wanted to provide you with some helpful links.
       */}
      <Locations allLocationsQuery={allLocationsQuery} />
      <ExpoLinksView />
    </ScrollView>
  );
}

LinksScreen.navigationOptions = {
  title: 'Links',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
