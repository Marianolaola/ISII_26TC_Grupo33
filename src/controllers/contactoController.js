const Contacto = require('../models/Contacto');

const agendarContacto = async (req, res) => {
    try {
        const { id_cliente, cbu_destinatario, nombre_contacto } = req.body;

        if (!id_cliente || !cbu_destinatario || !nombre_contacto) {
            return res.status(400).json({
                ok: false,
                mensaje: "Datos faltantes para agendar el contacto."
            });
        }

        const resultado = await Contacto.agendarContacto(
            id_cliente, 
            cbu_destinatario, 
            nombre_contacto
        );
        
        if (!resultado.ok) {
            return res.status(400).json(resultado);
        }

        res.json(resultado);

    }catch (error) {
        console.error("Error al agendar el contacto:", error);

        res.status(500).json({
            ok: false,
            mensaje: error.message || "No se pudo agendar el contacto."
        })
    }
};


const listarContactos = async (req, res) => {
    try {
        const id_cliente = req.params.id;

        if(!id_cliente) {
            return res.status(400).json({
                ok: false,
                mensaje: "ID de cliente inválido. Se requiere un ID de cliente válido para listar los contactos."
            });
        }

        const contactos = await Contacto.obtenerContactosPorCliente(id_cliente);

        res.json({
            ok: true,
            contactos
        })

    } catch (error) {
        console.error("Error al listar los contactos:", error);

        res.status(500).json({
            ok : false,
            mensaje: "No se pudieron obtener los contactos."
        });
    }
};

module.exports = {
    agendarContacto,
    listarContactos
}