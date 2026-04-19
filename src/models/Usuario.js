const db = require('../config/db');

const buscarPorEmail= async (email) => {
    const [usuarios] = await db.query (
        'Select id_usuario, email, password, id_cliente, id_tipo_rol FROM usuario WHERE email = ?',
        [email]
    );

    //retorna el usuario si lo encuentra, o pone null si la lista está vacia
    return usuarios.length > 0 ? usuarios[0] : null;

};

module.exports = {buscarPorEmail};