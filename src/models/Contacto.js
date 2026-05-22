const db = require ('../config/db');

const verificarContactoExistente = async (id_cliente, cbu_destinatario) => {
    const [contactos] = await db.query(
        `SELECT
            id_contactos,
            id_cliente,
            cbu_destinatario,
            nombre_contacto
            FROM
            contacto
            WHERE id_cliente = ? AND cbu_destinatario = ?`,
            [id_cliente, cbu_destinatario]
    );

    return contactos.length > 0 ? contactos[0] : null;
}


const agendarContacto = async (id_cliente, cbu_destinatario, nombre_contacto) => {
    if(!id_cliente || !cbu_destinatario || !nombre_contacto) {
        return {
            ok: false,
            mensaje: "Datos faltantes para agendar el contacto."
        };
    }

    const contactoExistente = await verificarContactoExistente(id_cliente, cbu_destinatario);

    if (contactoExistente) {
        return {
            ok: false,
            mensaje: "El contacto ya existe en tu agenda.",
            contacto: contactoExistente
        };
    }

    const [resultado] = await db.query(
        `INSERT INTO contactos
        (id_cliente, cbu_destinatario, nombre_contacto)
        VALUES (?, ?, ?)`,
        [id_cliente, cbu_destinatario, nombre_contacto]
    );

    return {
        ok: true,
        mensaje : "Contacto agendado con éxito.",
        contacto: {
            id_contactos: resultado.insertId,
            id_cliente,
            cbu_destinatario,
            nombre_contacto
        }
    };
};


const obtenerContactosPorCliente = async (id_cliente) => {
    const [contactos] = await db.query(
        `SELECT
            *
        FROM contactos
        WHERE id_cliente = ?
        ORDER BY nombre_contacto ASC`,
        [id_cliente]
        
    );

    return contactos;
};

module.exports = {
    verificarContactoExistente,
    agendarContacto,
    obtenerContactosPorCliente
}