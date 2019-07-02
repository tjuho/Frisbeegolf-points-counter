const mongoose = require('mongoose')

const schema = mongoose.Schema({
  points: Number,
  play: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Play'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Point', schema)
