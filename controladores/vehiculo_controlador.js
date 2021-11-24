const { response } = require('express');

// Importaciones de modelo
const Vehiculo = require('../modelo/Vehiculo_modelo');

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
                msg: 'No existe el vehiculo'
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
                msg: 'No existe el vehiculo'
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
            vehiculo
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
        const { uid } = req.params;
        console.log(uid);
        const vehiculo = await Vehiculo.findById(uid);

        if (!vehiculo) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el vehiculo'
            });
        }

        if (vehiculo.estado == 1) {
            vehiculo.estado = 0;
        } else {
            vehiculo.estado = 1;
        }

        vehiculo.save();

        res.json({
            ok: true
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}



module.exports = {
    buscarVehciulo,
    actualizarVehciulo,
    cambiarEstadoVehciulo,
    traerVehciulos,
    buscarVehiculoPorPlaca
}