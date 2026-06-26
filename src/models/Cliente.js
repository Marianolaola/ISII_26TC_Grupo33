const db = require('../config/db');

const buscarPorId = async (id_cliente) => {
    const [clientes] = await db.query (
        `SELECT 
            id_cliente, 
            nombre, 
            apellido, 
            dni 
         FROM cliente 
         WHERE id_cliente = ?`,
         [id_cliente]
    );

    // Retorna el cliente si lo encuentra, o null si la lista está vacía
    return clientes.length > 0 ? clientes[0] : null;
};

module.exports = { buscarPorId };