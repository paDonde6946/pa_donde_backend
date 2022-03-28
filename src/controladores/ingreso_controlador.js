const { response } = require('express');

// Importaciones de modelo
const Usuario = require('../modelo/Usuario_modelo');

// Importaciones de token
const { generarJWT, comprobarJWT } = require('../ayudas/jwt');
// Importacion de generador de contrasenia
const generator = require('generate-password');
const { cifrarTexto, compararCifrado } = require('../ayudas/cifrado');
const { enviarOlvidoContrasenia, enviarActivacionCuenta } = require('../correos/correos');
const log = require('../utils/logger/logger');
const jwt = require('jsonwebtoken');


// Tipos de Usuario 
// 0 -> admin 
// 1 -> usuario

const loginUsuario = async(req, res = response) => {

    const { correo, contrasenia, tokenMensaje } = req.params;

    try {
        const usuario = await Usuario.findOne({ correo, tipoUsuario: 1 }).select('correo nombre apellido celular cambio_contrasenia cedula contrasenia calificacionConductor calificacionUsuario uid historialOrigen historialDestino ultimoServicioSinCalificar fotoLicencia');
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Correo no encontrado"
            });
        }
        const validarContrasenia = compararCifrado(contrasenia.toString(), usuario.contrasenia);
        if (!validarContrasenia) {
            return res.status(500).json({
                ok: false,
                msg: "Contrasenia no coincide"
            });
        }
        const token = await generarJWT(usuario.id);
        usuario.tokenMensaje = tokenMensaje;
        await usuario.save();
        res.json({
            ok: true,
            usuario,
            token
        });


    } catch (error) {

        log.error(req.uid, req.body, req.params, req.query, error);
        return res.status(500).json({
            ok: false,
            msg: "Hable con el admin"
        });
    }
}


/**
 * 
 * @param {*} req Request de los datos necsarios para ingresar al sistema
 * @param {*} res Respons 
 * @returns 
 */
const loginAdmin = async(req, res = response) => {

    const { correo, contrasenia } = req.query;

    try {
        const usuario = await Usuario.findOne({ correo, tipoUsuario: 0 });
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Correo no encontrado"
            });
        }
        const validarContrasenia = compararCifrado(contrasenia.toString(), usuario.contrasenia);
        if (!validarContrasenia) {
            return res.status(500).json({
                ok: false,
                msg: "Contrasenia no coincide"
            });
        }
        const token = await generarJWT(usuario.id);
        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        return res.status(500).json({
            ok: false,
            msg: "Hable con el admin"
        });
    }
}



/**
 * 
 * @param {*} req Correo elecctronico del cual se va a recuperar 
 * @param {*} res Ok : false or true
 */
const olvidarContrasenia = async(req, res = response) => {
    try {
        let { correo } = req.body;
        if (correo == null || correo == undefined) {
            console.log("Entro por medio del admin");
            correo = req.query.correo;
        }

        const usuario = await Usuario.findOne({ correo });

        var password = generator.generate({
            length: 10,
            numbers: true
        });

        usuario.contrasenia = cifrarTexto(password);
        usuario.cambio_contrasenia = 1;
        usuario.save();

        if (!enviarOlvidoContrasenia(usuario.correo, password)) {
            res.json({
                ok: true
            });
        } else {
            res.json({
                ok: false
            });
        }


    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        return res.status(500).json({
            ok: false,
            msg: "Hable con el admin"
        });
    }
}

const preRegistro = async(req, res = response) => {

    try {
        const {nombre, apellido, celular, correo, contrasenia, cedula} = req.body;
        
        const existeCorreo = await Usuario.findOne({ correo });
        if (existeCorreo) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }
        
        const payload = { 
            nombre,
            apellido,
            celular,
            correo,
            contrasenia,
            cedula
         };
        let tokenRe = jwt.sign({
            data: payload
          }, process.env.JWT_KEY, { expiresIn: '5h' });

        enviarActivacionCuenta( correo, process.env.DOMINIO+"/app/login"+"/activacionCuenta/"+tokenRe );
        res.json({
            ok: true,
            msg : "Por favor revisa tu correo"
        });
    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}

const crearUsuarioPosRegistro = async(req, res = response) => {

    const {token} = req.params;
    let payload = '';
    try {
        const {data} = jwt.verify(token, process.env.JWT_KEY);
        payload = data;
    } catch (error) {
        return res.sendFile(__dirname.split('src')[0]+'/public/TokenVencido.html');
    }

    try {
        const { correo, contrasenia } = payload;
        const existeCorreo = await Usuario.findOne({ correo });
        
        if (existeCorreo) {
            return res.sendFile(__dirname.split('src')[0]+'/public/ActivacionErronea.html');
        }

        const usuario = new Usuario(payload);

        usuario.contrasenia = cifrarTexto(contrasenia.toString());

        await usuario.save();

        return res.sendFile(__dirname.split('src')[0]+'/public/ActivacionExitosa.html');
        

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }

}
module.exports = {
    loginUsuario,
    loginAdmin,
    olvidarContrasenia,
    preRegistro,
    crearUsuarioPosRegistro
};