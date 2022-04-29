var {dbConnection} = require("../../../src/basedatos/configuracion");

describe("Coneccion a la bd funcional", () => {

    beforeAll(() => { 
        require('dotenv').config();
    });

    it("Conexión a la base de datos", async() => {
        var resp = await dbConnection();
        expect(resp).toBeTrue()
    })
})
