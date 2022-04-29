var {generarJWT, comprobarJWT} = require("../../../src/ayudas/jwt");

describe("JWT funcional", () => {

    beforeAll(() => { 
        require('dotenv').config();
    });

    it("JWT Generar Token", async() => {
        var uid ="6154ad4c46197bee55be9bd3"
        var result = await generarJWT(uid);
        expect(result).not.toBeNull()
    })

})