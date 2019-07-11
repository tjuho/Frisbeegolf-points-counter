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

