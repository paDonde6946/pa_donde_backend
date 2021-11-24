const { response } = require('express');
const { body } = require('express-validator');

const Servicio = require('../modelo/Servicio_modelo');


const crearServicio = async(data) => {

    try {

        let servicio = new Servicio(data);
        servicio = await servicio.save();
        console.log(servicio._id);
        return servicio._id;
        
    } catch (error) {
        return false;
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

module.exports  = {
    crearServicio,
    traerTodosServicios
}