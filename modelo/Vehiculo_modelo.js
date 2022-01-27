// Libria de cifrado
const { compareSync } = require("bcrypt");

const { Schema, model } = require('mongoose');
const {Estado} = require('../utils/enums/estado_enum')

const Vehiculo = Schema({

    placa: {
        type: String,
        require: true,
        unique: true
    },
    tipoVehiculo: {
        type: Number,
        default: 1,
        require: true
    },
    color: {
        type: String,
        require: true
    },
    marca: {
        type: String,
        require: true
    },
    anio: {
        type: String,
        require: true
    },
    modelo: {
        type: String,
        require: true
    },
    estado: {
        type: Number,
        require: true,
        default: Estado.Activo
    }
}, {
    timestamps: true
});

Vehiculo.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;

});


module.exports = model('Vehiculo', Vehiculo);