const { response } = require('express');
// Libreria para cifra
const Cifrar = require('bcrypt');

// Importaciones de modelo
const Usuario = require('../modelo/Usuario_modelo');

// Importaciones de token
const { generarJWT, comprobarJWT } = require('../ayudas/jwt');
const { cifrarTexto } = require("../ayudas/cifrado")
const { crearVehciulo } = require("../ayudas/cifrado");
const Vehiculo = require('../modelo/Vehiculo_modelo');
const Servicio = require('./servicio_controlador')



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

        usuario.contrasenia = cifrarTexto(contrasenia.toString());

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

        usuario.correo = correo != null || correo != undefined ? correo : usuario.correo;
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


/**
 * 
 * @param {*} req Request con uid del partner
 * @param {*} res Respons del partner y el nuevo token
 */
const renovarToken = async(req, res = response) => {

    const uid = req.uid;

    const token = await generarJWT(uid);

    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuario,
        token
    });

}


const cambiarContrasenia = async(req, res = response) => {
    try {
        const uid = req.uid;
        const { contrasenia } = req.body;
        const usuario = await Usuario.findById(uid);
        console.log(uid);
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }
        usuario.contrasenia = cifrarTexto(contrasenia);
        usuario.cambiarContrasenia = 0;
        usuario.save();
        res.json({
            ok: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}

const cambiarContraseniaAdmin = async(req, res = response) => {
    try {
        const uid = req.body.uid;
        const { contrasenia } = req.body;
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }
        usuario.contrasenia = cifrarTexto(contrasenia);
        usuario.cambio_contrasenia = 0;
        console.log(usuario);
        usuario.save();
        res.json({
            ok: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}


const agregarVehiculo = async(req, res = response) => {

    try {

        const { uid, cedula, placa } = req.body;
        const usuario = await Usuario.findOne({ cedula });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }
        const vehiculoExistente = await Vehiculo.findOne({ placa });

        if (vehiculoExistente) {
            return res.status(400).json({
                ok: false,
                msg: ' Ya existe el vehiculos'
            });
        }

        const vehiculo = new Vehiculo(req.body);
        await vehiculo.save();
        usuario.vehiculos.push({ vehiculoId: vehiculo._id });
        await usuario.save();

        res.json({
            ok: true,
            vehiculo
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}


const agregarServicio = async(req, res = response) => {
    
    try {

        const { uid } = req.body;
        const usuario = await Usuario.findById(uid);        
        let servicio = req.body == undefined || req.body == null ? req.query : req.body;

        let servicioId = await Servicio.crearServicio(servicio);
        if(!servicioId){
            res.json({
                ok: false,
                msg: "No se pudo creear intente mas tarde"
            });
        }
        
        await usuario.servicios.push({servicioId });
        await usuario.save();
        
        res.json({
            ok: true
        });
        
    } catch (error) {
        console.error(error);
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
    cambiarEstadoUsuario,
    renovarToken,
    cambiarContrasenia,
    agregarVehiculo,
    cambiarContraseniaAdmin,
    agregarServicio
}