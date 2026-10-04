const logger = require('../utils/logger');
module.exports = {
  errorHandler: (err, req, res, next) => {
    logger.error('Error:', err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal Server Error'
    });
  }
};
