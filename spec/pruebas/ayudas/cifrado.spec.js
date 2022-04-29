var {cifrarTexto, compararCifrado} = require("../../../src/ayudas/cifrado");

describe("Cifrado de texto funcional", () => {
    it("Cifrar un texto", () => {
        var clave = "Ejemplo2"
        expect(cifrarTexto(clave)).not.toEqual(clave);
    })

    it("Comparar texto", () =>{
        var texto = "Hernan2001!"
        var textoCifrado = "$2b$10$gki7.2zfWxVqHAoM0GPfbOwDKO6kV.uBKJwTLdIlkBMNVI0oueQs6"
        expect(compararCifrado(texto, textoCifrado)).toBeTrue();
        expect(compararCifrado(textoCifrado, texto)).toBeFalse();

    })

});