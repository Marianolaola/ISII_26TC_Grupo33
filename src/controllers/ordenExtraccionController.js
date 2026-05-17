const ordenExtraccionService = require('../services/ordenExtraccionService');
const OrdenExtraccion = require('../models/OrdenExtraccion');

const procesarSolicitudExtraccion = async (req, res) => {
    const { id_cliente, monto } = req.body;

    if (!id_cliente || !monto) {
        return res.status(400).json({
            ok: false,
            mensaje: "Datos faltantes o inválidos"
        });
    }

    try {
        const resultado = await ordenExtraccionService.procesarSolicitudExtraccion(id_cliente, monto);

        res.json({
            ok: true,
            mensaje: "Extracción generada con éxito.",
            datos: resultado
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.message
        });
    }
};



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
        
        const resultado = await ordenExtraccionService.cancelarOrdenExtraccion(id_orden);
        
        res.json({ 
            ok: true, 
            mensaje: resultado.mensaje 
        });
    
    } catch (error) {
        console.error("Error al cancelar:", error);
        res.status(400).json({ 
            ok: false, 
            mensaje: error.mensaje ||"No se pudo cancelar la orden." 
        });
    }
};

module.exports = {
    procesarSolicitudExtraccion,
    listarOrdenes,
    cancelarOrden
};