const express = require ('express');
const router = express.Router();

//Importamos el controlador
const authController = require('../controllers/authController.js');


//Creamos la ruta
router.post('/login', authController.login);

//Exportamos la ruta para que app.js la use
module.exports = router;