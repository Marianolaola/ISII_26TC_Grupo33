const express = require ('express');
const router = express.Router();
const ordenExtraccionController = require ('../controllers/ordenExtraccionController');
const cuentaController = require('../controllers/cuentaController');

router.post('/generar-extraccion', ordenExtraccionController.procesarSolicitudExtraccion);
router.get('/saldo/:id', cuentaController.consultarSaldo);
router.get('/ordenes/:id', ordenExtraccionController.listarOrdenes);
router.post('/cancelar-orden', ordenExtraccionController.cancelarOrden);

module.exports = router;