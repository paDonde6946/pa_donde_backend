const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const log = require('./src/utils/logger/logger');
var http = require('http');
var cors = require('cors')

//TODO AVERIGUAR PARA QUE SIRVE
//{ path: 'ENV_FILENAME' }
require('dotenv').config();

// DB Config
const { dbConnection } = require('./src/basedatos/configuracion');
dbConnection();


// App de Express
const app = express();

// Lectura y parte del Body
app.use(express.json());

// Lectura de archivos
app.use(fileUpload());

const issue2options = {
    origin: true,
    credentials: true,
    maxAge: 3600,
    preflightContinue: true,
  };
app.use(cors(issue2options));

// Servidor de node
const servidor = http.createServer(app);

// Servicio de socket
module.exports.io = require('socket.io')(servidor);
require('./src/sockets/socket');

// Path publico
const publicoPath = path.resolve(__dirname, 'public');
app.use(express.static(publicoPath));

app.use( function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

// Rutas Movil 
app.use('/app/login', require('./src/rutas/sesionApp_ruta.js'));


// Ruta Web
app.use('/web/login', require('./src/rutas/sesionApp_ruta'));


// Ruta Usuiario Web
app.use('/web', require('./src/rutas/Web_rutas'));

// Ruta Usuiario Movil 
app.use('/app', require('./src/rutas/App_ruta'));

servidor.listen(process.env.PORT, (err) => {
    if (err) throw new Error(err);

    log.info('Servidor correindo en puerto '+ process.env.PORT );
});