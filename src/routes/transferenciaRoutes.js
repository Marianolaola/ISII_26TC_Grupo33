const express = require('express');
const router = express.Router();

const transferenciaController = require('../controllers/transferenciaController');

router.post('/transferencias', transferenciaController.realizarTransferencia);

module.exports = router;