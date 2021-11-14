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

module.exports  = {
    crearServicio
}