// TODO: Instalar
const jwt = require('jsonwebtoken');

/**
 * 
 * @param {*} req recibe dentro del header el token a validar
 * @param {*} res Si es no corecto el token
 * @param {*} next Continua con la siguinete validacion
 * @returns un status en caso de no ser una peticion valida
 */
const validarJWT = (req, res, next) => {

    //Leer el token
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.JWT_KEY);
        req.uid = uid;

        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
    }

}

module.exports = {
    validarJWT
}