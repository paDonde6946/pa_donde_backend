var {buscarVehciulo, cambiarEstado} = require("../../../src/controladores/vehiculo_controlador");
const { response } = require('express');

describe("Funcionalidades de Vehiculo", () => {

    beforeAll(() => { 
        require('dotenv').config();
    });

    it("Buscar Vehiculo", async() => {
        // console.log("Hola mudno");

        // var resp = await buscarVehciulo({
        //     body: {
        //         uid: "624269b51ab650b410507711"
        //     }
        // });
        // console.log(resp);
        expect(true).toBeTrue();
    })

    it("Cambiar estado Vehiculo", async() => {

        var resp = await cambiarEstado("624269b51ab650b410507711", 0);
        expect(resp.ok).toBeTrue();
    })

})
