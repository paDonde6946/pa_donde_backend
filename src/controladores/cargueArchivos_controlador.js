const { response } = require('express');
const fileUpload = require('express-fileupload');
var fs = require('fs');
const { TipoArchivo, RutaArchivo } = require('../utils/enums/tipoArchivo_enum');


/**
 * Metodo el cual hace el carge de un archivo
 * @param {*} req En ella va el id del que lo ingresa y el tipo de usurio que es ademas de los parametro como 
 * @param {*} res Devuelve si la imagen se pudo cargar correctamente o ocurrio algun error
 */
 const cargarArchivo = (req, res = response) => {

    const { id, tipoUsuario } = req.body;

    var ruta = '/imagenes/';
    if(TipoArchivo.LicenciaConduccion.codigo){
        ruta = ruta + '';
    }

    if (!fs.existsSync(ruta)) {
        fs.mkdirSync(ruta, { recursive: true });
    }

    ruta = ruta + '/' + id;
    const tipoFoto = req.body.partnerTipoFotos;
    if (tipoFoto != 2) {
        ruta = ruta + ".png";
    } else {
        ruta = ruta + ".mp4";
    }

    let EDFile = req.files.file;
    EDFile.mv(ruta, err => {
        if (err) return res.status(500).send({ message: err });
        return res.status(200).send({ message: ruta.substr(7) });
    });

}