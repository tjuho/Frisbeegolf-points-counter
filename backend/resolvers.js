const { PubSub, AuthenticationError, UserInputError } = require('apollo-server')
const Location = require('./models/Location')
const Play = require('./models/Play')
const Point = require('./models/Point')
const Round = require('./models/Round')
const User = require('./models/User')
const jwt = require('jsonwebtoken')
const config = require('./utils/config')
const JWT_SECRET = config.jwtSecret
const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')
const bcrypt = require('bcrypt')
const pubsub = new PubSub()

const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value) // ast value is always in string format
      }
      return null;
    },
  }),
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
      return locations
    },
    allRounds: async (root, args) => {
      let rounds = await Round
        .find({})
        .populate('users')
        .populate('location')
      if (args.location) {
        rounds = rounds.filter(round => round.location.name = args.location)
      }
      console.log('all rounds', rounds)
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
        plays = plays.filter(play => play.user.username === args.username)
      }
      return plays
    },
    allPoints: async (root, args, context) => {
      let points
      if (args.playId) {
        points = await Point
          .find({ play: args.playId })
          .populate('user')
          .populate('play')
      } else if (context.currentUser) {
        points = await Point
          .find({ user: context.currentUser._id })
          .populate('user')
          .populate('play')
        console.log('points', points, 'current user', context.currentUser._id)
      } else {
        points = await Point
          .find({})
          .populate('user')
          .populate('play')
      }
      return points
    },
    allFriends: async (root, args, context) => {
      let user
      if (args.username) {
        console.log('find friends of', args.username)
        user = await User
          .findOne({ username: args.username })
          .populate('friends')
        console.log('user friends', user)
      } else if (context.currentUser) {
        user = await User
          .findById(context.currentUser._id)
          .populate('friends')
      } else if (args.userId) {
        user = await User
          .findById(args.userId)
          .populate('friends')
      }
      return user.friends
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Mutation: {
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user) {
        throw new UserInputError('Username not found');
      }

      const valid = await bcrypt.compare(args.password, user.passwordHash);
      if (!valid) {
        throw new UserInputError('Wrong password');
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
    addUser: async (root, args) => {
      console.log('create user', args)
      if (args.password.length < 3) {
        throw new UserInputError('password should be longer than 3 letters')
      }
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(args.password, saltRounds)
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
      console.log('make friends with', args.username)
      if (!currentUser) {
        throw new AuthenticationError('Invalid authentication token')
      }
      let friend = await User
        .findOne({ username: args.username })
      if (!friend) {
        throw new UserInputError('friend not found', {
          invalidArgs: args.username
        })
      }
      console.log('friend', friend)
      console.log('index of friend', currentUser.friends.indexOf(friend._id))
      if (currentUser.friends.indexOf(friend._id) > -1) {
        throw new UserInputError('you are already friends', {
          invalidArgs: args.username
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
      return friend
    },
    addLocation: async (root, args) => {
      const location = new Location({
        name: args.name
      })
      try {
        await location.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return location
    },
    addRound: async (root, args) => {
      const round = new Round({
        location: args.locationId,
        users: args.userIds,
        date: new Date()
      })
      try {
        await round.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return await Round.findById(round.id).populate('location').populate('users')
    },
    addPlay: async (root, args) => {
      let play = await Play
        .findOne({
          playNumber: args.playNumber,
          round: args.roundId,
        })
      if (!play) {
        play = new Play({
          playNumber: args.playNumber,
          round: args.roundId,
        })
        try {
          await play.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        }
      }
      return play
    },
    addPoint: async (root, args) => {
      let point = await Point
        .findOneAndUpdate({
          play: args.playId,
          user: args.userId,
        },
          {
            points: args.points
          })
      if (!point) {
        point = new Point({
          play: args.playId,
          user: args.userId,
          points: args.points
        })
        try {
          await point.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        }
      }
      return point
    }
  },
  Subscription: {
    playAdded: {
      subscribe: () => pubsub.asyncIterator(['PLAY_ADDED'])
    }
  }
}
module.exports = resolvers