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





const cancelarOrdenYDevolverPlata = async (id_orden) => {
    // Pedimos exclusividad para la transacción
    //Se bloquea el acceso a esa cuenta mientras se procesa
    const conexion = await db.getConnection();

    try {
        await conexion.beginTransaction();

        // 1. Buscamos de cuánto era la orden y de qué cuenta salió
        const [ordenes] = await conexion.query(
            'SELECT monto, id_cuenta, id_estado_orden FROM orden_extraccion WHERE id_orden = ?',
            [id_orden]
        );

        // Si no existe o no está en estado 1 (Pendiente), cortamos todo
        if (ordenes.length === 0 || ordenes[0].id_estado_orden !== 1) {
            throw new Error("La orden no se puede cancelar porque no está Pendiente.");
        }

        const { monto, id_cuenta } = ordenes[0];

        // 2. Cambiamos el estado a 4 (Cancelada)
        await conexion.query(
            'UPDATE orden_extraccion SET id_estado_orden = 4 WHERE id_orden = ?',
            [id_orden]
        );

        // 3. El camino inverso: Sumamos al saldo disponible, restamos del inmovilizado
        await conexion.query(
            'UPDATE cuenta SET saldo = saldo + ?, saldo_inmovilizado = saldo_inmovilizado - ? WHERE id_cuenta = ?',
            [monto, monto, id_cuenta]
        );

        // Todo salió bien, guardamos
        await conexion.commit();
        return true;

    } catch (error) {
        // Si algo falla, deshacemos
        await conexion.rollback();
        throw error;
    } finally {
        conexion.release();
    }
};

module.exports = {
    obtenerCuentaPorCliente,
    verificarSaldoDisponible,
    consultarSaldo,
    cancelarOrdenYDevolverPlata
};