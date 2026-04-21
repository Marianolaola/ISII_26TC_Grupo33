const express = require ('express');
const router = express.Router();
const extraccionController = require ('../controllers/extraccionController');


router.post('/generar-extraccion', extraccionController.generarOrden);
router.get('/saldo/:id', extraccionController.consultarSaldo);
router.get('/ordenes/:id', extraccionController.listarOrdenes);

module.exports = router;