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



module.exports = {
    obtenerCuentaPorCliente,
    verificarSaldoDisponible,
    consultarSaldo
};