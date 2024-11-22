const express = require('express');
const financialRecordController = require('../controllers/financialRecordController');

const router = express.Router();

// Rota para criar um novo registro financeiro
router.post('/', financialRecordController.createFinancialRecord);

// Rota para listar todos os registros financeiros
router.get('/', financialRecordController.getAllFinancialRecords);

// Rota para obter um registro financeiro pelo ID
router.get('/:id', financialRecordController.getFinancialRecordById);

// Rota para atualizar um registro financeiro pelo ID
router.put('/:id', financialRecordController.updateFinancialRecord);

// Rota para excluir um registro financeiro pelo ID
router.delete('/:id', financialRecordController.deleteFinancialRecord);

module.exports = router;
