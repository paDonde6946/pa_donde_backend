const { response } = require('express');
const admin = require('firebase-admin');

function iniciarFireBase(){
    const servicioCuenta = require('../../keys/notification_push_key.json');
    admin.initializeApp({
        credential: admin.credential.cert(servicioCuenta),
    })
}

iniciarFireBase();



function envioNotificacion(pData, pMensaje, pTitulo, tokenReceptor) {
    console.log("Entro aca");
    const mensaje = {
        token : tokenReceptor,
        data: pData,
        notification: {
            title: pTitulo,
            body: pMensaje
        }
    }
    sendMessage(mensaje);
}

function sendMessage(mensaje) {
    admin.messaging().send(mensaje).then(() => {
        console.log("Mensaje enviado correctamente");
    }).catch((error) => {
        console.log(error);
        console.log("Error al enviar los mensajes");
    })
}

module.exports = {
    envioNotificacion
}