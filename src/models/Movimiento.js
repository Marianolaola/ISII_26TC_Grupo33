const db = require('../config/db');

const validarMontoTransferencia = (monto) => {
    const montoNumerico = Number(monto);

    if(!montoNumerico || isNaN(montoNumerico)) {
        return {
            ok: false,
            mensaje: "El monto ingresado no es válido"
        };
    }

    if (montoNumerico <= 0) {
        return {
            ok: false,
            mensaje: "El monto debe ser mayor a cero."
        };
    }

    return {
        ok: true,
        monto: montoNumerico
    };
};

const validarConceptoMovimiento = async (id_concepto_movimiento) => {
    const [conceptos] = await db.query(
        `SELECT id_concepto_movimiento, nombre
        FROM concepto_movimiento
        WHERE id_concepto_movimiento = ?`,
        [id_concepto_movimiento]
    );

    if (conceptos.length === 0) {
        return {
            ok: false, 
            mensaje: "El concepto seleccionado no es válido."
        };
    }

    return {
        ok: true,
        concepto: conceptos[0]
    };
}


const registrarMovimientoTransferencia = async (
    id_cuenta_origen,
    id_cuenta_destino,
    monto,
    id_concepto_movimiento,
    conexion
) => {
    await conexion.query(
        `INSERT INTO movimiento
        (id_cuenta_origen, id_cuenta_destino, id_tipo_movimiento, monto, fecha_hora, id_concepto_movimiento)
        VALUES (?,?,1,?, NOW(), ?)`,
        [id_cuenta_origen, id_cuenta_destino, monto, id_concepto_movimiento]
    );
};

module.exports = {
    validarMontoTransferencia,
    validarConceptoMovimiento,
    registrarMovimientoTransferencia
}
