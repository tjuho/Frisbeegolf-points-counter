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
    allRounds: async (root, args, { currentUser }) => {
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
    allPoints: async (root, args) => {
      let points = []
      if (args.roundId) {
        points = await Point
          .find({ round: args.roundId })
          .populate('user')
          .populate('round')
        if (args.userId) {
          points = points.filter(point => point.user._id === args.userId)
        }
        if (args.trackNumber) {
          points = points.filter(point => point.trackNumber === args.trackNumber)
        }
      }
      return points
    },
    allFriends: async (root, args) => {
      let user
      if (args.username) {
        user = await User
          .findOne({ username: args.username })
          .populate('friends')
        console.log('user friends', user)
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

      return await User.findById(context.currentUser._id)
        .populate('friends')
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
      return { token: jwt.sign(userForToken, JWT_SECRET), username: user.username }
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
      if (!currentUser) {
        throw new UserInputError('invalid token');
      }
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
      console.log('users', args.userIds, 'location', args.locationId)
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
        console.log('error', error.message)
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
    },
    addPlay: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new UserInputError('invalid token');
      }
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
      return await play
        .populate('round')
    },
    addPoint: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new UserInputError('invalid token');
      }
      console.log('add point args', args)
      let point = await Point
        .findOneAndUpdate({
          round: args.roundId,
          user: args.userId,
          trackIndex: args.trackIndex
        },
          {
            points: args.points
          },
          { new: true })
        .populate('round')
        .populate('user')
      console.log('updated point', point)
      if (!point) {
        point = new Point({
          round: args.roundId,
          user: args.userId,
          points: args.points,
          trackIndex: args.trackIndex
        })
        try {
          await point
            .save()
          await point
            .populate('round')
            .populate('user')
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        }
      }
      return point
    },

    addPoints: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new UserInputError('invalid token');
      }
      console.log('add point args', args)
      const temp = args.roundIds.length
      let result = []
      if (temp !== args.userIds.length
        || temp !== args.trackIndexes.length
        || temp !== args.points.length) {
        throw new UserInputError("array lengths of arguments do not match", {
          invalidArgs: args
        })
      }
      for (let i = 0; i < temp; i++) {
        const roundId = args.roundIds[i]
        const userId = args.userIds[i]
        const trackIndex = args.trackIndex[i]
        const point = args.points[i]
        let newPoint = await Point
          .findOneAndUpdate({
            round: roundId,
            user: userId,
            trackIndex: trackIndex
          },
            {
              points: point
            },
            { new: true })
          .populate('round')
          .populate('user')
        console.log('updated point', newPoint)
        if (!newPoint) {
          newPoint = new Point({
            round: roundId,
            user: userId,
            points: point,
            trackIndex: trackIndex
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
        }
        result.push(newPoint)
      }
      return result
    },
    addCachedPoints: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new UserInputError('invalid token');
      }
      console.log('add point args', args)
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
        console.log('check point 1', userId, roundId)
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
        console.log('check point 2', updatedPoint)
        if (updatedPoint) {
          result.push(updatedPoint)
        } else {
          const newPoint = new Point({
            round,
            user,
            trackIndex,
            points: point
          })
          console.log('check point 3')
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
      console.log('result', result)
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
      console.log('points', points)
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
          console.log('point to delete', point)
          await Point.findByIdAndDelete(point._id)
        }
        return maxIndex
      }
      return -1
    },
    deleteUser: async (root, args, { currentUser }) => {
      if (!currentUser) {
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
    deleteAllRounds: async (root, args) => {
      await Round.deleteMany({})
      await Point.deleteMany({})
    },
    deleteRound: async (root, args) => {
      const round = await Round.findById(args.roundId)
      if (!round) {
        throw new UserInputError('Round id not found');
      }
      const plays = Play.find({ roundId: round.id })
      await Point.deleteMany({ playId: { $in: plays.map(play => play.id) } })
      await Play.deleteMany({ roundId: round.id })
      return await Round.findByIdAndDelete(args.roundId)
    },
    deleteLocation: async (root, args) => {
      return await Location.findOneAndDelete({ name: args.name })
    }
  },
  Subscription: {
    playAdded: {
      subscribe: () => pubsub.asyncIterator(['PLAY_ADDED'])
    }
  }
}
module.exports = resolvers