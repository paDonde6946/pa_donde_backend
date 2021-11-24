const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');


//TODO AVERIGUAR PARA QUE SIRVE
//{ path: 'ENV_FILENAME' }
require('dotenv').config();

// DB Config
const { dbConnection } = require('./basedatos/configuracion');
dbConnection();


// App de Express
const app = express();

// Lectura y parte del Body
app.use(express.json());

// Lectura de archivos
app.use(fileUpload());

// Servidor de node
const servidor = require('http').createServer(app);

// Path publico
const publicoPath = path.resolve(__dirname, 'public');
app.use(express.static(publicoPath));


// Rutas Movil 
app.use('/app/login', require('./rutas/SesionApp_ruta'));


// Ruta Web
app.use('/web/login', require('./rutas/SesionApp_ruta'));


// Ruta Usuiario Web
app.use('/web', require('./rutas/Web_rutas'));

// Ruta Usuiario Movil 
app.use('/app', require('./rutas/App_ruta'));


servidor.listen(process.env.PORT, (err) => {
    if (err) throw new Error(err);
    console.log(' Servidor correindo en puerto ', process.env.PORT);
});