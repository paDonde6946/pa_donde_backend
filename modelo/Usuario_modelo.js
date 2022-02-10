// Libria de cifrado
const { compareSync } = require("bcrypt");

const { Schema, model } = require('mongoose');

const Usuario = Schema({

    correo: {
        type: String,
        require: true,
        unique: true
    },
    contrasenia: {
        type: String,
        require: true
    },
    tipoUsuario: {
        type: Number,
        default: 1,
        require: true
    },
    nombre: {
        type: String,
        require: true
    },
    apellido: {
        type: String,
        require: true
    },
    cedula: {
        type: Number,
        require: true
    },
    celular: {
        type: Number,
        require: true
    },
    estado: {
        type: Number,
        require: true,
        default: 1
    },
    cambio_contrasenia: {
        type: Number,
        default: 0
    },
    calificacion_vehiculo: {
        type: Number
    },
    calificacion_usuario: {
        type: Number
    },
    vehiculos: [{
        vehiculoId: {
            type: Schema.Types.ObjectId,
            ref: "Vehiculo"
        }
    }],
    servicios: [{
        servicioId: {
            type: Schema.Types.ObjectId
        }
    }]
}, {
    timestamps: true
});

Usuario.method('toJSON', function() {
    const { __v, _id, contrasenia, ...object } = this.toObject();
    object.uid = _id;
    return object;

});


module.exports = model('Usuario', Usuario);