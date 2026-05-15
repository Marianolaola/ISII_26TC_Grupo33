const Cuenta = require('../models/Cuenta');
const OrdenExtraccion = require('../models/OrdenExtraccion');

const procesarSolicitudExtraccion = async (req,res) => {

    const {id_cliente, monto} = req.body;

    if (!id_cliente || !monto){
        return res.status(400).json ({
        ok: false,
        mensaje :  "Datos faltante o inválidos"})
    }

    try {
        console.log(`Llegó un pedido: Cliente ${id_cliente} quiere extraer $${monto}`);
        
        // Validamos el monto de extracción
        const validacionMonto = OrdenExtraccion.validarMontoExtraccion(monto);
        
        if (!validacionMonto.ok) {
            return res.status(400).json({
                ok: false,
                mensaje: validacionMonto.mensaje
            });
        }
        const montoValidado = validacionMonto.monto;


        const validacionSaldo = await Cuenta.verificarSaldoDisponible(id_cliente, montoValidado);

        if (!validacionSaldo.ok) {
            return res.status(400).json({
                ok: false,
                mensaje: validacionSaldo.mensaje
            });
        }
        const cuenta = validacionSaldo.cuenta;

        //Generamos Token Randomizado
        const token = OrdenExtraccion.generarToken();

        //Congelamos la plata y guardar la orden
        //Le pasamos el id_cuenta que se saca en la validacion anterior
        await OrdenExtraccion.registrarOrdenDeExtraccion(cuenta.id_cuenta, montoValidado,token);

        //Enviamos el token para armar el comprobante en pantalla

        res.json({
            ok: true,
            mensaje: "¡Hay fondos suficientes Extraccion generada con Éxito :)",
            datos: {
                token: token,
                monto_solicitado : montoValidado,
                saldo_restante: cuenta.saldo - montoValidado
            }
        });

    }catch (error) {
        console.error("Ups, hubo un problemita (grave) en la basesita de datos", error);
        res.status(500).json({ ok: false, 
                               mensaje: 'Error interno del server :/ ' });

    }

}



const listarOrdenes = async (req, res) => {
    try {
        const id_cliente = req.params.id;
        // Llamamos al modelo para traer las órdenes
        const ordenes = await OrdenExtraccion.obtenerOrdenesPorCliente(id_cliente);
        
        res.json({
            ok: true,
            ordenes: ordenes
        });
    } catch (error) {
        console.error("Error al listar órdenes:", error);
        res.status(500).json({ ok: false, mensaje: "Error al recuperar el historial" });
    }
};

const cancelarOrden = async (req, res) => {
    try {
        const { id_orden } = req.body;
        
        await OrdenExtraccion.cancelarOrdenExtraccion(id_orden);
        
        res.json({ ok: true, mensaje: "Orden cancelada y dinero devuelto al saldo." });
    } catch (error) {
        console.error("Error al cancelar:", error);
        res.status(500).json({ ok: false, mensaje: "No se pudo cancelar la orden." });
    }
};

module.exports = {
    procesarSolicitudExtraccion,
    listarOrdenes,
    cancelarOrden
};