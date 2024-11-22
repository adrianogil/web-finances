const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// Rota para criar uma nova categoria
router.post('/', categoryController.createCategory);

// Rota para listar todas as categorias
router.get('/', categoryController.getAllCategories);

// Rota para obter uma categoria pelo ID
router.get('/:id', categoryController.getCategoryById);

// Rota para atualizar uma categoria pelo ID
router.put('/:id', categoryController.updateCategory);

// Rota para excluir uma categoria pelo ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
