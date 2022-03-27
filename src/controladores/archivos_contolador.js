const { response } = require('express');
const fileUpload = require('express-fileupload');
var fs = require('fs');
const Usuario_modelo = require('../modelo/Usuario_modelo');
const { TipoDocumento } = require('../utils/enums/tipo_documento_enum')


const cargarArchivo = async (req, res = response) =>  {

    const uid = req.uid; 
    const { tipoDocumento } = req.body;

    var ruta = process.env.RUTA_IMAGENES;

    ruta = ruta + uid + '/';
    
    if(tipoDocumento == TipoDocumento.LicenciaConduccion.codigo ){
        
        if (!fs.existsSync(ruta)) {
            fs.mkdirSync(ruta, { recursive: true });
        }
        ruta = ruta + TipoDocumento.LicenciaConduccion.nombre + uid + TipoDocumento.LicenciaConduccion.extencion;
    }

    let EDFile = req.files.file;

    const usuario = await Usuario_modelo.findById(uid);
    usuario.fotoLicencia = ruta;
    await usuario.save();

    EDFile.mv(ruta, err => {
        if (err) return res.status(500).send({ message: err });
        return res.status(200).send({ ok:true,ruta: ruta });
    });

}


const enviarImagen = (req, res = response) => {

    try {

        const { id, tipoUsuario } = req.body;

        var ruta = darRuta(req);

        ruta = ruta + '/' + id;
        const tipoFoto = req.body.partnerTipoFotos;
        if (tipoFoto != 2) {
            ruta = ruta + ".png";
        } else {
            ruta = ruta + ".mp4";
        }
        ruta = ruta.substr(7);
        console.log(ruta);
        res.json({
            ok: true,
            ruta
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }

}



module.exports = {
    cargarArchivo,
    enviarImagen
}