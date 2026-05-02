const logger = require('../utils/logger')

module.exports = (err, req, res, next) => {
  logger.error(err.message || err)
  const status = err.statusCode || 500
  res.status(status).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
