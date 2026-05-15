const express = require ('express');
const router = express.Router();
const ordenExtraccionController = require ('../controllers/ordenExtraccionController');


router.post('/generar-extraccion', ordenExtraccionController.generarOrden);
router.get('/saldo/:id', ordenExtraccionController.consultarSaldo);
router.get('/ordenes/:id', ordenExtraccionController.listarOrdenes);
router.post('/cancelar-orden', ordenExtraccionController.cancelarOrden);

module.exports = router;