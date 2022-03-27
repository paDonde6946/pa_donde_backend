const { comprobarJWT } = require('../ayudas/jwt');
const { io } = require('../../index');
const { agregarMensaje, traerConversacion } = require('../controladores/mensaje_controlador');
const { darUidConductor } = require('../controladores/servicio_controlador');
const { envioNotificacion } = require('../controladores/notificaciones_push_controlador');
const Usuario = require('../modelo/Usuario_modelo');

//Mensaje de sockets 
io.on('connection', client => {

    console.log("Cliente conectado");
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);
    // Verificar autenticación
    if (!valido) { 
        console.log("Se desconecto");
        return client.disconnect(); }

    // Ingresar al usuario a una sala en particular
    // sala global, client.id 
    client.join(uid);

    // Se desconecta
    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    //Realiza la peticion que da el chat 
    /**
     * Payload 
     * de
     * para
     * mensaje
     * servicio 
     */
    client.on('enviarMensaje', async(payload) => {
        payload.de = uid;
        payload.para = (payload.para == '' || payload.para == undefined || payload.para == null ) ? await darUidConductor(payload.servicio) : payload.para;
        await agregarMensaje(payload);
        const conversacion = await traerConversacion(payload);
        client.emit('darConversacion', conversacion);
        const paraUsuario = await Usuario.findById(payload.para, 'nombre tokenMensaje');
        const deUsuario = await Usuario.findById(payload.de, 'nombre');
        envioNotificacion({
            accion: "0",
            para : payload.de,
            de : payload.para.toString(),
            mensaje :payload.mensaje,
            servicio: payload.servicio,
            nombre: deUsuario.nombre
        }, payload.mensaje, paraUsuario.nombre, paraUsuario.tokenMensaje)
        io.to(payload.para).emit('recibirMensaje', payload);
    });

    client.on('traerConversacion', async(payload) => {
        payload.de = uid;
        payload.para = (payload.para == '' || payload.para == undefined || payload.para == null ) ? await darUidConductor(payload.servicio) : payload.para;
        const conversacion = await traerConversacion(payload);
        client.emit('darConversacion', conversacion);
    });
})