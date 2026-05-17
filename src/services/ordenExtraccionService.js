const Cuenta = require('../models/Cuenta');
const OrdenExtraccion = require('../models/OrdenExtraccion');

const procesarSolicitudExtraccion = async (id_cliente, monto) => {
    const validacionMonto = OrdenExtraccion.validarMontoExtraccion(monto);

    if (!validacionMonto.ok) {
        throw new Error(validacionMonto.mensaje);
    }

    const montoValidado = validacionMonto.monto;

    const validacionSaldo = await Cuenta.verificarSaldoDisponible(id_cliente, montoValidado);

    if (!validacionSaldo.ok) {
        throw new Error(validacionSaldo.mensaje);
    }

    const cuenta = validacionSaldo.cuenta;

    const token = OrdenExtraccion.generarToken();

    await OrdenExtraccion.registrarOrdenDeExtraccion(
        cuenta.id_cuenta,
        montoValidado,
        token
    );

    return {
        token: token,
        monto_solicitado: montoValidado,
        saldo_restante: cuenta.saldo - montoValidado
    };
};

const cancelarOrdenExtraccion = async (id_orden) => {

    if (!id_orden) {
        throw new Error("ID de orden inválido.");
    }

    await OrdenExtraccion.cancelarOrdenExtraccion(id_orden);

    return {
        id_orden: id_orden,
        mensaje: "Orden cancelada y dinero devuelto al saldo."
    };
};


module.exports = {
    procesarSolicitudExtraccion,
    cancelarOrdenExtraccion
};