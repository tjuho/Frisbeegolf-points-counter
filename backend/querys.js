const gql = require('graphql-tag')
const LOGIN = gql`
mutation login($username: String!, $password: String! ){
  login(username: $username, password: $password){
    token
    username
  }
  
}
`
const ALL_FRIENDS = gql`
{
  me {
    username
    id
    friends{username, id}
  }
}
`
const ALL_LOCATIONS = gql`
{
  allLocations {
    name
    id
  }
}  
`
const ALL_ROUNDS = gql`
{
  allRounds {
    users{username, id}
    location{name, id}
    date
    id
  }
}
`
const ALL_POINTS = gql`
  query allPoints($roundId: ID) {
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
const ALL_USERS = gql`
query {
  allUsers{
    username,
    id
  }
}
`
const ME = gql`
query{
  me{
    admin
    username
    id
  }
}
`
const ADD_LOCATION = gql`
  mutation createLocation($name: String!){
    addLocation(
      name: $name
    ){
      id, name
    }
  }
`
const ADD_USER = gql`
  mutation createUser($username: String!, $password: String!, $admin: Boolean){
    addUser(
      username: $username
      password: $password
      admin: $admin
    ){
      id, username, admin
    }
  }
`
const ADD_ROUND = gql`
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
const ADD_POINT = gql`
  mutation createPoint($roundId: ID!, $userId: ID!, $trackIndex:Int!, $points:Int!){
    addPoint(
      roundId: $roundId,
      userId: $userId,
      trackIndex: $trackIndex,
      points: $points
    ){
      round{id}, user{id}, trackIndex, points
    }
  }
`
const DELETE_LOCATION = gql`
  mutation removeLocation($locationId: ID!){
    deleteLocation(
      locationId: $locationId
    ){
      id
    }
  }
`
const DELETE_ROUND = gql`
  mutation removeRound($roundId: ID!){
    deleteRound(
      roundId: $roundId
    ){
      id
    }
  }
`

const ADD_CACHED_POINTS = gql`
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
module.exports = {
  ALL_LOCATIONS,
  ALL_USERS,
  ALL_ROUNDS,
  ALL_POINTS,
  ADD_LOCATION,
  ADD_ROUND,
  ADD_USER,
  ADD_POINT,
  DELETE_LOCATION,
  DELETE_ROUND,
  LOGIN,
  ME,

}