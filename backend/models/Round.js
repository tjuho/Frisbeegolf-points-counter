const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId

const schema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
})
ObjectId.prototype.valueOf = function () {
  return this.toString();
}
module.exports = mongoose.model('Round', schema)
