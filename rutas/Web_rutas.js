// Importaciones externas
const { Router, response } = require('express');
const { check } = require('express-validator');

// Importaciones del proyecto
const { validarCampos } = require('../middlewares/validar_campos_middlewares');
const { validarJWT } = require('../middlewares/validar_jwt_middlewares');

const { buscarUsuario, cambiarEstadoUsuario, traerTodosUsuarios, actualizarUsuario, renovarToken, agregarVehiculo } = require('../controladores/usuario_controlador');


const router = Router();


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


//  Ruta completa : /app/vehiculos/agregarVehiculo
router.post('/vehiculos/agregarVehiculo', [
    check('uid', 'El uid es obligatorio').notEmpty(),
    check('placa', 'El placa es obligatorio').notEmpty(),
    check('tipoVehiculo', 'El tipoVehiculo es obligatorio').notEmpty().isNumeric().matches(1 | 2 | 3),
    check('color', 'El color es obligatorio').notEmpty().isString(),
    check('marca', 'El marca es obligatorio').notEmpty().isString(),
    check('anio', 'El anio es obligatorio y no puede ser un numero').notEmpty().isNumeric(),
    check('modelo', 'El modelo es obligatorio').notEmpty().isString(),
    check('cedula', 'El cedula es obligatorio y no puede ser numero').notEmpty().isNumeric(),
    validarCampos,
    validarJWT
], agregarVehiculo);




module.exports = router;