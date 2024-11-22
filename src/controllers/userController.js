const userService = require('../services/userService');

// Cria um novo usuário
exports.createUser = async (req, res, next) => {
  try {
    const { full_name, email, password, preferences } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'Os campos "full_name", "email" e "password" são obrigatórios.' });
    }

    const user = await userService.createUser({ full_name, email, password, preferences });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// Lista todos os usuários
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Obtém um usuário pelo ID
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Atualiza um usuário pelo ID
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { full_name, email, subscription_status, preferences } = req.body;

    if (!full_name && !email && !subscription_status && !preferences) {
      return res.status(400).json({ error: 'Pelo menos um campo deve ser fornecido para atualização.' });
    }

    const updatedUser = await userService.updateUser(id, { full_name, email, subscription_status, preferences });

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Exclui um usuário pelo ID
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await userService.deleteUser(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
