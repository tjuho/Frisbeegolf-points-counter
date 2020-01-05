const { PubSub, AuthenticationError, UserInputError } = require('apollo-server')
const Location = require('./models/Location')
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

const maxValue = (arr) => {
  let temp = -1
  arr.forEach(element => {
    if (temp < element) {
      temp = element
    }
  });
  return temp
}

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
    allUsers: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new UserInputError('invalid token');
      }
      const users = await User
        .find({})
        .populate('friends')
      return users
    },
    allLocations: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new UserInputError('invalid token');
      }
      const locations = await Location
        .find({})
      return locations
    },
    allRounds: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new UserInputError('invalid token');
      }
      if (args.id) {
        let round = await Round
          .findById(args.id)
        if (round) {
          return await round
            .populate('users')
            .populate('location')
        } else {
          throw new UserInputError('Round not found');
        }
      }
      if (currentUser) {
        let rounds = await Round
          .find({ users: currentUser })
          .populate('users')
          .populate('location')
        return rounds
      }
      let rounds = await Round
        .find({})
        .populate('users')
        .populate('location')
      if (args.location) {
        rounds = rounds.filter(round => round.location.name = args.location)
      }
      return rounds
    },
    allPoints: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new UserInputError('invalid token');
      }
      let points = []
      if (args.roundId) {
        points = await Point
          .find({ round: args.roundId })
          .populate('user')
          .populate('round')
        if (args.userId) {
          points = points.filter(point => point.user._id === args.userId)
        }
        if (args.trackIndex) {
          points = points.filter(point => point.trackIndex === args.trackIndex)
        }
      }
      return points
    },
    allFriends: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new UserInputError('invalid token');
      }
      let user
      if (args.username) {
        user = await User
          .findOne({ username: args.username })
          .populate('friends')
      } else if (args.userId) {
        user = await User
          .findById(args.userId)
          .populate('friends')
      }
      if (!user) {
        throw new UserInputError('Username/id not found');
      }
      return user.friends
    },
    me: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new UserInputError('invalid token');
      }
      const user = await User.findById(currentUser._id)
        .populate('friends')
      return user
    },
  },
  Mutation: {
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user) {
        throw new UserInputError('Wrong username or password');
      }

      const valid = await bcrypt.compare(args.password, user.passwordHash);
      if (!valid) {
        throw new UserInputError('Wrong username or password');
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return { token: jwt.sign(userForToken, JWT_SECRET), username: user.username }
    },
    addUser: async (root, args, { currentUser }) => {
      if (!currentUser || !currentUser.admin) {
        throw new UserInputError('invalid token');
      }
      if (args.password.length < 3) {
        throw new UserInputError('password should be longer than 3 letters')
      }
      const existingUser = await User.findOne({ username: args.username })
      if (existingUser) {
        throw new UserInputError('username already taken')
      }
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(args.password, saltRounds)
      const user = new User({
        username: args.username,
        passwordHash,
        admin: args.admin ? args.admin : false
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
      if (!currentUser) {
        throw new UserInputError('invalid token');
      }
      let friend = await User
        .findOne({ username: args.username })
      if (!friend) {
        throw new UserInputError('friend not found', {
          invalidArgs: args.username
        })
      }
      if (currentUser.friends.indexOf(friend._id) > -1) {
        throw new UserInputError('you are already friends', {
          invalidArgs: args.username
        })
      }
      currentUser.friends = currentUser.friends.concat(friend)
      if (friend.friends.indexOf(currentUser._id) === -1) {
        friend.friends = friend.friends.concat(currentUser)
      }
      try {
        await currentUser.save()
        await friend.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return await friend
        .populate('friends')
    },
    addLocation: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new UserInputError('invalid token');
      }
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
    addRound: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new UserInputError('invalid token');
      }
      const round = new Round({
        location: args.locationId,
        users: args.userIds,
        date: new Date()
      })
      try {
        await round
          .save()
        return await Round.findById(round._id)
          .populate('location')
          .populate('users')
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
    },
    addPoint: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new UserInputError('invalid token');
      }
      let point = await Point
        .findOne({
          trackIndex: args.trackIndex,
          round: args.roundId,
          user: args.userId,
        })
      if (!point) {
        point = new Point({
          trackIndex: args.trackIndex,
          round: args.roundId,
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
      return await Point.findById(point.id)
        .populate('round')
        .populate('user')
    },

    addCachedPoints: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new UserInputError('invalid token');
      }
      const roundId = args.roundId
      const round = await Round.findById(roundId)
      const userIds = args.userIds
      const trackIndexes = args.trackIndexes
      const pointIds = args.pointIds
      const points = args.points
      const size = userIds.length
      let result = []
      await Point.deleteMany({
        round
      })
      if (size !== trackIndexes.length
        || size !== points.length) {
        throw new UserInputError("array lengths of arguments do not match", {
          invalidArgs: args
        })
      }
      for (let i = 0; i < size; i++) {
        const userId = userIds[i]
        const user = await User.findById(userId)
        const trackIndex = trackIndexes[i]
        const point = points[i]
        const updatedPoint = await Point
          .findOneAndUpdate({
            round,
            user,
            trackIndex
          },
            {
              points: point
            },
            { new: true }).populate('user').populate('round')
        if (updatedPoint) {
          result.push(updatedPoint)
        } else {
          const newPoint = new Point({
            round,
            user,
            trackIndex,
            points: point
          })
          try {
            await newPoint
              .save()
            await newPoint
              .populate('round')
              .populate('user')
          } catch (error) {
            throw new UserInputError(error.message, {
              invalidArgs: args
            })
          }
          result.push(newPoint)
        }
      }
      return result
    },
    addNewTrack: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new UserInputError('invalid token');
      }
      const round = await Round
        .findById(args.roundId)
        .populate('user')
      let allPoints = await Point
        .find({ round: round._id })
      let nextIndex = 1 + maxValue(allPoints.map(point => point.trackIndex))
      let points = []
      for (let i = 0; i < round.users.length; i++) {
        const user = round.users[i]
        point = new Point({
          round: args.roundId,
          user: user._id,
          points: 3,
          trackIndex: nextIndex
        })
        try {
          await point
            .save()
          await point
            .populate('round')
            .populate('user')
          points.push(point)
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        }
      }
      return await Point
        .find({
          round: args.roundId,
          trackIndex: nextIndex
        })
        .populate('user')
        .populate('round')
    },
    deleteLastTrack: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new UserInputError('invalid token');
      }
      let allPoints = await Point
        .find({ round: args.roundId })
      allPoints
        .sort((p1, p2) => p2.trackIndex - p1.trackIndex)
      if (allPoints.length > 0) {
        const maxIndex = allPoints[0].trackIndex
        const points = await Point.find({ trackIndex: maxIndex })
        for (let i = 0; i < points.length; i++) {
          const point = points[i]
          await Point.findByIdAndDelete(point._id)
        }
        return maxIndex
      }
      return -1
    },
    deleteUser: async (root, args, { currentUser }) => {
      if (!currentUser || !currentUser.admin) {
        throw new UserInputError('invalid token');
      }
      const user = await User.findOne({ username: args.username })
      if (!user) {
        throw new UserInputError('Username not found');
      }
      const friends = await User.find({ friends: user })
      friends.forEach(async (friend) => {
        await User.findByIdAndUpdate(
          friend._id,
          {
            friends: friend.friends.filter(item => item._id.toString() !== user._id.toString())
          })
      });
      return await User.findByIdAndDelete(user._id)
    },
    deleteAllRounds: async (root, args, { currentUser }) => {
      if (!currentUser || !currentUser.admin) {
        throw new UserInputError('invalid token');
      }
      await Round.deleteMany({})
      await Point.deleteMany({})
    },
    deleteRound: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new UserInputError('invalid token');
      }
      const roundId = args.roundId
      const round = await Round.findById(roundId)
      if (!round) {
        throw new UserInputError('Round id not found');
      }
      if (round.users.filter(user => user === currentUser).length < 1) {
        throw new UserInputError('Unauthorized deletion of round');
      }
      await Point.deleteMany({ round })
      const result = await Round.findByIdAndDelete(roundId)
      return result
    },
    deleteLocation: async (root, args, { currentUser }) => {
      if (!currentUser || !currentUser.admin) {
        throw new UserInputError('invalid token');
      }
      const id = args.locationId
      const res = await Location.findByIdAndDelete(id)
      return res
    }
  },
  /*
  Subscription: {
    playAdded: {
      subscribe: () => pubsub.asyncIterator(['PLAY_ADDED'])
    }
  }*/
}
module.exports = resolvers