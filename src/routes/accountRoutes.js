const express = require('express');
const accountController = require('../controllers/accountController');

const router = express.Router();

// Rota para criar uma nova conta
router.post('/', accountController.createAccount);

// Rota para listar todas as contas
router.get('/', accountController.getAllAccounts);

// Rota para obter uma conta pelo ID
router.get('/:id', accountController.getAccountById);

// Rota para atualizar uma conta pelo ID
router.put('/:id', accountController.updateAccount);

// Rota para excluir uma conta pelo ID
router.delete('/:id', accountController.deleteAccount);

module.exports = router;
