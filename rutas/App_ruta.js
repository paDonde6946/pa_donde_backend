// Importaciones externas
const { Router, response } = require('express');
const { check } = require('express-validator');

// Importaciones del proyecto
const { validarCampos } = require('../middlewares/validar_campos_middlewares');
const { validarJWT } = require('../middlewares/validar_jwt_middlewares');

const { cambiarContrasenia } = require('../controladores/usuario_controlador');


const router = Router();


router.post('/cambiarContrasenia', [
    check('contrasenia', 'El contrasenia es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
], cambiarContrasenia);




module.exports = router;