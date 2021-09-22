const { validationResult } = require("express-validator");


/**
 * Valida que los campos que se reciben tengan las condiciones que se aplican
 * @param {*} req La peticion 
 * @param {*} res un calor de status
 * @param {*} next Continua con la sigunete validacion 
 * @returns 
 */
const validarCampos = (req, res, next) => {

    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errores: errores.mapped()
        });
    }

    next();
}

module.exports = {
    validarCampos
}