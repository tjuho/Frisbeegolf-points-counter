const mongoose = require('mongoose')

const schema = mongoose.Schema({
  playNumber: Number,
  round: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Round'
  }
})

module.exports = mongoose.model('Play', schema)
