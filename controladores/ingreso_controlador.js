const { response } = require('express');

// Importaciones de modelo
const Usuario = require('../modelo/Usuario_modelo');

// Importaciones de token
const { generarJWT, comprobarJWT } = require('../ayudas/jwt');
// Importacion de generador de contrasenia
const generator = require('generate-password');
const { cifrarTexto, compararCifrado } = require('../ayudas/cifrado');
const { enviarOlvidoContrasenia } = require('../correos/correos');

// Tipos de Usuario 
// 0 -> admin 
// 1 -> usuario

const loginUsuario = async(req, res = response) => {

    const { correo, contrasenia } = req.params;
    console.log(req.params);

    try {
        const usuario = await Usuario.findOne({ correo, tipoUsuario: 1 });
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

        console.log(error);
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

        console.log(error);
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
        const { correo } = req.body;
        const usuario = await Usuario.findOne({ correo });

        var password = generator.generate({
            length: 10,
            numbers: true
        });
        console.log(password);

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
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Hable con el admin"
        });
    }
}

module.exports = {
    loginUsuario,
    loginAdmin,
    olvidarContrasenia
};