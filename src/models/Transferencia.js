const crypto = require('crypto');
const db = require('../config/db');

const ESTADO_TRANSFERENCIA_COMPLETADA = 1;

const generarCodigoOperacion = () => {
    const fecha = new Date();

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minuto = String(fecha.getMinutes()).padStart(2, '0');
    const segundo = String(fecha.getSeconds()).padStart(2, '0');

    const aleatorio = crypto.randomBytes(4).toString('hex').toUpperCase();

    return `TRF-${anio}${mes}${dia}${hora}${minuto}${segundo}-${aleatorio}`;
};

const validarMontoTransferencia = (monto) => {
    const montoNumerico = Number(monto);

    if (!montoNumerico || isNaN(montoNumerico)) {
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

const validarConceptoTransferencia = async (id_concepto_transferencia) => {
    const [conceptos] = await db.query(
        `SELECT 
            id_concepto_transferencia,
            nombre
         FROM concepto_transferencia
         WHERE id_concepto_transferencia = ?`,
        [id_concepto_transferencia]
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
};

const obtenerConceptosTransferencia = async () => {
    const [conceptos] = await db.query(
        `SELECT 
            id_concepto_transferencia,
            nombre
         FROM concepto_transferencia
         ORDER BY nombre ASC`
    );

    return conceptos;
};

const registrarTransferencia = async (
    id_cuenta_origen,
    id_cuenta_destino,
    monto,
    id_concepto_transferencia,
    conexion
) => {
    const codigo_operacion = generarCodigoOperacion();

    const [resultado] = await conexion.query(
        `INSERT INTO transferencia
            (
                id_cuenta_origen,
                id_cuenta_destino,
                monto,
                codigo_operacion,
                fecha_hora,
                id_concepto_transferencia,
                id_estado_transferencia
            )
         VALUES (?, ?, ?, ?, NOW(), ?, ?)`,
        [
            id_cuenta_origen,
            id_cuenta_destino,
            monto,
            codigo_operacion,
            id_concepto_transferencia,
            ESTADO_TRANSFERENCIA_COMPLETADA
        ]
    );

    return {
        id_transferencia: resultado.insertId,
        codigo_operacion
    };
};

const obtenerTransferenciasPorCuenta = async (id_cuenta) => {
    const [transferencias] = await db.query(
        `SELECT 
            t.id_transferencia,
            t.id_cuenta_origen,
            t.id_cuenta_destino,
            t.monto,
            t.codigo_operacion,
            t.fecha_hora,
            t.id_concepto_transferencia,
            ct.nombre AS concepto,
            t.id_estado_transferencia,
            et.descripcion AS estado_transferencia
         FROM transferencia t
         INNER JOIN concepto_transferencia ct
            ON t.id_concepto_transferencia = ct.id_concepto_transferencia
         INNER JOIN estado_transferencia et
            ON t.id_estado_transferencia = et.id_estado_transferencia
         WHERE t.id_cuenta_origen = ?
            OR t.id_cuenta_destino = ?
         ORDER BY t.fecha_hora DESC`,
        [id_cuenta, id_cuenta]
    );

    return transferencias;
};

module.exports = {
    validarMontoTransferencia,
    validarConceptoTransferencia,
    obtenerConceptosTransferencia,
    registrarTransferencia,
    obtenerTransferenciasPorCuenta,
    generarCodigoOperacion
};