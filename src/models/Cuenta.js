const db = require('../config/db');

const obtenerCuentaPorCliente = async (id_cliente) =>
{
    const [cuentas] = await db.query(
        `SELECT 
            id_cuenta,
            saldo,
            saldo_inmovilizado
        FROM 
            cuenta
        WHERE 
            id_cliente = ?`,
        [id_cliente]
    );

    return cuentas.length > 0 ? cuentas[0] : null;

}

//PASO 4 CONVERSACION
const verificarSaldoDisponible = async (id_cliente, monto) => {
    const cuenta = await obtenerCuentaPorCliente(id_cliente);

    if (!cuenta) {
        return {
            ok: false,
            mensaje: "El cliente no tiene cuenta bancaria asignada."
        };
    }

    if (cuenta.saldo < monto) {
        return {
            ok: false,
            mensaje: `Saldo insuficiente. Tu saldo actual es de $${cuenta.saldo}`,
            cuenta
        };
    }

    return {
        ok: true,
        cuenta
    };
};

const consultarSaldo = async (id_cliente) => {
    const cuenta = await obtenerCuentaPorCliente(id_cliente);
    return cuenta ? cuenta.saldo : null;
};

const devolverSaldoInmovilizado = async (id_cuenta,monto,conexion) => {
    await conexion.query(
        `UPDATE cuenta
         SET saldo = saldo + ?, saldo_inmovilizado = saldo_inmovilizado - ?
         WHERE id_cuenta = ?`,
         [monto,monto,id_cuenta]
    )
};


const verificarCuentaDestino = async (cbuAliasDestino) => {
    const [resultados] = await db.query(
        // Utilizamos CALL para ejecutar el procedimiento almacenado
        `CALL sp_verificar_cuenta_destino(?)`,
        [cbuAliasDestino]
    );

    // mysql2 devuelve los resultados del procedimiento almacenado en la primera posición del arreglo
    const cuentas = resultados[0];

    if (cuentas.length === 0) {
        return {
            ok: false,
            mensaje: "La cuenta de destino no existe."
        };
    }

    return {
        ok: true,
        cuentaDestino: cuentas[0]
    };
};


const debitarSaldo = async (id_cuenta, monto, conexion) => {
    await conexion.query(
        `CALL sp_debitar_saldo(?, ?)`,
        [monto, id_cuenta]
    );
};

const acreditarSaldo = async (id_cuenta, monto, conexion) => {
    await conexion.query(
        `CALL sp_acreditar_saldo(?, ?)`,
        [monto, id_cuenta]
    );
};



module.exports = {
    obtenerCuentaPorCliente,
    verificarSaldoDisponible,
    devolverSaldoInmovilizado,
    consultarSaldo,
    verificarCuentaDestino,
    debitarSaldo,
    acreditarSaldo
};