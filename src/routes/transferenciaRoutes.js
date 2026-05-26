const express = require('express');
const router = express.Router();

const transferenciaController = require('../controllers/transferenciaController');

router.get('/transferencia/destino/:cbuAliasDestino', transferenciaController.verificarDestinoTransferencia);
router.post('/transferencia', transferenciaController.realizarTransferencia);


module.exports = router;