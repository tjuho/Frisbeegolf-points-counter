const http = require('http')
const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const app = express()
const path = require('path');
const mongoose = require('mongoose')
const resolvers = require('./resolvers')
const typeDefs = require('./typeDefs')
const jwt = require('jsonwebtoken')
const config = require('./utils/config')
const User = require('./models/User')
const { withFilter } = require('graphql-subscriptions')
//const cors = require('cors')
//app.use(cors())
const JWT_SECRET = config.jwtSecret
const PORT = config.port
const URL = config.mongoUrl
if (!URL) {
  console.log('mongodb url not found. If using development mode, run the backend with command "npm run watch"')
}
console.log('mongo url', URL)
mongoose.set('useFindAndModify', false)
mongoose.connect(URL, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
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
  },
  subscriptions: {
    onConnect: (connectionParams, webSocket) => {
      if (connectionParams.authToken) {
        return validateToken(connectionParams.authToken)
          .then(findUser(connectionParams.authToken))
          .then(user => {
            return {
              currentUser: user,
            };
          });
      }

      throw new Error('invalid token');
    },
    pointAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('POINT_ADDED'),
        (payload, variables) => {
          return payload.pointAdded.round === variables.roundId;
        },
      ),
    }
  },
})

app.use(express.static('build'))

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

/*
server.listen({ port: process.env.PORT || 4000 })
  .then(({ url, subscriptionsUrl }) => {
    console.log(`Server ready at ${url}`)
    console.log(`Subscriptions ready at ${subscriptionsUrl}`)
  })
*/

server.applyMiddleware({
  app
})
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
})