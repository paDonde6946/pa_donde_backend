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
const Servicio = require('../modelo/Servicio_modelo');
const ServicioControlador = require('./servicio_controlador');
const AuxilioEconomico_modelo = require('../modelo/AuxilioEconomico_modelo');
const { Estado } = require('../utils/enums/estado_enum');
const log = require('../utils/logger/logger');
const VehiculosControlador = require('../controladores/vehiculo_controlador');
const { EstadoViaje } = require('../utils/enums/estadoViaje_enum');



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
        log.error(req.uid, req.body, req.params, req.query, error);
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

        const { placa } = req.body;
        const usuario = await Usuario.findById(req.uid);
        const vehiculoExistente = await Vehiculo.findOne({ placa: placa});

        if (vehiculoExistente) {
            return res.status(400).json({
                ok: false,
                msg: ' Ya existe el vehiculos'
            });
        }
        const vehiculo = await Vehiculo.create(req.body);
        usuario.vehiculos.push({ vehiculoId: vehiculo._id });
        await usuario.save();

        res.json({
            ok: true,
            msg: "Felicitaciones su vehiculo se agrego correctamente."
        });

    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}

const listarVehiculosPorUid = async(req, res = response) => {
    
    try {
        const uid  = req.uid;
        const vehiculosBD = await Usuario.findById(uid,'vehiculos').populate('vehiculos', null, { estado : Estado.Activo });
        
        res.json({
            ok: true,
            vehiculos:vehiculosBD.vehiculos
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
        const creacionServicio = await ServicioControlador.crearServicio(req.body);
        if(creacionServicio.rs){
            let user = await Usuario.findById(req.uid);
            user.servicios.push( creacionServicio.msg);
            user.historialDestino = req.body.historialDestino;
            user.historialOrigen = req.body.historialOrigen;
            log.info(JSON.stringify(req.historialOrigen));

            log.info(JSON.stringify(user));
            await user.save();
            res.json({
                ok: true,
                msg: "Su servicio fue creado exitosamente."
            });
        }else{
            log.error(req.uid, req.body, req.params, req.query, creacionServicio.msg);
            res.json({
                ok: false,
                msg: "Lo sentimos no pudimos atender su solicitud."
            });
        }

    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    } 
}

const separaCupo = async(req, res = response) => {

    try {
        const separacion = await ServicioControlador.agregarCupo(req.uid, req.body.idServicio);
        if(separacion == true){
            res.json({
                ok: true,
                msg: "Su cupo fue apartado exitosamente."
            });
        }else {
            log.error(req.uid, req.body, req.params, req.query, separacion);
            res.json({
                ok: true,
                msg: "Lo sentimos no pudimos atender su solicitud."
            });
        }


    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    } 

}

const darServiciosCreados = async(req, res = response) => {

    try {
        const uid = req.uid;
        const servicios = await Usuario.findById(uid, 'servicios').populate('servicios', null, {$or : [{ estado: EstadoViaje.Camino }, { estado: EstadoViaje.Esperando }]},{ sort: { fechayhora: 1}});
        res.json({
            ok: true,
            servicios: servicios.servicios
        });
        
    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    } 

}

const darServiciosPostulados = async(req, res = response) => {

    try {
        const uid = req.uid;
        const servicios = await Servicio.find({'pasajeros.pasajero': uid , $or :[{ estado: EstadoViaje.Camino }, { estado: EstadoViaje.Esperando }]}, null, {sort: {fechayhora: 1}});
        res.json({
            ok: true,
            servicios: servicios
        });

    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    } 

}

const darServiciosParaPostular = async(req, res = response) => {

    try {
        //  TODO

    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    } 

}

const darHistorial = async(req, res = response) => {

    try {
        const uid = req.uid;
        const serviciosComoConductor = await Usuario.findById(uid, 'servicios').populate('servicios', null, {estado: EstadoViaje.Finalizado},{ sort: { fechayhora: -1}});
        const serviciosComoUsuario = await Servicio.find({'pasajeros.pasajero': uid , estado: EstadoViaje.Finalizado}, null, {sort: {fechayhora: -1}});
        res.json({
            ok: true,
            serviciosComoConductor: serviciosComoConductor.servicios,
            serviciosComoUsuario : serviciosComoUsuario.servicios
        });

    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
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
    agregarServicio,
    listarVehiculosPorUid,
    separaCupo,
    darServiciosCreados,
    darServiciosPostulados,
    darHistorial
}