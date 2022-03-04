// importaciones del modelo
const Mensaje = require('../modelo/Mensaje_modelo');
const log = require('../utils/logger/logger');


// const { notificacionChat } = require('../controladores/mensajesPush_controlador');


const obtenerChat = async(req, res) => {

    const de = req.uid;
    const { para, servicio } = req.body;

    try {
        const last50 = await Mensaje.find({
                $or: [{ para: para, de: de, servicio: servicio }, { de: para, para: de, servicio: servicio }, ]
            })
            .sort({ createdAt: 'desc' })
            .limit(50);
    
        res.json({
            ok: true,
            mensajes: last50
        });
        
    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }


}


const grabarMensaje = async(req, res) => {

    try {
        const mensajeBD = new Mensaje(req.body);
        mensajeBD.de = req.uid;
        await mensajeBD.save();

        const { para, mensaje, servicio } = req.body;


        // let destinatario = await Usuario.findById(para);
        // if (destinatario == null) {
        //     destinatario = await Partner.findById(para);
        // }


        // notificacionChat(de, para, servicio, mensaje, destinatario.nombre, destinatario.tokenMensajes);
        res.json({
            ok: true
        });

    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }

}

module.exports = {
    obtenerChat,
    grabarMensaje
}