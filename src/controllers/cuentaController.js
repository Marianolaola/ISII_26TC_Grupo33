const Cuenta = require('../models/Cuenta');

const consultarSaldo = async (req, res) => {
    try {
        const id_cliente = req.params.id;

        if (!id_cliente || isNaN(id_cliente)) {
            return res.status(400).json({
                ok: false,
                mensaje: "ID de cliente inválido"
            });
        }

        const saldo = await Cuenta.consultarSaldo(id_cliente);

        if (saldo === null) {
            return res.status(404).json({
                ok: false,
                mensaje: "Cuenta no encontrada"
            });
        }

        res.json({
            ok: true,
            saldo_real: saldo
        });

    } catch (error) {
        console.error("Error al consultar saldo:", error);
        res.status(500).json({
            ok: false,
            mensaje: "Error interno al consultar el saldo"
        });
    }
};

module.exports = {
    consultarSaldo
};