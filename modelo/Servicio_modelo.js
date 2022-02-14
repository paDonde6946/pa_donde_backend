// Libria de cifrado
const { compareSync } = require("bcrypt");

const { Schema, model } = require('mongoose');

const {EstadoViaje} = require('../utils/enums/estadoViaje_enum');


const Servicio = Schema({

    nombreOrigen: {
        type: String,
        require: true,
    },
    nombreDestino : {
        type: String,
        require: true,
    },
    polylineRuta : {
        type: String,
        require: true,
    },
    horaDeInicio  : {
        type: String,
        require: true,
    },
    fecha : {
        type: Date,
        require: true,
    },
    pasajeros : [{
        pasajero : {
            type: Schema.Types.ObjectId
        },
        puntuacionPasajero : {
            type : Number
        }
    }],
    idVehiculo :{
        type: Schema.Types.ObjectId,
        require: true,
    },
    cantidadCupos :{
        type: Number,
        require: true,
    },
    distancia : {
        type: String,
        require: true,
    },
    duracion : {
        type: String,
        require: true,
    },
    idAuxilioEconomico: {
        require: true,
        type: Schema.Types.ObjectId
    },
    estado : {
        type : Number,
        default : EstadoViaje.Esperando
    },

}, {
    timestamps: true
});

Servicio.method('toJSON', function() {
    const { __v, _id, contrasenia, ...object } = this.toObject();
    object.uid = _id;
    return object;

});


module.exports = model('Servicio', Servicio);