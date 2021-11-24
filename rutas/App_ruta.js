// Importaciones externas
const { Router, response } = require('express');
const { check } = require('express-validator');

// Importaciones del proyecto
const { validarCampos } = require('../middlewares/validar_campos_middlewares');
const { validarJWT } = require('../middlewares/validar_jwt_middlewares');

const { cambiarContrasenia, actualizarUsuario, agregarVehiculo } = require('../controladores/usuario_controlador');
const { cambiarEstadoVehciulo } = require('../controladores/vehiculo_controlador')

const router = Router();


router.post('/cambiarContrasenia', [
    check('contrasenia', 'El contrasenia es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
], cambiarContrasenia);

router.post('/actualizarPerfil', [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('apellido', 'El apellido es obligatorio').notEmpty(),
    check('celular', 'El celular es obligatorio').notEmpty(),
    validarCampos,
    validarJWT
], actualizarUsuario);

//  Ruta completa : /app/agregarVehiculo
router.post('/agregarVehiculo', [
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


//  Ruta completa : /app/eliminarVehiculo
router.post('/eliminarVehiculo', [
    check('placa', 'El placa es obligatorio').notEmpty(),
    validarCampos,
    validarJWT
], cambiarEstadoVehciulo);



module.exports = router;