const db = require('../config/db');

const buscarPorEmail= async (email) => {
    const [usuarios] = await db.query (
        // Hacemos un join entre usuario y cliente; y entre cliente y cuenta para mostrar los datos del cliente y no del usuario
        'SELECT u.*, c.nombre, c.apellido, cu.saldo FROM usuario u INNER JOIN cliente c ON u.id_cliente = c.id_cliente INNER JOIN cuenta cu ON c.id_cliente = cu.id_cliente WHERE u.email = ?',
        [email]
    );

    //retorna el usuario si lo encuentra, o pone null si la lista está vacia
    return usuarios.length > 0 ? usuarios[0] : null;

};

module.exports = {buscarPorEmail};