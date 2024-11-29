const accountService = require('../services/accountService');

// Cria uma nova conta
exports.createAccount = async (req, res, next) => {
  try {
    const { name, type, balance} = req.body;
    const user = req.user;

    if (!name || !type) {
      return res.status(400).json({ error: 'Os campos "name", "type" são obrigatórios.' });
    }

    const account = await accountService.createAccount({ name, type, balance: balance || 0.0}, user);
    res.status(201).json(account);
  } catch (error) {
    next(error);
  }
};

// Lista todas as contas
exports.getAllAccounts = async (req, res, next) => {
  try {
    const accounts = await accountService.getAllAccounts(req.user);
    res.json(accounts);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Obtém uma conta pelo ID
exports.getAccountById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await accountService.getAccountById(id);

    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada.' });
    }

    res.json(account);
  } catch (error) {
    next(error);
  }
};

// Atualiza uma conta pelo ID
exports.updateAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, type, balance } = req.body;

    if (!name && !type && balance === undefined) {
      return res.status(400).json({ error: 'Pelo menos um campo deve ser fornecido para atualização.' });
    }

    const updatedAccount = await accountService.updateAccount(id, { name, type, balance });

    if (!updatedAccount) {
      return res.status(404).json({ error: 'Conta não encontrada.' });
    }

    res.json(updatedAccount);
  } catch (error) {
    next(error);
  }
};

// Exclui uma conta pelo ID
exports.deleteAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await accountService.deleteAccount(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Conta não encontrada.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
