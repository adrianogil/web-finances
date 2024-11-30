const Category = require('../models/categoryModel');

// Cria uma nova categoria
exports.createCategory = async (categoryData, user) => {
    categoryData.user_id = user.id; // Adiciona o ID do usuário à categoria
    return await Category.create(categoryData);
};

// Lista todas as categorias
exports.getAllCategories = async (user) => {
    return await Category.findAll({
        where: {
            user_id: user.id
        },
        attributes: ['id', 'name'], // Moved attributes into the main object
    });
};

// Obtém uma categoria pelo ID
exports.getCategoryById = async (id) => {
    return await Category.findByPk(id, {
        attributes: ['id', 'name'],
    });
};

// Obtém uma categoria pelo nome
exports.getCategoryByName = async (name) => {
    return await Category.findOne({
        where: { name },
        attributes: ['id', 'name'], // Moved attributes into the main object
    });
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
