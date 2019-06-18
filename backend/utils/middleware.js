const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    logger.error('validation error')
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'TypeError') {
    logger.error('type error')
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    logger.error('type error')
    return response.status(400).json({ error: 'authentication error' })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}
module.exports = {
  errorHandler,
  unknownEndpoint,
  requestLogger,
  tokenExtractor
}