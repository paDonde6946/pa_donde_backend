// IMPORTACION DEL PAQUETE MONGO
const mongoose = require('mongoose');
const log = require("../utils/logger/logger")


/// CONEXION A LA BASE DE DATOS CONFIGURACION
const dbConnection = async() => {

    try {
        // CONEXION A LA BD
        await mongoose.connect(process.env.DB_CNN, {
            //CONFIGURACIONES DE LA CONEXION A LA BD
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        log.info("db online");
        return true;

    } catch (error) {
        console.error(error);
        return false;
        // throw new Error('Eroor en la base de datos - Hable con el');
    }

}

module.exports = {
    dbConnection
}