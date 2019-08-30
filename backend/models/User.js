const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const ObjectId = require('mongoose').Types.ObjectId

const typeDefs = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  passwordHash: {
    type: String,
    required: true
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  admin: {
    type: Boolean,
    default: false
  }
})

ObjectId.prototype.valueOf = function () {
  return this.toString();
};

typeDefs.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // suodatetaan passwordHash eli salasanan tiiviste pois näkyviltä
    delete returnedObject.passwordHash
  }
})

typeDefs.plugin(uniqueValidator)

module.exports = mongoose.model('User', typeDefs)