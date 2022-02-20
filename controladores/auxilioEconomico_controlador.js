// Importaciones de modelo
const { response } = require('express');

const AuxilioEconomico_modelo = require('../modelo/AuxilioEconomico_modelo');
const log = require('../utils/logger/logger');
const { Estado } = require('../utils/enums/estado_enum');


const listarAuxilioEconomico = async(req, res = response) => {

    try {
        
        let uid = req.uid;
        const auxilioEconomico = await AuxilioEconomico_modelo.find({ estado : Estado.Activo });

        res.json({
            ok: true,
            auxilioEconomico
        });

    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }
}

module.exports = {
    listarAuxilioEconomico
}
