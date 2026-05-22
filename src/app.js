// 1. Importaciones herramientas
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); 
require('dotenv').config();        

const authRoutes = require ('./routes/authRoutes');
const extraccionRouters = require ('./routes/extraccionRoutes');
const transferenciaRoutes = require ('./routes/transferenciaRoutes');


// 2. Inicialización

const app = express();

// 3. Middlewares 

app.use(cors());           
app.use(express.json());   
app.use(express.static('public')); 

//Decimeos a la app que use las rutas de acá

app.use('/api', authRoutes);
app.use('/api', extraccionRouters);
app.use('/api', transferenciaRoutes);

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