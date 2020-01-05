const { ApolloServer } = require('apollo-server-express')
const { createTestClient } = require('apollo-server-testing');
const Location = require('../models/Location')
const Point = require('../models/Point')
const Round = require('../models/Round')
const User = require('../models/User')
const resolvers = require('../resolvers')
const typeDefs = require('../typeDefs')
const config = require('../utils/config')
const mongoose = require('mongoose')
const {
  ALL_LOCATIONS,
  ALL_USERS,
  ALL_ROUNDS,
  ALL_POINTS,
  ADD_LOCATION,
  ADD_USER,
  ADD_PLAY,
  ADD_ROUND,
  ADD_POINT,
  DELETE_LOCATION,
  DELETE_ROUND,
  LOGIN,
  ME,
} = require('../querys')

let server = null

describe('server testing', () => {

  beforeAll(async () => {
    console.log('mongo url', config.mongoUrl)
    mongoose.set('useFindAndModify', false)
    try {
      await mongoose.connect(config.mongoUrl, { useNewUrlParser: true })
      console.log('connected to MongoDB')
    } catch (error) {
      console.log('error connection to MongoDB:', error.message)
    }
    server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({
        currentUser: {
          id: 1,
          username: 'testaaja',
          admin: true,
        }
      })
    })
  })

  beforeEach(async () => {
    await Location.deleteMany({})
    await Point.deleteMany({})
    await Round.deleteMany({})
    await User.deleteMany({})
    const location1 = new Location({
      name: 'paikka'
    })
    await location1.save()
  })
  it('add location', async () => {
    const { query, mutate } = createTestClient(server);
    const res = await mutate({
      mutation: ADD_LOCATION,
      variables: {
        name: 'mesta'
      }
    })
    expect(res.data.addLocation.name).toBe('mesta')
    const res1 = await query({ query: ALL_LOCATIONS })
    expect(res1.data.allLocations.map(location => location.name)).toContain('mesta')
  })
  it('query all locations', async () => {
    const { query, mutate } = createTestClient(server);
    const res = await query({ query: ALL_LOCATIONS })
    expect(res.data.allLocations[0].name).toBe('paikka')
  })
  it('delete location', async () => {
    const { query, mutate } = createTestClient(server);
    const res = await query({ query: ALL_LOCATIONS })
    expect(res.data.allLocations[0].name).toBe('paikka')
    const id = res.data.allLocations[0].id
    const res1 = await mutate({
      mutation: DELETE_LOCATION,
      variables: {
        locationId: res.data.allLocations[0].id
      }
    })
    const res2 = await query({ query: ALL_LOCATIONS })
    expect(res2.data.allLocations.length).toBe(0)
  })
  it('add points', async () => {

    const { query, mutate } = createTestClient(server);
    const res = await query({ query: ALL_LOCATIONS })
    const locationId = res.data.allLocations[0].id
    expect(res.data.allLocations[0].name).toBe('paikka')
    const res1 = await mutate({
      mutation: ADD_USER,
      variables: {
        username: 'pelaaja1',
        password: '12346',
      }
    })
    const res2 = await mutate({
      mutation: ADD_USER,
      variables: {
        username: 'pelaaja2',
        password: '12346',
        admin: false
      }
    })
    const res3 = await query({
      query: ALL_USERS,
    })
    const playerIds = res3.data.allUsers.map(user => user.id)
    expect(playerIds.length).toBe(2)
    const res4 = await mutate({
      mutation: ADD_ROUND,
      variables: {
        userIds: playerIds,
        locationId,
        admin: false
      }
    })
    const roundId = res4.data.addRound.id
    const server1 = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => null
    })
    const testClient = createTestClient(server1);
    const query1 = testClient.query
    const res5 = await query1({ query: ALL_ROUNDS })
    expect(res5.data.allRounds.length).toBe(1)
    expect(res5.data.allRounds.map(round => round.id)).toContain(roundId)
  })
  it('add round', async () => {

    const { query, mutate } = createTestClient(server);
    const res = await query({ query: ALL_LOCATIONS })
    const locationId = res.data.allLocations[0].id
    expect(res.data.allLocations[0].name).toBe('paikka')
    const res1 = await mutate({
      mutation: ADD_USER,
      variables: {
        username: 'pelaaja1',
        password: '12346',
      }
    })
    const res2 = await mutate({
      mutation: ADD_USER,
      variables: {
        username: 'pelaaja2',
        password: '12346',
        admin: false
      }
    })
    const res3 = await query({
      query: ALL_USERS,
    })
    const playerIds = res3.data.allUsers.map(user => user.id)
    expect(playerIds.length).toBe(2)
    const res4 = await mutate({
      mutation: ADD_ROUND,
      variables: {
        userIds: playerIds,
        locationId,
        admin: false
      }
    })
    const roundId = res4.data.addRound.id
    const server1 = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => null
    })
    const testClient = createTestClient(server1);
    const query1 = testClient.query
    const res5 = await query1({ query: ALL_ROUNDS })
    expect(res5.data.allRounds.length).toBe(1)
    expect(res5.data.allRounds.map(round => round.id)).toContain(roundId)
    const res6 = await mutate({
      mutation: ADD_POINT,
      variables: { roundId, userId: playerIds[0], trackIndex: 0, points: 3 }
    })
    const res7 = await mutate({
      mutation: ADD_POINT,
      variables: { roundId, userId: playerIds[1], trackIndex: 0, points: 4 }
    })
    const res8 = await query({ query: ALL_POINTS, variables: { roundId } })
    expect(res8.data.allPoints.length).toBe(2)
    expect(res8.data.allPoints.map(point => point.user.id)).toContain(playerIds[0])
    expect(res8.data.allPoints.map(point => point.user.id)).toContain(playerIds[1])
    expect(res8.data.allPoints.map(point => point.trackIndex)).toContain(0)
    expect(res8.data.allPoints.map(point => point.points)).toContain(3)
    expect(res8.data.allPoints.map(point => point.points)).toContain(4)
  })

  afterAll(async () => {
    await Location.deleteMany({})
    await Play.deleteMany({})
    await Point.deleteMany({})
    await Round.deleteMany({})
    await User.deleteMany({})
    await mongoose.disconnect()
  })
})