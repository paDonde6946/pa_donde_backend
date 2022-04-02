const { response } = require('express');

// Importaciones de modelo
const Usuario = require('../modelo/Usuario_modelo');
const Vehiculo = require('../modelo/Vehiculo_modelo');
const Servicio = require('../modelo/Servicio_modelo');


// Importaciones de token
const { generarJWT, comprobarJWT } = require('../ayudas/jwt');
// Importacion de generador de contrasenia
const { cifrarTexto, compararCifrado } = require('../ayudas/cifrado');
const log = require('../utils/logger/logger');


const cantidadUsuarios = async (req, res = response) => {
    try {
        let cantidadDeUsuarios = await Usuario.count();
        return res.json({
            ok: true,
            value: cantidadDeUsuarios,
            msg: 'El numero de usuarios es: '
        });
    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        return res.status(500).json({
            ok: false,
            msg: "Hable con el admin"
        });
    }
}


const cantidadVehiculos = async (req, res = response) => {
    try {
        let cantidadDeVehiculos = await Vehiculo.count();
        return res.json({
            ok: true,
            value: cantidadDeVehiculos,
            msg: 'El numero de vehículo es: '
        });
    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        return res.status(500).json({
            ok: false,
            msg: "Hable con el admin"
        });
    }
}

const cantidadConductores = async (req, res = response) => {
    try {
        let cantidadDeConductores = await Usuario.count({ fotoLicencia: { $exists: true } });
        return res.json({
            ok: true,
            value: cantidadDeConductores,
            msg: 'El numero de conductores es: '
        });
    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        return res.status(500).json({
            ok: false,
            msg: "Hable con el admin"
        });
    }
}

const cantidadServicios = async (req, res = response) => {
    try {
        let cantidadDeServicios = await Servicio.count();
        return res.json({
            ok: true,
            value: cantidadDeServicios,
            msg: 'El numero de servicios es: '
        });
    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        return res.status(500).json({
            ok: false,
            msg: "Hable con el admin"
        });
    }
}

const conductoresMasServicios = async (req, res = response) => {

    try {
        let conductores = await Usuario.find({ numServiciosHechos: { $exists: true } }).sort({ numServiciosHechos: -1 }).limit(5);
        return res.json({
            ok: true,
            value: conductores,
            msg: 'Conductores con mas servicios:'
        });

    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        return res.status(500).json({
            ok: false,
            msg: "Hable con el admin"
        });
    }
}

const cantidadCarrosMotos = async (req, res = response) => {

    try {
        let tipo = []
        let carro = await Vehiculo.count({ tipoVehiculo: 1 });
        let moto = await Vehiculo.count({ tipoVehiculo: 2 });
        tipo.push(carro, moto);
        return res.json({
            ok: true,
            value: tipo,
            msg: 'Carros y motos'
        });

    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        return res.status(500).json({
            ok: false,
            msg: "Hable con el admin"
        });
    }
}


module.exports = {
    cantidadUsuarios,
    cantidadVehiculos,
    cantidadConductores,
    cantidadServicios,
    conductoresMasServicios,
    cantidadCarrosMotos
};