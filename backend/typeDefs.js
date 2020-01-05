const { gql } = require('apollo-server');

const typeDefs = gql`
    scalar Date
    type User {
      username: String!
      friends: [User!]!
      id: ID!
      admin: Boolean
    }
    type Token {
      token: String!
      username: String!
    }
    type Location {
      name: String!
      id: ID!
    }
    type Round {
      location: Location!
      users: [User!]!      
      date: Date!
      id: ID!
    }
    type Play {
      round: Round!
      playNumber: Int!
      id: ID!
    }
    type Point {
      round: Round!
      user: User!
      trackIndex: Int!
      points: Int!
      id: ID!
    }
    type Query {      
      allUsers: [User!]!
      allLocations: [Location!]!
      allRounds: [Round!]!
      allPoints(roundId: ID, userId: ID, trackIndex: Int): [Point!]!
      allFriends(username: String): [User]      
      me: User
    }
    type Mutation {
      login(
        username: String!
        password: String!
      ): Token
      addUser(
        username: String!
        password: String!
        admin: Boolean
      ): User
      addFriend(
        username: String!
      ): User
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
        roundId: ID!
        userId: ID!
        trackIndex: Int!
        points: Int!
      ): Point
      addPoints(
        roundIds: [ID!]!
        userIds: [ID!]!
        trackIndexes: [Int!]!
        points: [Int!]!
      ): [Point]
      addCachedPoints(
        roundId: ID!
        pointIds: [ID!]!
        userIds: [ID!]!
        trackIndexes: [Int!]!
        points: [Int!]!      
      ): [Point]
      addNewTrack(
        roundId: ID!
      ): [Point]
      deleteLastTrack(
        roundId: ID!
      ): Int
      deleteUser(
        username: String!
        ): User
      deleteAllRounds: [Round]
      deleteRound(
        roundId: ID!
      ): Round
      deleteLocation(
        locationId: ID!
      ): Location
    }
    type Subscription {
      playAdded: Play
    }
    `
module.exports = typeDefs