import gql from "graphql-tag";
export const LOGIN = gql`
mutation login($username: String!, $password: String! ){
  login(username: $username, password: $password){
    value
  }
  
}
`
export const ALL_FRIENDS = gql`
{
  me {
    username
    id
    friends{username, id}
  }
}
`
export const ALL_LOCATIONS = gql`
{
  allLocations {
    name
    id
  }
}  
`
export const ALL_ROUNDS = gql`
{
  allRounds {
    users{username}
    location{name}
    date
    id
  }
}
`
export const ALL_POINTS = gql`
  query ($roundId: ID!) {
    allPoints(
      roundId: $roundId
    ){
    trackIndex,
    user{id, username},
    round{id},
    points,
    id
    }
  }
`
export const ALL_USERS = gql`
query {
  allUsers{
    username,
    id
  }
}
`
export const ME = gql`
{
  me{
    username
    id
  }
}
`
export const ADD_LOCATION = gql`
  mutation createLocation($name: String!){
    addLocation(
      name: $name
    ){
      id, name
    }
  }
`
export const ADD_ROUND = gql`
  mutation createRound($locationId: ID!, $userIds: [ID!]!){
    addRound(
      locationId: $locationId
      userIds: $userIds
    ){
      date
      id
    }
  }
`
export const ADD_PLAY = gql`
  mutation createPlay($roundId: ID!, $playNumber:Int!){
    addPlay(
      roundId: $roundId,
      playNumber: $playNumber
    ){
      id
    }
  }
`
export const ADD_POINT = gql`
  mutation addPoint($roundId: ID!, $trackIndex:Int!, $userId: ID!, $points: Int!){
    addPoint(
      roundId: $roundId,
      userId: $userId,
      trackIndex: $trackIndex,
      points: $points
    ){
      trackIndex,
      user{id, username},
      round{id},
      points,
      id
    }
  }
`

export const ADD_NEW_TRACK = gql`
mutation addNewTrack($roundId: ID!){
  addNewTrack(
    roundId: $roundId
  ){
    trackIndex,
    user{id, username},
    round{id},
    points,
    id
  }
}
`

export const DELETE_LAST_TRACK = gql`
mutation deleteLastTrack($roundId: ID!){
  deleteLastTrack(
    roundId: $roundId
  )
}
`