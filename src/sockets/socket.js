const { comprobarJWT } = require('../ayudas/jwt');
const { io } = require('../../index');

//Mensaje de sockets 
io.on('connection', client => {

    console.log("Cliente conectado");
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);
    // Verificar autenticación
    if (!valido) { return client.disconnect(); }

    // Ingresar al usuario a una sala en particular
    // sala global, client.id 
    client.join(uid);

    // Se desconecta
    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    // // Realiza la peticion de las postulaciones que tiene que hacer
    // client.on('darMisPostulaciones', async(payload) => {
    //     client.emit("tusPostulaciones", await darPostuladosXPartner(payload));
    // });
})