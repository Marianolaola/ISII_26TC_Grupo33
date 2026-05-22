const express = require('express');
const router = express.Router();

const transferenciaController = require('../controllers/transferenciaController');

router.post('/transferencia', transferenciaController.realizarTransferencia);

module.exports = router;