// Importaciones externas
const { Router, response } = require('express');
const { check } = require('express-validator');

// Importaciones del proyecto
const { validarCampos } = require('../middlewares/validar_campos_middlewares');
const { validarJWT } = require('../middlewares/validar_jwt_middlewares');

const { buscarUsuario, cambiarEstadoUsuario, traerTodosUsuarios, actualizarUsuario, renovarToken, agregarVehiculo, agregarServicio } = require('../controladores/usuario_controlador');
const { traerVehciulos, cambiarEstadoVehciulo, actualizarVehciulo, buscarVehiculoPorPlaca } = require('../controladores/vehiculo_controlador');
const { traerTodosServicios, crearServicio, cambiarEstadoServicio } = require('../controladores/servicio_controlador');

const router = Router();


/**
 * Post -> Agregar 
 * Put -> Actualizar
 */


router.get('/usuario/traerUsuario/:uid', [
    check('uid', 'El uid es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
], buscarUsuario);

router.post('/usuario/cambiarEstadoUsuario', [
    check('uid', 'El uid es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
], cambiarEstadoUsuario);

router.get('/usuario/listaUsuarios', [
    validarCampos,
    validarJWT
], traerTodosUsuarios);

router.post('/usuario/actualizarUsuario', [
    check('uid', 'El uid es obligatorio').notEmpty(),
    check('correo', 'El correo es obligatorio').notEmpty().isEmail(),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('apellido', 'El apellido es obligatorio').notEmpty(),
    check('celular', 'El celular es obligatorio').notEmpty(),
    validarCampos,
    validarJWT
], actualizarUsuario);

//  Ruta completa : /web/vehiculos/agregarVehiculo
router.post('/vehiculos/agregarVehiculo', [
    check('placa', 'El placa es obligatorio').notEmpty(),
    check('tipoVehiculo', 'El tipoVehiculo es obligatorio').notEmpty().isNumeric().matches(/(1|2|3)/),
    check('color', 'El color es obligatorio').notEmpty().isString(),
    check('marca', 'El marca es obligatorio').notEmpty().isString(),
    check('anio', 'El anio es obligatorio y no puede ser un numero').notEmpty().isNumeric(),
    check('modelo', 'El modelo es obligatorio').notEmpty().isString(),
    check('cedula', 'El cedula es obligatorio y no puede ser numero').notEmpty().isNumeric(),
    validarCampos,
    validarJWT
], agregarVehiculo);

//  Ruta completa : /web/vehiculos/listarVehiculos
router.get('/vehiculos/listarVehiculos', [
    validarCampos,
    validarJWT
], traerVehciulos);

router.put('/vehiculos/cambiarEstado/:uid' , [
    validarCampos,
    validarJWT
], cambiarEstadoVehciulo);


router.put('/vehiculos/actualizarVehiculo/:uid' , [
    validarCampos,
    validarJWT
], actualizarVehciulo);

router.get('/vehiculos/buscarVehiculo/:placa' , [
    validarCampos,
    validarJWT
], buscarVehiculoPorPlaca)

router.get('/servicio/listarServicio', [
    validarCampos,
    validarJWT
], traerTodosServicios);

router.put('/servicio/cambiarEstado/:uid' , [
    validarCampos,
    validarJWT
], cambiarEstadoServicio);

module.exports = router;











