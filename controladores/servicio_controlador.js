const { response } = require('express');
const { body } = require('express-validator');

const Servicio = require('../modelo/Servicio_modelo');


const crearServicio = async(data) => {

    try {

        let servicio = await Servicio.create(data);
        return { msg: servicio._id, rs: true};
        
    } catch (error) {
        return { msg: error, rs: false}; 
    }

}

const traerTodosServicios = async(req, res = response) => {

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

const cambiarEstadoServicio = async(req, res = response) => {

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
            servicio.estado = 0;
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

const agregarCupo = async(uidUsuario, idServicio) => {

    try {
        const servicioSeleccionado  = await Servicio.findById(idServicio);
        if(servicioSeleccionado.cantidadCupos > servicioSeleccionado.pasajeros.length){
            servicioSeleccionado.pasajeros.push({pasajero: uidUsuario});
            servicioSeleccionado.save();
            return true;
        }else{
            return "Lo sentimos no hay cupos.";
        }
    } catch (error) {
        return error;
    }

}

module.exports  = {
    crearServicio,
    traerTodosServicios,
    cambiarEstadoServicio,
    agregarCupo
}