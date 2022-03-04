// Libreria para cifra
const Cifrar = require('bcrypt');

const cifrarTexto = (texto) => {
    const salt = Cifrar.genSaltSync();
    var cifrado = Cifrar.hashSync(texto.toString(), salt);
    return cifrado;
}

const compararCifrado = (texto1, texto2) => {
    return Cifrar.compareSync(texto1, texto2);
}

module.exports = {
    cifrarTexto,
    compararCifrado
}