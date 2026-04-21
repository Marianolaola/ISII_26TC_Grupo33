const db = require('../config/db');

const obtenerCuentaPorUsuario = async (id_usuario) =>
{
    const [cuentas] = await db.query(
        `SELECT c.id_cuenta,
                c.saldo,
                c.saldo_inmovilizado
        FROM cuenta c
        JOIN usuario u ON c.id_cliente = u.id_cliente
        WHERE u.id_usuario = ?`,
        [id_usuario]
    );

    return cuentas.length > 0 ? cuentas[0] : null;

}


const registrarOrdenDeExtracción = async (id_cuenta, monto, token) =>
{
    //Pedimos exclusividad (ojala me pase) para hacer la Transacción
    const conexion = await db.getConnection();

    try{
        //Se empieza y no termina hasta que llegue al final
        await conexion.beginTransaction();
        
        //Se mueve la plata: Restamos del saldo normal y sumamos al inmovilizado
        await conexion.query
        (
            `UPDATE cuenta
             SET saldo = saldo - ?, saldo_inmovilizado = saldo_inmovilizado + ?
             WHERE id_cuenta = ?`,
             [monto, monto, id_cuenta]
        );
        //Se asume que Pendiente = 1
        //Guardamos el recibo (o sea la orden) con el token
        await conexion.query
        (
            `INSERT INTO orden_extraccion
            (id_cuenta, monto, token, id_estado_orden, fecha_generacion, fecha_vencimiento)
            VALUES (?,?,?,1, NOW(), DATE_ADD(NOW(), INTERVAL 24 HOUR))`,
            [id_cuenta,monto,token]
        );

        //Si se llega hasta acá, entonces no explotó nada
        //Confirmamos los cambios
        await conexion.commit();
        return true;

    } catch (error){
        //Algo falló (quizas se cortó la luz), entonces se revierte todo, rollback
        await conexion.rollback();
        throw error;

    }finally {
        //Se abre la conexion nuevamente
        conexion.release();
    }
};

const obtenerOrdenesPorUsuario = async (id_usuario) => {
    const [ordenes] = await db.query(
        `SELECT o.id_orden, o.monto, o.token, o.fecha_generacion, e.nombre as estado
         FROM orden_extraccion o
         JOIN cuenta c ON o.id_cuenta = c.id_cuenta
         JOIN usuario u ON c.id_cliente = u.id_cliente
         JOIN estado_orden e ON o.id_estado_orden = e.id_estado_orden
         WHERE u.id_usuario = ?
         ORDER BY o.fecha_generacion DESC`,
        [id_usuario]
    );
    return ordenes;
};

const anularOrdenYDevolverPlata = async (id_orden) => {
    // Pedimos exclusividad para la transacción
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
    obtenerCuentaPorUsuario,
    registrarOrdenDeExtracción,
    obtenerOrdenesPorUsuario,
    anularOrdenYDevolverPlata
};