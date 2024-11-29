const categoryService = require('../services/categoryService');

// Cria uma nova categoria
exports.createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const user = req.user;

        if (!name) {
            return res.status(400).json({ error: 'Os campos "name" são obrigatórios.' });
        }

        const category = await categoryService.createCategory({ name }, user);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

// Lista todas as categorias
exports.getAllCategories = async (req, res, next) => {
    const user = req.user;
    try {
        const categories = await categoryService.getAllCategories(user);
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

// Obtém uma categoria pelo ID
exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
};

// Atualiza uma categoria pelo ID
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'O campo "name" é obrigatório.' });
    }

    const updatedCategory = await categoryService.updateCategory(id, { name });

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

// Exclui uma categoria pelo ID
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await categoryService.deleteCategory(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
