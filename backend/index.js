const { ApolloServer, gql, AuthenticationError, UserInputError } = require('apollo-server')
const uuid = require('uuid/v1')
const Location = require('./models/Location')
const Play = require('./models/Play')
const Round = require('./models/Round')
const User = require('./models/User')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'
const { PubSub } = require('apollo-server')
const config = require('./utils/config')

const pubsub = new PubSub()
mongoose.set('useFindAndModify', false)

mongoose.connect(config.mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
    type User {
      username: String!
      friends: [String!]
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
      location: [Location!]!      
      id: ID!
    }
    type Play {
      round: Round!
      user: User!
      points: Int!
      id: ID!
    }
    type Query {
      allUsers: [User!]!
      allLocations: [Location!]!
      allRounds(location: String): [Round!]!
      allPlays(roundId: ID, playNumber: Int, username: String): [Play!]!
      allFriends(username: String!): [User!]!
      me: User
    }
    type Mutation {
      addUser(
        username: String!
        password: String!
      ): User
      addFriend(
        username: String!
        friend: String!
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
      )
      addPlay(
        roundId: ID!
        userId: ID!
        roundNumber: Int!
        points: Int!
      )
    }
    type Subscription {
      playAdded: Play
    }
    `
const Resolvers = {
  Query: {
    allUsers: async () => {
      const users = await User
        .find({})
        .populate('friends')
      return users
    },
    allLocations: async () => {
      const locations = await Location
        .find({})
    },
    allRounds: async (root, args) => {
      let rounds = await Round
        .find({})
        .populate('location')
      if (args.location) {
        rounds = rounds.filter(round => round.location.name = args.location)
      }
      return rounds
    },
    allPlays: async (root, args) => {
      let plays = await Play
        .find({})
        .populate('round')
        .populate('user')
      if (args.roundId) {
        plays = plays.filter(play => play.round.id === args.roundId)
      }
      if (args.playNumber) {
        plays = plays.filter(play => play.number === args.playNumber)
      }
      if (args.username) {
        plays = plays.filter(play => play.user.username = args.username)
      }
      return plays
    },
    allFriends: async (root, args) => {
      let users = await User
        .find({ username: args.username })
        .populate('friends')
      let friends = []
      users.forEach(user => {
        user.friends.forEach(friend => {
          friends.push(friend.username)
        })
      })
      return friends
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Mutation: {
    addUser: async (root, args) => {
      console.log('create user', args)
      if (body.password.length < 3) {
        throw new UserInputError('password should be longer than 3 letters')
      }
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(body.password, saltRounds)
      const user = new User({
        username: args.username,
        passwordHash
      })
      try {
        await user.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return user
    },
    addFriend: async (root, args, { currentUser }) => {
      console.log('add friend', args)
      if (!currentUser) {
        throw new AuthenticationError('Invalid authentication token')
      }
      let friend = await User
        .findOne({ username: args.friend })
      if (!friend) {
        throw new UserInputError('friend not found', {
          invalidArgs: args
        })
      }
      currentUser.friends = currentUser.friends.concat(friend)
      friend.friends = friend.friends.concat(currentUser)
      try {
        await currentUser.save()
        await friend.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return currentUser
    },
    addPlay: async (root, args) => {
      const
    }
  },
  Subscription: {
    playAdded: {
      subscribe: () => pubsub.asyncIterator(['PLAY_ADDED'])
    }
  }
}
