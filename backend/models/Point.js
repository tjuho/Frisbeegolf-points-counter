const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
const uniqueValidator = require('mongoose-unique-validator')

const schema = mongoose.Schema({
  points: Number,
  trackIndex: Number,
  round: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Round'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}).index({ user: 1, trackIndex: 1 }, { unique: true })
/*
ObjectId.prototype.valueOf = function () {
  return this.toString();
}
*/
schema.plugin(uniqueValidator)
/*
schema.set('toJSON', {
  transform: (document, returnedObject) => {
    //returnedObject.id = returnedObject._id.toString()
    //delete returnedObject._id
    //delete returnedObject.__v
    //returnedObject.user = returnedObject.user._id.toString()
  }
})*/
module.exports = mongoose.model('Point', schema)
