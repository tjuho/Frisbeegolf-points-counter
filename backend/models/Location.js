const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    minlength: 1
  }
})
schema.plugin(uniqueValidator)

module.exports = mongoose.model('Location', schema)