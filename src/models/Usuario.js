const db = require('../config/db');

const buscarPorEmailYPassword = async (email, password) => {
    const [usuarios] = await db.query (
        'Select id_usuario, email, id_cliente, id_tipo_rol FROM usuario WHERE email = ? AND password ?',
        [email, password]
    );

    //retorna el usuario si lo encuentra, o pone null si la lista está vacia
    return usuarios.length > 0 ? usuarios[0] : null;

};

module.exports = {buscarPorEmailYPassword};