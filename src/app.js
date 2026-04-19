// 1. Importaciones (Traemos las herramientas)
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Traemos el puente a la base de datos
require('dotenv').config();        // Activamos las variables del .env

const authRoutes = require ('./routes/authRoutes');
// 2. Inicialización
const app = express();

// 3. Middlewares (Los "Traductores" y "Porteros")
app.use(cors());           // Permiso para que Matías se conecte desde su puerto
app.use(express.json());   // Traductor para entender los datos que mande el Front
app.use(express.static('public')); // Configuración para que Node muestre el HTML de la carpeta "public"

//Decimeos a la app que use las rutas de acá
app.use('/api', authRoutes);

// 4. Ruta de prueba (Para saber si todo el cableado funciona)
app.get('/probar-conexion', async (req, res) => {
    try {
        // Le pedimos a la DB que nos diga la hora actual
        const [rows] = await db.query('SELECT NOW() AS hora_actual');
        res.json({
            mensaje: '✅ Backend y Base de Datos conectados con éxito',
            hora_en_servidor: rows[0].hora_actual
        });
    } catch (error) {
        res.status(500).json({
            mensaje: '❌ Error al conectar con la Base de Datos',
            detalle: error.message
        });
    }
});

// 5. Encendido del Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en: http://localhost:${PORT}`);
});