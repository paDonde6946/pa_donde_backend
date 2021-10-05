// Importaciones externas
const { Router, response } = require('express');
const { check } = require('express-validator');

// Importaciones del proyecto
const { validarCampos } = require('../middlewares/validar_campos_middlewares');
const { validarJWT } = require('../middlewares/validar_jwt_middlewares');

const { loginUsuario, loginAdmin } = require('../controladores/ingreso_controlador');
const { crearUsuario } = require('../controladores/usuario_controlador');


const router = Router();


router.get('/usuario/:correo/:contrasenia', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('contrasenia', 'La clave es obligatoria').not().isEmpty(),
    validarCampos
], loginUsuario);

router.get('/admin', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('contrasenia', 'La clave es obligatoria').not().isEmpty(),
    validarCampos
], loginAdmin);

router.put('/usuario/registrar', [
    check('nombre', 'El nombre es obligatorio y solo se acepta texo').isString().not().isEmpty(),
    check('apellido', 'El apellido es obligatorio y solo se acepta texo').isString().not().isEmpty(),
    check('celular', 'El celular es obligatorio').isNumeric().not().isEmpty(),
    check('correo', 'El correo es obligatorio').isEmail().not().isEmpty(),
    check('contrasenia', 'El contrasenia es obligatorio').not().isEmpty(),
    validarCampos,
], crearUsuario)

module.exports = router;