const { response } = require('express');
// Libreria para cifra
const Cifrar = require('bcrypt');

// Importaciones de modelo
const Usuario = require('../modelo/Usuario_modelo');

// Importaciones de token
const { generarJWT, comprobarJWT } = require('../ayudas/jwt');


const crearUsuario = async(req, res = response) => {

    try {

        const { correo, contrasenia } = req.body;
        const existeCorreo = await Usuario.findOne({ correo });

        if (existeCorreo) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Cifrado de contrasenia
        const salt = Cifrar.genSaltSync();

        usuario.contrasenia = Cifrar.hashSync(contrasenia.toString(), salt);

        await usuario.save();

        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}


const buscarUsuario = async(req, res = response) => {

    try {
        const { uid } = req.params;
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }

        res.json({
            ok: true,
            usuario
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}


const traerTodosUsuarios = async(req, res = response) => {

    try {
        const listaUsuario = await Usuario.find();

        res.json({
            ok: true,
            listaUsuario
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}


const actualizarUsuario = async(req, res = response) => {

    try {
        const {
            uid,
            correo,
            nombre,
            apellido,
            celular
        } = req.body;

        const usuario = await Usuario.findById(uid);

        usuario.correo = correo;
        usuario.nombre = nombre;
        usuario.apellido = apellido;
        usuario.celular = celular;
        usuario.save();

        res.json({
            ok: true,
            usuario
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}

const cambiarEstadoUsuario = async(req, res = response) => {

    try {
        const { uid } = req.body;
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }

        if (usuario.estado == 1) {
            usuario.estado = 0;
        } else {
            usuario.estado = 1;
        }

        usuario.save();

        res.json({
            ok: true
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}

module.exports = {
    crearUsuario,
    buscarUsuario,
    traerTodosUsuarios,
    actualizarUsuario,
    cambiarEstadoUsuario
}