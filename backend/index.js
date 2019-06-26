const { ApolloServer } = require('apollo-server')
const uuid = require('uuid/v1')

const mongoose = require('mongoose')
const config = require('./utils/config')

const Resolvers = require('./resolvers')
const typeDefs = require('./schema')

mongoose.set('useFindAndModify', false)

mongoose.connect(config.mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })
