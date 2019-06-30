const { ApolloServer } = require('apollo-server')
const uuid = require('uuid/v1')
const mongoose = require('mongoose')
const resolvers = require('./resolvers')
const typeDefs = require('./typeDefs')
const jwt = require('jsonwebtoken')
const config = require('./utils/config')
const User = require('./models/User')
const JWT_SECRET = config.jwtSecret
console.log('mongo url', config.mongoUrl)
mongoose.set('useFindAndModify', false)
mongoose.connect(config.mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})