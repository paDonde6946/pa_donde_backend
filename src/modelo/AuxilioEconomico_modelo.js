// Libria de cifrado
const { compareSync } = require("bcrypt");

const { Schema, model } = require('mongoose');

/**
 * Estado = { 1 : En espera , 2 : En ruta , 3 : Finalizado }
 */


const AuxilioEconomico = Schema({

    valor : {
        type: Number,
        require: true,
    },
    estado : {
        type : Number,
        default : 1
    },
}, {
    timestamps: true
});

AuxilioEconomico.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;

});


module.exports = model('AuxilioEconomico', AuxilioEconomico);