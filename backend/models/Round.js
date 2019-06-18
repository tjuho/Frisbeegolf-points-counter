const mongoose = require('mongoose')

const schema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
})

module.exports = mongoose.model('Round', schema)
