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
    fechayhora : {
        type: Date,
        require: true,
    },
    pasajeros : [{
        pasajero : {
            type: Schema.Types.ObjectId,
            ref: "Usuario"
        },
        puntuacionPasajero : {
            type : Number
        },
        puntuacionConductor:{
            type : Number
        }
    }],
    idVehiculo :{
        type: Schema.Types.ObjectId,
        ref: "Vehiculo",
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
        type: Schema.Types.ObjectId,
        ref: "AuxilioEconomico"
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