const express = require ('express');
const router = express.Router();

const contactoController = require('../controllers/contactoController');

router.post('/contactos', contactoController.agendarContacto);
router.get('/clientes/:id/contactos', contactoController.listarContactos);

module.exports = router;