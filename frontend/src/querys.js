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
    location{name}
    date
    id
  }
}
`
export const ALL_TEES = gql`
{
  allTees($roundId: ID!, userIds: [ID!]!) {
    points
    playNumber
    id
  }
}
`
export const ALL_PLAYS = gql`
{
  allPlays($roundId: ID!, userId: ID!) {
    playNumber
    round
    id
  }
}
`
export const ALL_POINTS = gql`
{
  allPoints($roundId: ID!, $userId: ID!, $trackNumber: Int!) {
    points
    locations{name}
    date
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
export const ADD_POINTS = gql`
  mutation createPoint($playId: ID!, $userId: ID!, $points: Int!){
    addPoint(
      playId: $playId,
      userId: $userId,
      points: $points
    ){
      id
    }
  }
`

