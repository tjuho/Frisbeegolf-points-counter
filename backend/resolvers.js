const { PubSub, AuthenticationError, UserInputError } = require('apollo-server')
const Location = require('./models/Location')
const Play = require('./models/Play')
const Round = require('./models/Round')
const User = require('./models/User')
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

const pubsub = new PubSub()

module.exports.Resolvers = {
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
    login: (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user) {
        throw new UserInputError('Username not found');
      }

      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) {
        throw new UserInputError('Wrong password');
      }
      const token = new Token({
        value: jwt.sign({ userId: user.id }, JWT_SECRET)
      })
      return token
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
      const foundPlay = await Play
        .findOneAndUpdate({
          playNumber: args.playNumber,
          round: args.roundId,
          user: args.userId,
        },
          {
            points: args.points
          })
      if (foundPlay) {
        return foundPlay
      }
      const play = new Play({
        playNumber: args.playNumber,
        round: args.roundId,
        user: args.userId,
        points: args.points
      })
      await play.save()
      return play
    }
  },
  Subscription: {
    playAdded: {
      subscribe: () => pubsub.asyncIterator(['PLAY_ADDED'])
    }
  }
}