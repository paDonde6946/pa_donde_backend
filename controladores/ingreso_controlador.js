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

    const { correo, contrasenia } = req.body;
    try {
        const usuarioBD = await Usuario.findOne({ correo, tipoUsuario: 1 });
        if (!usuarioBD) {
            return res.status(404).json({
                ok: false,
                msg: "Correo no encontrado"
            });
        }
        const validarContrasenia = Cifrar.compareSync(contrasenia.toString(), usuarioBD.contrasenia);
        if (!validarContrasenia) {
            return res.status(500).json({
                ok: false,
                msg: "Contrasenia no coincide"
            });
        }
        const token = await generarJWT(usuarioBD.id);

        res.json({
            ok: true,
            usuarioBD,
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



const loginAdmin = async(req, res = response) => {

    const { correo, contrasenia } = req.body;
    try {
        const usuarioBD = await Usuario.findOne({ correo, tipoUsuario: 0 });
        if (!usuarioBD) {
            return res.status(404).json({
                ok: false,
                msg: "Correo no encontrado"
            });
        }
        const validarContrasenia = Cifrar.compareSync(contrasenia.toString(), usuarioBD.contrasenia);
        if (!validarContrasenia) {
            return res.status(500).json({
                ok: false,
                msg: "Contrasenia no coincide"
            });
        }
        const token = await generarJWT(usuarioBD.id);
        res.json({
            ok: true,
            usuarioBD,
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