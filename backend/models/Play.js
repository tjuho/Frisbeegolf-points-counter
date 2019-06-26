const mongoose = require('mongoose')

const schema = mongoose.Schema({
  playNumber: Number,
  points: Number,
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Round'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Play', schema)
