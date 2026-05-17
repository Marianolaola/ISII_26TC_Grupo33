const db = require('../config/db');
const Cuenta = require('./Cuenta');


const validarMontoExtraccion = (monto) => {
    const montoNumerico = Number(monto);

    if (!montoNumerico || isNaN(montoNumerico)) {
        return {
            ok: false,
            mensaje: "El monto ingresado no es válido."
        };
    }

    if (montoNumerico < 10000) {
        return {
            ok: false,
            mensaje: "El monto mínimo de extracción es $10.000."
        };
    }

    if (montoNumerico % 10000 !== 0) {
        return {
            ok: false,
            mensaje: "El monto debe ser múltiplo de $10.000."
        };
    }

    return {
        ok: true,
        monto: montoNumerico
    };
};

const obtenerOrdenesPorCliente = async (id_cliente) => {
    const [ordenes] = await db.query(
        `SELECT 
            o.id_orden, 
            o.token,
            o.monto, 
            o.fecha_generacion, 
            eo.nombre AS estado
         FROM 
            orden_extraccion o
         JOIN 
            cuenta cu ON o.id_cuenta = cu.id_cuenta
         JOIN 
            estado_orden eo ON o.id_estado_orden = eo.id_estado_orden
         WHERE 
            cu.id_cliente = ?
         ORDER BY o.fecha_generacion DESC`,
        [id_cliente]
    );
    return ordenes;
};


const registrarOrdenDeExtraccion = async (id_cuenta, monto, token) =>
{
    //Pedimos exclusividad para hacer la Transacción al 100%
    //Se bloquea el acceso a esa cuenta mientras se procesa
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

        //Si se llega hasta acá, quiere decir que funcionó
        //Confirmamos los cambios
        await conexion.commit();
        return true;

    } catch (error){
        //Algo falló, entonces se revierte todo, rollback
        await conexion.rollback();
        throw error;

    }finally {
        //Se abre la conexion nuevamente
        conexion.release();
    }
};

const obtenerOrdenesPorId = async (id_orden, conexion) =>{
    const [ordenes] = await conexion.query(
        `SELECT monto, id_cuenta, id_estado_orden
         FROM orden_extraccion
         WHERE id_orden = ?`,
         [id_orden]
    )

    return ordenes.length > 0 ? ordenes[0] : null;
};

const verificarOrdenPendiente = (orden) => {
    if (!orden) {
        throw new Error("La orden no existe.");
    }

    if (orden.id_estado_orden !== 1) {
        throw new Error("La orden no se puede cancelar porque no está Pendiente.");
    }
};

const marcarOrdenCancelada = async (id_orden, conexion) => {
    await conexion.query(
        `UPDATE orden_extraccion
         SET id_estado_orden = 4
         WHERE id_orden = ?`,
         [id_orden]
    );

};



const cancelarOrdenExtraccion = async (id_orden) => {
    // Pedimos exclusividad para la transacción
    //Se bloquea el acceso a esa cuenta mientras se procesa
    const conexion = await db.getConnection();

    try {
        await conexion.beginTransaction();

        // 1. Buscamos de cuánto era la orden y de qué cuenta salió
        const orden = await obtenerOrdenesPorId(id_orden, conexion);

        //Verificamos  que la orden exista y que esté Pendiente 
        verificarOrdenPendiente(orden);


        // 2. Cambiamos el estado a 4 (Cancelada)
        await marcarOrdenCancelada(id_orden, conexion);

        // 3. El camino inverso: Sumamos al saldo disponible, restamos del inmovilizado
        await Cuenta.devolverSaldoInmovilizado(
            orden.id_cuenta,
            orden.monto,
            conexion
        )

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


const generarToken = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
    validarMontoExtraccion,
    registrarOrdenDeExtraccion,
    generarToken,
    obtenerOrdenesPorCliente,
    cancelarOrdenExtraccion
};

