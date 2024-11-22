const User = require('../models/userModel');


// Cria um novo usuário
exports.createUser = async (userData) => {
  return await User.create(userData);
};

// Lista todos os usuários
exports.getAllUsers = async () => {
  return await User.findAll({
    attributes: ['id', 'full_name', 'email', 'subscription_status'], // Seleciona apenas os campos necessários
  });
};

// Obtém um usuário pelo ID
exports.getUserById = async (id) => {
  return await User.findByPk(id, {
    attributes: ['id', 'full_name', 'email', 'subscription_status', 'preferences'],
  });
};

// Atualiza um usuário pelo ID
exports.updateUser = async (id, updatedData) => {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }

  return await user.update(updatedData);
};

// Exclui um usuário pelo ID
exports.deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    return false;
  }

  await user.destroy();
  return true;
};
