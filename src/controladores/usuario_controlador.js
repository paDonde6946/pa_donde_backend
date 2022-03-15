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
const VehiculosControlador = require('./vehiculo_controlador');
const { EstadoViaje } = require('../utils/enums/estadoViaje_enum');
const { compararCifrado } = require("../ayudas/cifrado")


const crearUsuario = async (req, res = response) => {

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

const buscarUsuario = async (req, res = response) => {

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

const buscarUsuarioCedula = async (req, res = response) => {

    try {
        const { cedula } = req.params;
        const usuario = await Usuario.find({ cedula: cedula });

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

const traerTodosUsuarios = async (req, res = response) => {

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

const actualizarUsuario = async (req, res = response) => {

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

const cambiarEstadoUsuario = async (req, res = response) => {

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
const renovarToken = async (req, res = response) => {

    const uid = req.uid;

    const token = await generarJWT(uid);

    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuario,
        token
    });

}


const cambiarContrasenia = async (req, res = response) => {
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

const cambiarContraseniaAdmin = async (req, res = response) => {
    try {
        console.log(req.body);
        const uid = req.body.uid;
        const { contrasenia } = req.body;
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }
        console.log(req.body.contraseniaActual);
        if (req.body.contraseniaActual != undefined) {

            const comparar = compararCifrado(req.body.contraseniaActual, usuario.contrasenia);

            if (comparar) {
                usuario.contrasenia = cifrarTexto(contrasenia);
                usuario.cambio_contrasenia = 0;
                usuario.save();
                res.json({
                    ok: true
                });
            } else {

                res.status(500).json({
                    ok: false,
                    msg: 'Las contrasenias no coinciden.'
                })
            }
        } else {
            usuario.contrasenia = cifrarTexto(contrasenia);
            usuario.cambio_contrasenia = 0;
            usuario.save();
            res.json({
                ok: true
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}

const agregarVehiculo = async (req, res = response) => {

    try {

        const { placa } = req.body;
        const usuario = await Usuario.findById(req.uid);
        const vehiculoExistente = await Vehiculo.findOne({ placa: placa });

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

const listarVehiculosPorUid = async (req, res = response) => {

    try {
        const uid = req.uid;
        const vehiculosBD = await Usuario.findById(uid, 'vehiculos').populate('vehiculos', null, { estado: Estado.Activo });

        res.json({
            ok: true,
            vehiculos: vehiculosBD.vehiculos
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }

}

const agregarServicio = async (req, res = response) => {
    try {
        const creacionServicio = await ServicioControlador.crearServicio(req.body);
        if (creacionServicio.rs) {
            let user = await Usuario.findById(req.uid);
            user.servicios.push(creacionServicio.msg);
            user.historialDestino = req.body.historialDestino;
            user.historialOrigen = req.body.historialOrigen;
            log.info(JSON.stringify(req.historialOrigen));

            log.info(JSON.stringify(user));
            await user.save();
            res.json({
                ok: true,
                msg: "Su servicio fue creado exitosamente."
            });
        } else {
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

const separaCupo = async (req, res = response) => {

    try {
        let separacion = await ServicioControlador.agregarCupo(req.uid, req.body.idServicio);

        if (separacion == true) {
            res.json({
                ok: true,
                msg: "Su cupo fue apartado exitosamente."
            });
        } else {
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

const darServiciosCreados = async (req, res = response) => {

    try {
        const uid = req.uid;
        const servicios = await Usuario.findById(uid, 'servicios').
        populate(
            {
                path: 'servicios',
                populate: {
                  path: 'pasajeros.pasajero',
                  select: 'nombre' 
                }, 
                match: { $or :[{ estado: EstadoViaje.Camino }, { estado: EstadoViaje.Esperando }]}
            }).sort({'servicios.fechayhora': 1});

        let pasajeros = [];


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

const darServiciosPostulados = async (req, res = response) => {

    try {
        const uid = req.uid;
        const serviciosAux = await Servicio.find({'pasajeros.pasajero': uid , $or :[{ estado: EstadoViaje.Camino }, { estado: EstadoViaje.Esperando }]}, null, {sort: {fechayhora: 1}})
        .populate('pasajeros.pasajero', 'nombre');
        var servicios = [];


        for (let index = 0; index < serviciosAux.length; index++) {
            const servicio = serviciosAux[index];
            const conductor = await Usuario.find({servicios: servicio._id});
            servicios.push({ 
                uid: servicio._id,
                nombreOrigen: servicio.nombreOrigen,
                nombreDestino: servicio.nombreDestino,
                polylineRuta: servicio.polylineRuta,
                fechayhora: servicio.fechayhora,
                idVehiculo: servicio.idVehiculo,
                cantidadCupos: servicio.cantidadCupos,
                distancia: servicio.distancia,
                duracion: servicio.duracion,
                idAuxilioEconomico: servicio.idAuxilioEconomico,
                estado: servicio.estado,
                pasajeros: servicio.pasajeros,
                nombreConductor: conductor[0].nombre
            });
            
        }

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

const darServiciosDisponibles = async (req, res = response) => {

    try {
        const uid = req.uid;
        const serviciosPostulados = await Servicio.find({ 'pasajeros.pasajero': uid, $or: [{ estado: EstadoViaje.Camino }, { estado: EstadoViaje.Esperando }] }, 'uid', { sort: { fechayhora: 1 } });
        const serviciosPropios = await Usuario.findById(uid, 'servicios').populate('servicios', uid, { $or: [{ estado: EstadoViaje.Camino }, { estado: EstadoViaje.Esperando }] }, { sort: { fechayhora: 1 } });
        const serviciosExcluidos = [];
        serviciosPostulados.forEach(element => {
            serviciosExcluidos.push(element);
        });
        serviciosPropios.servicios.forEach(element => {
            serviciosExcluidos.push(element);
        });
        let serviciosDisponibles = [];
        if (serviciosExcluidos.length == 0) {
            serviciosDisponibles = await Servicio.find({ $or: [{ estado: EstadoViaje.Camino }, { estado: EstadoViaje.Esperando }] }, null, { sort: { fechayhora: 1 } })
        } else {
            serviciosDisponibles = await Servicio.find({ $nor: serviciosExcluidos, $or: [{ estado: EstadoViaje.Camino }, { estado: EstadoViaje.Esperando }] }, null, { sort: { fechayhora: 1 } })
        }
        res.json({
            ok: true,
            servicios: serviciosDisponibles
        });
    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }

}

const darHistorial = async (req, res = response) => {

    try {
        const uid = req.uid;
        const serviciosComoConductor = await Usuario.findById(uid, 'servicios').populate('servicios', null, { estado: EstadoViaje.Finalizado }, { sort: { fechayhora: -1 } });
        const serviciosComoUsuario = await Servicio.find({ 'pasajeros.pasajero': uid, estado: EstadoViaje.Finalizado }, null, { sort: { fechayhora: -1 } });
        console.log(serviciosComoUsuario.servicios);
        res.json({
            ok: true,
            serviciosComoConductor: (serviciosComoConductor.servicios == undefined) ? [] : serviciosComoConductor.servicios,
            serviciosComoUsuario: (serviciosComoUsuario.servicios == undefined) ? [] : serviciosComoUsuario.servicios
        });

    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }

}

const eliminarServicio = async (req, res = response) => {
    try {

        const uid = req.uid;
        const { uidServicio } = req.params;
        let eliminarEnServicio = ServicioControlador.eliminarServicio(uidServicio);
        const usuario = await Usuario.findById(uid);
        usuario.servicios = usuario.servicios.filter((item) => item != uidServicio);
        usuario.save();
        res.json({
            ok: true,
            msg: 'Su servicio se elimino correctamente'
        });

    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }

}

const editarServicio = async (req, res = response) => {
    try {
        const uid = req.uid;
        const { uidServicio } = req.params;
        let editar = ServicioControlador.editarServicio(uidServicio, req.body);
        if (editar = ! true) {
            log.error(req.uid, req.body, req.params, req.query, quitarCupo);
            res.json({
                ok: false,
                msg: 'Intente mas tarde'
            });
        }
        res.json({
            ok: true,
            msg: 'Su servicio se edito correctamente.'
        });

    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }
}

const desPostularse = async (req, res = response) => {

    try {
        const uid = req.uid;
        const { uidServicio } = req.body;
        let quitarCupo = ServicioControlador.quitarCupo(uid, uidServicio);
        if (quitarCupo = ! true) {
            log.error(req.uid, req.body, req.params, req.query, quitarCupo);
            res.json({
                ok: false,
                msg: 'Intente mas tarde'
            });
        }

        res.json({
            ok: true,
            msg: 'Tu cupo se ha liberado correctamente'
        });

    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }

}

const calificarPasajero = async (req, res = response) => {
    try {
        const { uidServicio, uidPasajero, calificacion } = req.body;

        const servicio = await Servicio.findById(uidServicio);

        servicio.pasajeros.forEach(element => {
            if (element.pasajero == uidPasajero) {
                element.puntuacionPasajero = calificacion;
            }
        });
        await servicio.save();

        const usuario = await Usuario.findById(uidPasajero);
        usuario.sumatoriaCalificacionPasajero = usuario.sumatoriaCalificacionPasajero + calificacion;
        usuario.calificacionUsuario = usuario.sumatoriaCalificacionPasajero / usuario.numServiciosAdquiridos;
        await usuario.save();

        res.json({
            ok: true,
            msg: 'Gracias por tu calificacion'
        });
    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }
}
const calificarConductor = async (req, res = response) => {
    try {
        const uid = req.uid;
        const { uidServicio, calificacion } = req.body;
        const usuarios = await Usuario.find({ servicios: uidServicio });
        let uidUsuario = usuarios[0]._id;
        const usuario = await Usuario.findById(uidUsuario);
        usuario.sumatoriaCalificacionConductor = usuario.sumatoriaCalificacionConductor + calificacion;
        usuario.calificacionConductor = usuario.sumatoriaCalificacionConductor / usuario.numServiciosHechos;
        await usuario.save();

        const servicio = await Servicio.findById(uidServicio);
        servicio.pasajeros.forEach(element => {
            if (element.pasajero == uid) {
                element.puntuacionConductor = calificacion;
            }
        });
        await servicio.save();
        await Usuario.findByIdAndUpdate(uid, { ultimoServicioSinCalificar: null });

        res.json({
            ok: true,
            msg: 'Gracias por tu calificacion'
        });

    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }
}
const finalizarServicio = async (req, res = response) => {
    try {

        const uid = req.uid;
        const { uidServicio } = req.body;
        const servicio = await Servicio.findById(uidServicio);

        servicio.pasajeros.forEach(async element => {
            const usuario = await Usuario.findById(element.pasajero);
            usuario.ultimoServicioSinCalificar = uidServicio;
            usuario.numServiciosAdquiridos = usuario.numServiciosAdquiridos + 1;
            usuario.save();
        });

        servicio.estado = EstadoViaje.Finalizado;
        servicio.save();
        const usuario = await Usuario.findById(uid);
        usuario.numServiciosHechos = usuario.numServiciosHechos + 1;
        usuario.save();

        res.json({
            ok: true,
            msg: 'Servicio finalizado correctamente'
        });

    } catch (error) {
        log.error(req.uid, req.body, req.params, req.query, error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }
}

const iniciarServicio = async (req, res = response) => {
    try {
        const { uidServicio } = req.body;
        const servicio = await Servicio.findByIdAndUpdate(uidServicio, { estado: EstadoViaje.Camino });
        //TODO: Toca enviar la notificacion push
        res.json({
            ok: true,
            msg: 'Su servicio a iniciado correctamente'
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
    darServiciosDisponibles,
    darHistorial,
    desPostularse,
    editarServicio,
    eliminarServicio,
    calificarPasajero,
    calificarConductor,
    finalizarServicio,
    iniciarServicio,
    buscarUsuarioCedula
}