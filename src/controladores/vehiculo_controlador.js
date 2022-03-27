const { response } = require('express');
const log = require('../utils/logger/logger');

// Importaciones de modelo
const Vehiculo = require('../modelo/Vehiculo_modelo');
const { Estado } = require('../utils/enums/estado_enum');

/**
 * 1 : Carro
 * 2 : Camioneta
 * 3 : Moto
 */
const tipoVehiculo = [1, 2, 3]


const buscarVehciulo = async(req, res = response) => {

    try {

        const { uid } = req.body;
        const vehiculo = await Vehiculo.findById(uid);
        if (!vehiculo) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el vehículo'
            });
        }
        res.json({
            ok: true,
            vehiculo
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}

const buscarVehiculoPorPlaca = async(req, res = response) => {

    try {
        const { placa } = req.params;
        console.log(placa);
        const vehiculo = await Vehiculo.findOne({placa})
        console.log(vehiculo);
        if (!vehiculo) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el vehículo'
            });
        }
        res.json({
            ok: true,
            vehiculo
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}


const traerVehciulos = async(req, res = response) => {

    try {
        const listadoVehiculo = await Vehiculo.find();
        listadoVehiculo.tipoVehiculo = 
        res.json({
            ok: true,
            listadoVehiculo
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}


const actualizarVehciulo = async(req, res = response) => {

    try {
        const {
            uid
        } = req.params;
        const vehiculo = await Vehiculo.findByIdAndUpdate(uid, req.body);

        res.json({
            ok: true,
            msg: "Su vehículo se actualizo correctamente."
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}

const cambiarEstadoVehciulo = async(req, res = response) => {
    
    try {
        let { uid } = req.params;
        if(uid == undefined || uid == null){
            uid = req.uid;
        }
        const vehiculo = await Vehiculo.findById(uid);

        if (!vehiculo) {
            log.error(req.uid, req.body, req.params, req.query, 'No existe el vehículo');
            return res.status(400).json({
                ok: false,
                msg: 'No existe el vehículo'
            });
        }

        if (vehiculo.estado == Estado.Activo) {
            vehiculo.estado = Estado.Inactivo;
        } else {
            vehiculo.estado = Estado.Activo;
        }

        vehiculo.save();

        res.json({
            ok: true,
            msg: "El vehiculo se elimino correctamente"
        });
    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}

/**
 * Cambia el estado mediante una funcion
 * @param {String} uid el uid del carro 
 * @param {int} estado el estado al cual desea cambiar 
 */
const cambiarEstado = async (uid, cambioEstado) => {

    try {
        let vehiculo = await Vehiculo.findByIdAndUpdate(uid, { estado : cambioEstado});
        return { ok: true };
    } catch (error) {
        return { ok: false, msg: "No existe el vehículo de uid "+uid  };
    }

}



module.exports = {
    buscarVehciulo,
    actualizarVehciulo,
    cambiarEstadoVehciulo,
    traerVehciulos,
    buscarVehiculoPorPlaca,
    cambiarEstado
}