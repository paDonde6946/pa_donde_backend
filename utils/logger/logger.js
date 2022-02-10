const { model, modelNames } = require('mongoose');
const {createLogger, format, transports} = require('winston');

const crearLog = createLogger({
  format: format.simple(),
  transports: [
    new transports.File({ filename: 'logs/info.log', level: 'info' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

const error = (uid ,body ,params ,query, error) => {
  crearLog.error("-----------------------------------------------------------------------------");
  crearLog.error("Fecha y hora: " + new Date());
  crearLog.error("UID: " + uid);
  crearLog.error("BODY: " + JSON.stringify(body));
  crearLog.error("PARAMS: " + JSON.stringify(params));
  crearLog.error("QUERY: " + JSON.stringify(query));
  crearLog.error(error);
  crearLog.error("-----------------------------------------------------------------------------");
}

const info = (informacion) => {
  crearLog.info(informacion);
}

module.exports = {
  info,
  error
};