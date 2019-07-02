const { gql } = require('apollo-server');

const typeDefs = gql`
    scalar Date
    type User {
      username: String!
      friends: [User!]!
      id: ID!
    }
    type Token {
      value: String!
    }
    type Location {
      name: String!
      id: ID!
    }
    type Round {
      date: Date!
      location: Location!
      users: [User!]!      
      id: ID!
    }
    type Play {
      round: Round!
      playNumber: Int!
      id: ID!
    }
    type Point {
      play: Play!
      user: User!
      points: Int!
      id: ID!
    }
    type Query {
      allUsers: [User!]!
      allLocations: [Location!]!
      allRounds(location: String): [Round!]!
      allPlays(roundId: ID, playNumber: Int, username: String): [Play!]!
      allPoints(playId: ID): [Point]
      allFriends(username: String): [User]
      me: User
      login(username: String!, password: String!): Token
    }
    type Mutation {
      addUser(
        username: String!
        password: String!
      ): User
      addFriend(
        username: String!
      ): User
      login(
        username: String!
        password: String!
      ): Token
      addLocation(
        name: String!
      ): Location
      addRound(
        locationId: ID!
        userIds: [ID!]!
      ): Round
      addPlay(
        roundId: ID!
        playNumber: Int!
      ): Play
      addPoint(
        playId: ID!
        userId: ID!
        points: Int!
      ): Point
    }
    type Subscription {
      playAdded: Play
    }
    `
module.exports = typeDefs