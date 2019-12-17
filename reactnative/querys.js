import gql from "graphql-tag";
export const LOGIN = gql`
mutation login($username: String!, $password: String! ){
  login(username: $username, password: $password){
    token
    username
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
    users{username, id}
    location{name, id}
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
    user{id},
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
query{
  me{
    admin
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
      location{
        name
        id
      }
      users{
        username
        id
      }
      date
      id
    }
  }
`
export const DELETE_ROUND = gql`
  mutation removeRound($roundId: ID!){
    deleteRound(
      roundId: $roundId
    ){
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

export const ADD_CACHED_POINTS = gql`
  mutation addCachedPoints($roundId: ID!, $pointIds: [ID!]!, $userIds: [ID!]!, $trackIndexes:[Int!]!, $points: [Int!]!){
    addCachedPoints(
      roundId: $roundId,
      pointIds: $pointIds,
      userIds: $userIds,
      trackIndexes: $trackIndexes,
      points: $points
    ){
      trackIndex,
      user{id},
      round{id},
      points,
      id
    }
  }
`
