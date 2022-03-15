const { response } = require('express');

const Mensajes = require('../modelo/Mensaje_modelo');

const agregarMensaje = async (payload) => {
    try {
        const mensajes = await Mensajes.create(payload);
        return mensajes;
    } catch (error) {
        
    }
}

const traerConversacion = async (payload) => {
    try {
        const conversacion = await Mensajes.find({ $or: [{para: payload.para, de: payload.de}, {para: payload.de, de: payload.para}] })
        .select("de para servicio mensaje").sort({createdAt:-1});
        return conversacion;
    } catch (error) {
        
    }
}

module.exports = {
    agregarMensaje,
    traerConversacion
}