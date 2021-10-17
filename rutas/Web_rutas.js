// Importaciones externas
const { Router, response } = require('express');
const { check } = require('express-validator');

// Importaciones del proyecto
const { validarCampos } = require('../middlewares/validar_campos_middlewares');
const { validarJWT } = require('../middlewares/validar_jwt_middlewares');

const { buscarUsuario, cambiarEstadoUsuario, traerTodosUsuarios, actualizarUsuario, renovarToken } = require('../controladores/usuario_controlador');


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




module.exports = router;