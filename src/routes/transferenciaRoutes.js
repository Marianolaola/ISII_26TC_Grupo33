const express = require('express');
const router = express.Router();

const transferenciaController = require('../controllers/transferenciaController');

router.get('/transferencia/destino/:cbuAliasDestino', transferenciaController.verificarDestinoTransferencia);
router.post('/transferencia', transferenciaController.realizarTransferencia);
router.get('/conceptos', transferenciaController.obtenerConceptos);
router.get('/clientes/:id/movimientos', transferenciaController.obtenerHistorialMovimientos);


module.exports = router;