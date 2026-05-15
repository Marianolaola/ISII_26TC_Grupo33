const validarMontoExtraccion = (monto) => {
    const montoNumerico = Number(monto);

    if (!montoNumerico || isNaN(montoNumerico)) {
        return {
            ok: false,
            mensaje: "El monto ingresado no es válido."
        };
    }

    if (montoNumerico < 10000) {
        return {
            ok: false,
            mensaje: "El monto mínimo de extracción es $10.000."
        };
    }

    if (montoNumerico % 10000 !== 0) {
        return {
            ok: false,
            mensaje: "El monto debe ser múltiplo de $10.000."
        };
    }

    return {
        ok: true,
        monto: montoNumerico
    };
};

module.exports = {
    validarMontoExtraccion
};


