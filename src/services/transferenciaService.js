const db = require('../config/db');
const Transferencia = require('../models/Transferencia');
const Cuenta = require('../models/Cuenta');

// VALIDAR MONTO TRANSFERENCIA
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

const realizarTransferencia = async (
    id_cliente,
    cbuAliasDestino,
    monto,
    id_concepto_transferencia
) => {

    // 1. Validar monto
    const validacionMonto = Transferencia.validarMontoTransferencia(monto);
    if (!validacionMonto.ok) {
        throw new Error(validacionMonto.mensaje);
    }

    const montoValidado = validacionMonto.monto;

    // 2. Validar concepto seleccionado
    const validacionConcepto = await Transferencia.validarConceptoTransferencia(id_concepto_transferencia);
    if (!validacionConcepto.ok) {
        throw new Error(validacionConcepto.mensaje);
    }

    // 3. Verificar saldo disponible de la cuenta origen
    const validacionSaldo = await Cuenta.verificarSaldoDisponible(id_cliente, montoValidado);
    if (!validacionSaldo.ok) {
        throw new Error(validacionSaldo.mensaje);
    }

    const cuentaOrigen = validacionSaldo.cuenta;

    // 4. Verificar cuenta destino
    const validacionDestino = await Cuenta.verificarCuentaDestino(cbuAliasDestino);
    if (!validacionDestino.ok) {
        throw new Error(validacionDestino.mensaje);
    }

    const cuentaDestino = validacionDestino.cuentaDestino;

    // 5. Evitar transferencias a la misma cuenta
    if (cuentaOrigen.id_cuenta === cuentaDestino.id_cuenta) {
        throw new Error("No podés transferirte dinero a tu propia cuenta.");
    }

    // 6. Realizar transferencia dentro de una transacción
    const conexion = await db.getConnection();

    try {
        await conexion.beginTransaction();

        await Cuenta.debitarSaldo(
            cuentaOrigen.id_cuenta,
            montoValidado,
            conexion
        );

        await Cuenta.acreditarSaldo(
            cuentaDestino.id_cuenta,
            montoValidado,
            conexion
        );

        const transferenciaRegistrada = await Transferencia.registrarTransferencia(
            cuentaOrigen.id_cuenta,
            cuentaDestino.id_cuenta,
            montoValidado,
            id_concepto_transferencia,
            conexion
        );

        await conexion.commit();

        return {
            id_transferencia: transferenciaRegistrada.id_transferencia,
            codigo_operacion: transferenciaRegistrada.codigo_operacion,
            id_cuenta_origen: cuentaOrigen.id_cuenta,
            id_cuenta_destino: cuentaDestino.id_cuenta,
            cbu_destino: cuentaDestino.cbu,
            alias_destino: cuentaDestino.alias,
            monto: montoValidado,
            concepto: validacionConcepto.concepto.nombre,
            saldo_restante: cuentaOrigen.saldo - montoValidado
        };

    } catch (error) {
        await conexion.rollback();
        throw error;
    } finally {
        conexion.release();
    }
};

module.exports = {
    realizarTransferencia,
    validarMontoTransferencia
};