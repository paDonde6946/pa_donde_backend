const jwt = require('jsonwebtoken');

/**
 * enera un JWT 
 * @param {*} uid El uid de la base de datos de la persona que esta pidiento el WT
 * @returns un JWT
 */
const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: '72h',
        }, (err, token) => {


            if (err) {
                console.log('if');
                reject('No se pugo generar el token');
            } else {
                resolve(token);
            }
        })
    });


}

/**
 * Verifica que si el token que recibe es correcto o no
 * @param {*} token El token a validar
 * @returns Un valor de true ne caso de ser aceptado o false si no 
 */
const comprobarJWT = (token = '') => {

    try {
        const { uid } = jwt.verify(token, process.env.JWT_KEY);
        return [true, uid];

    } catch (error) {
        return [false, null];
    }

}


module.exports = {
    generarJWT,
    comprobarJWT
}