const transferenciaService = require ('../services/transferenciaService');

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
            mensaje: error.mensaje || "Ocurrió un error, no se pudo realizar la transferencia."
        });
    }

};

module.exports = {
    realizarTransferencia
};