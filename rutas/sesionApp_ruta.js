// Importaciones externas
const { Router, response } = require('express');
const { check } = require('express-validator');

// Importaciones del proyecto
const { validarCampos } = require('../middlewares/validar_campos_middlewares');
const { validarJWT } = require('../middlewares/validar_jwt_middlewares');

const { loginUsuario, loginAdmin } = require('../controladores/ingreso_controlador');


const router = Router();


router.get('/usuario/:correo/:contrasenia', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('contrasenia', 'La clave es obligatoria').not().isEmpty(),
    validarCampos
], loginUsuario);

router.get('/admin/:correo/:contrasenia', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('contrasenia', 'La clave es obligatoria').not().isEmpty(),
    validarCampos
], loginAdmin);

module.exports = router;