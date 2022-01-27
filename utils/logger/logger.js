const { model, modelNames } = require('mongoose');
const {createLogger, format, transports} = require('winston');


module.exports = createLogger({
    level: 'info',
    format: format.simple(),
    transports: [
      new transports.File({ filename: 'logs/error.log', level: 'error' }),
      new transports.File({ filename: 'logs/Info.log', level: 'info' }),
    ],
  });