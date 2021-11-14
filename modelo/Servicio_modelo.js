// Libria de cifrado
const { compareSync } = require("bcrypt");

const { Schema, model } = require('mongoose');

/**
 * Estado = { 1 : En espera , 2 : En ruta , 3 : Finalizado }
 */


const Servicio = Schema({

    puntoInicio : {
        type: String,
        require: true,
    },
    puntoFinal : {
        type: String,
        require: true,
    },
    fecha : {
        type: Date,
        require: true,
    },
    descripcion : {
        type: String
    },
    vehiculo: {
        type: Schema.Types.ObjectId,
        require: true,
    },
    pasajeros : [{
            pasajero : {
                type: Schema.Types.ObjectId
            },
            puntuacionPasajero : {
                type : Number
            }
        }
    ],
    cuposTotales : {
        type: Date,
        require: true,
    },
    estado : {
        type : Number,
        default : 1
    },
    puntuacion : {
        type : Number
    }
}, {
    timestamps: true
});

Servicio.method('toJSON', function() {
    const { __v, _id, contrasenia, ...object } = this.toObject();
    object.uid = _id;
    return object;

});


module.exports = model('Servicio', Servicio);