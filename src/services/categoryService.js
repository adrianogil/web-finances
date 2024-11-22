const Category = require('../models/categoryModel');

// Cria uma nova categoria
exports.createCategory = async (categoryData) => {
  return await Category.create(categoryData);
};

// Lista todas as categorias
exports.getAllCategories = async () => {
  return await Category.findAll();
};

// Obtém uma categoria pelo ID
exports.getCategoryById = async (id) => {
  return await Category.findByPk(id);
};

// Atualiza uma categoria pelo ID
exports.updateCategory = async (id, updatedData) => {
  const category = await Category.findByPk(id);
  if (!category) {
    return null;
  }

  return await category.update(updatedData);
};

// Exclui uma categoria pelo ID
exports.deleteCategory = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) {
    return false;
  }

  await category.destroy();
  return true;
};
