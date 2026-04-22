const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

// Se define la función de login
const login = async (req, res) => {
    
    //Se extrae los datos que manda Mati desde el Front
    const {email, password } = req.body;

    try {

        //Pedimos al Modelo que busque por email
        const usuarioLogueado = await Usuario.buscarPorEmail (email);
        
        //Caso error en el login
        if (!usuarioLogueado){
            return res.status(401).json({
                mensaje: '❌ Usuario o contraseña incorrectos'
            });
        }
        
        //Se compara la contraseña con la encriptada para más seguridad
        const esValido = await bcrypt.compare(password, usuarioLogueado.password);
        if (!esValido){
            return res.status(401).json({mensaje: '❌ Email o contraseña incorrectos' });
        }

        //Caso del login correcto
        res.json ({
            mensaje: '✅ ¡Bienvenido al sistema!',
            usuario: usuarioLogueado
        });

    }catch (error) {
        //Si falla la base de datos, se generá el error
        console.error("Error en el login:", error);
        res.status(500).json({
            mensaje: '❌ Error interno del servidor (tomate un mate mientras tanto)'
        });
    }

};
//Exportamos la función para que todos los archivos la usen
module.exports = { login };