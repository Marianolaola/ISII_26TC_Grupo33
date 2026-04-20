const express = require ('express');
const router = express.Router();
const extraccionController = require ('../controllers/extraccionController');


router.post('/generar-extraccion', extraccionController.generarOrden);
router.get('/saldo/:id', extraccionController.consultarSaldo);

module.exports = router;