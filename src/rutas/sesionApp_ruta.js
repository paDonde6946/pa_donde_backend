// Importaciones externas
const { Router, response } = require('express');
const { check } = require('express-validator');

// Importaciones del proyecto
const { validarCampos, validarCorreo } = require('../middlewares/validar_campos_middlewares');
const { validarJWT } = require('../middlewares/validar_jwt_middlewares');

const { loginUsuario, loginAdmin, olvidarContrasenia } = require('../controladores/ingreso_controlador');
const { crearUsuario, renovarToken, cambiarContraseniaAdmin } = require('../controladores/usuario_controlador');


const router = Router();


router.get('/usuario/:correo/:contrasenia/:tokenMensaje', [
    check('correo', 'El correo es obligatorio o no es permitido').isEmail().matches(/[a-z]*@unbosque.edu.co/),
    check('contrasenia', 'La clave es obligatoria').not().isEmpty(),
    // validarCorreo,
    validarCampos
], loginUsuario);

router.get('/admin', [
    check('correo', 'El correo es obligatorio').isEmail().matches(/[a-z]*@unbosque.edu.co/),
    check('contrasenia', 'La clave es obligatoria').not().isEmpty(),
    validarCampos
], loginAdmin);

router.put('/usuario/registrar', [
    check('nombre', 'El nombre es obligatorio y solo se acepta texo').isString().not().isEmpty(),
    check('apellido', 'El apellido es obligatorio y solo se acepta texo').isString().not().isEmpty(),
    check('celular', 'El celular es obligatorio').isNumeric().not().isEmpty(),
    check('correo', 'El correo es obligatorio').isEmail().not().isEmpty().matches(/[a-z]*@unbosque.edu.co/),
    check('contrasenia', 'El contrasenia es obligatorio').not().isEmpty(),
    check('cedula', 'El cedula es obligatorio').not().isEmpty().isNumeric(),
    validarCampos,
], crearUsuario);


router.post('/admin/olvidarContrasenia', [
    check('correo', 'El correo es obligatorio').isEmail().not().isEmpty().matches(/[a-z]*@unbosque.edu.co/),
    validarCampos,
], olvidarContrasenia);

router.post('/olvidarContrasenia', [
    check('correo', 'El correo es obligatorio').isEmail().not().isEmpty().matches(/[a-z]*@unbosque.edu.co/),
    validarCampos,
], olvidarContrasenia);

router.post('/cambiarContraseniaAdmin', [
    check('contrasenia', 'El contrasenia es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
], cambiarContraseniaAdmin);

router.get('/renovarToken', validarJWT, renovarToken);

module.exports = router;