const winston = require('winston');
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({
      format: winston.format.printf(info => 
        `[${new Date().toISOString()}] ${info.level}: ${info.message}`
      )
    })
  ]
});
module.exports = logger;
