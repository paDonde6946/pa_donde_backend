const { response } = require('express');

// Importaciones de modelo
const Vehiculo = require('../modelo/Vehiculo_modelo');

/**
 * 1 : Carro
 * 2 : Camioneta
 * 3 : Moto
 */
const tipoVehiculo = [1, 2, 3]

const crearVehciulo = async(req) => {

    try {

        const vehiculo = new Vehiculo(req.body);
        await vehiculo.save();

        return vehiculo;

    } catch (error) {

        return false;
    }
}


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


const traerVehciulos = async(req, res = response) => {

    try {
        const listadoVehiculo = await Vehiculo.find();
        res.json({
            ok: true,
            listaUsuario
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
            uid,
            placa,
            tipoVehiculo,
            color,
            marca,
            anio,
            modelo
        } = req.body;

        const vehiculo = await Vehiculo.findById(uid);
        vehiculo.placa = placa;
        vehiculo.tipoVehiculo = tipoVehiculo;
        vehiculo.color = color;
        vehiculo.marca = marca;
        vehiculo.anio = anio;
        vehiculo.modelo = modelo;
        vehiculo.save();

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
        const { uid } = req.body;
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
    crearVehciulo,
    buscarVehciulo,
    actualizarVehciulo,
    cambiarEstadoVehciulo
}