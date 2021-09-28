const { response } = require('express');
// Libreria para cifra
const Cifrar = require('bcrypt');

// Importaciones de modelo
const Usuario = require('../modelo/Usuario_modelo');

// Importaciones de token
const { generarJWT, comprobarJWT } = require('../ayudas/jwt');

// Tipos de Usuario 
// 0 -> admin 
// 1 -> usuario

const loginUsuario = async(req, res = response) => {


    const { correo, contrasenia } = req.params;
    try {
        const usuario = await Usuario.findOne({ correo, tipoUsuario: 1 });
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Correo no encontrado"
            });
        }
        const validarContrasenia = Cifrar.compareSync(contrasenia.toString(), usuario.contrasenia);
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

    const { correo, contrasenia } = req.body;
    try {
        const usuario = await Usuario.findOne({ correo, tipoUsuario: 0 });
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Correo no encontrado"
            });
        }
        const validarContrasenia = Cifrar.compareSync(contrasenia.toString(), usuario.contrasenia);
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


module.exports = {
    loginUsuario,
    loginAdmin
};