if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let port = process.env.PORT
let mongoUrl = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
  mongoUrl = process.env.TEST_MONGODB_URI
}
if (process.env.NODE_ENV === 'development') {
  //mongoUrl = process.env.DEV_MONGODB_URI
}

const jwtSecret = process.env.JWT_SECRET

module.exports = {
  mongoUrl,
  port,
  jwtSecret
}