var nodemailer = require('nodemailer');
// email sender 
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'padonde6946@gmail.com',
        pass: 'PaDonde6946%'
    }
});

sendEmail = function(opcionesCorreo) {

    transporter.sendMail(opcionesCorreo, function(error, info) {
        if (error) {
            return false;
            console.log(error);
        } else {
            console.log("Email sent");
            return true;
        }
    });

};


const enviarOlvidoContrasenia = (correo, clave) => {
    var opcionesCorreo = {
        from: 'padonde6946@gmail.com',
        to: correo,
        subject: 'Recuperacion de contraseña',
        html: olvidoContrasenia(clave)
    };
    return sendEmail(opcionesCorreo);
}



const olvidoContrasenia = (clave) => {
    return '<center><div style="    width: 50%;' +
        'border-color: white;' +
        'border-style: solid;' +
        'box-shadow: 0px 0px 4px black;' +
        'border-radius: 8px;">' +
        '    <div style="text-align-last: center;padding-inline: 10%;font-family: sans-serif;height: 90px;">' +
        '        <div style="width: 100%; text-align-last: center; padding-top: 30px;">' +
        '            <h2 style="color: #5D992C ;">' +
        '                Recuperacion de clave Pa Donde' +
        '            </h2>' +
        '        </div>' +
        '    </div>' +
        '    <hr class="new1">' +
        '    <p style="padding-inline: 30px; padding-top:10px; text-align: justify;">' +
        '        Hola! Nos enteramos que no te acuerdas de tu contraseña.' +
        '        <br><br>No te preocupues, estamos para servirte, por eso te asignamos una nueva, ingresa con ella y una vez adentro el sistema te pedira que la cambies.' +
        '        <br><br> Esta es tu nueva contraseña:' +
        '    </p>' +
        '    <center>' +
        '        <div>' +
        '            <h2 style="border-color: white;' +
        '            border-style: solid;' +
        '            box-shadow: 0px 0px 4px black;' +
        '            width: 12%;">' +
        clave +
        '            </h2>' +
        '        </div>' +
        '    </center>' +
        '</div></center>';
}

module.exports = {
    enviarOlvidoContrasenia
}