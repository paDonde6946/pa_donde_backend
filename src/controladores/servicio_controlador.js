const { response } = require('express');
const { body } = require('express-validator');

const Servicio = require('../modelo/Servicio_modelo');
const Usuario = require('../modelo/Usuario_modelo');


const crearServicio = async (data) => {

    try {

        let servicio = await Servicio.create(data);
        return { msg: servicio._id, rs: true };

    } catch (error) {
        return { msg: error, rs: false };
    }

}

const traerTodosServicios = async (req, res = response) => {

    try {
        const listaServicio = await Servicio.find();

        res.json({
            ok: true,
            listaServicio
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}

const cambiarEstadoServicio = async (req, res = response) => {

    try {
        const { uid } = req.body;
        const servicio = await Servicio.findById(uid);

        if (!servicio) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }

        if (servicio.estado == 1) {
            servicio.estado = 2;
        } else if (servicio.estado == 2) {
            servicio.estado = 3;
        } else if (servicio.estado ==3){
            servicio.estado = 4;
        } else {
            servicio.estado = 1;
        }

        servicio.save();

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

const agregarCupo = async (uidUsuario, idServicio) => {

    try {
        const servicioSeleccionado = await Servicio.findById(idServicio);
        if (servicioSeleccionado.cantidadCupos > servicioSeleccionado.pasajeros.length) {
            servicioSeleccionado.pasajeros.push({ pasajero: uidUsuario })
            await servicioSeleccionado.save();
            return true;
        } else {
            return "Lo sentimos no hay cupos.";
        }
    } catch (error) {
        return error;
    }
}

const quitarCupo = async (uidUsuario, idServicio) => {
    try {
        const servicioSeleccionado = await Servicio.findById(idServicio);
        let nuevoArreglo = servicioSeleccionado.pasajeros.filter((item) => item.pasajero != uidUsuario);
        servicioSeleccionado.pasajeros = nuevoArreglo;
        await servicioSeleccionado.save();
        return true;

    } catch (error) {
        return error;
    }
}

const editarServicio = async (uidServicio, data) => {
    try {
        await Servicio.findByIdAndUpdate(uidServicio, data);
        return true;
    } catch (error) {
        return error;
    }
}


const eliminarServicio = async (uidServicio) => {
    try {
        await Servicio.findByIdAndDelete(uidServicio);
        return true;
    } catch (error) {
        return error;
    }
}

const darUidConductor = async(uidServicio) =>{
    try {
        const conductor = await Usuario.find({servicios: uidServicio});
        return conductor[0]._id;
        
    } catch (error) {
        
    }
}

module.exports = {
    crearServicio,
    traerTodosServicios,
    cambiarEstadoServicio,
    agregarCupo,
    quitarCupo,
    editarServicio,
    eliminarServicio,
    darUidConductor
}