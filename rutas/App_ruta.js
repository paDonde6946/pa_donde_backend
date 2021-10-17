// Importaciones externas
const { Router, response } = require('express');
const { check } = require('express-validator');

// Importaciones del proyecto
const { validarCampos } = require('../middlewares/validar_campos_middlewares');
const { validarJWT } = require('../middlewares/validar_jwt_middlewares');

const { cambiarContrasenia, actualizarUsuario } = require('../controladores/usuario_controlador');


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




module.exports = router;