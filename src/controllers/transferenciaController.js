const transferenciaService = require ('../services/transferenciaService');
const Cuenta = require('../models/Cuenta');
const realizarTransferencia = async (req, res) => {
    try {
        const {
            id_cliente,
            cbuAliasDestino,
            monto,
            id_concepto_movimiento
        } = req.body;

        if (!id_cliente || !cbuAliasDestino || !monto || !id_concepto_movimiento) {
            return res.status(400).json({
                ok: false,
                mensaje: "Datos faltantes o inválidos."
            });
        }


        const resultado = await transferenciaService.realizarTransferencia(
            id_cliente,cbuAliasDestino,
            monto,
            id_concepto_movimiento
        );

        res.json({
            ok: true,
            mensaje: "Transferencia realizada con éxito.",
            datos: resultado
        });

    }catch (error) {
        console.error("Error al realizar la transferencia:", error);

        res.status(400).json({
            ok: false,
            mensaje: error.message || "Ocurrió un error, no se pudo realizar la transferencia."
        });
    }

};


const verificarDestinoTransferencia = async (req, res) => {
    try {
        const { cbuAliasDestino } = req.params;

        if (!cbuAliasDestino) {
            return res.status(400).json({
                ok: false,
                mensaje: "Debe ingresar un CBU o alias destino."
            });
        }

        const resultado = await Cuenta.verificarCuentaDestino(cbuAliasDestino);

        if (!resultado.ok) {
            return res.status(400).json(resultado);
        }

        res.json({
            ok: true,
            cuentaDestino: resultado.cuentaDestino
        });

    } catch (error) {
        console.error("Error al verificar destino:", error);

        res.status(500).json({
            ok: false,
            mensaje: "No se pudo verificar la cuenta destino."
        });
    }
};


module.exports = {
    realizarTransferencia,
    verificarDestinoTransferencia
};