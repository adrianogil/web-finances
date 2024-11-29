const Account = require('../models/accountModel');

// Cria uma nova conta
exports.createAccount = async (accountData, user) => {
    accountData.user_id = user.id; // Adiciona o ID do usuário à conta
    return await Account.create(accountData);
};

// Lista todas as contas
exports.getAllAccounts = async (user) => {

return await Account.findAll({
    where: { user_id: user.id }, // Filtra as contas pelo ID do usuário
    attributes: ['id', 'name', 'type', 'balance', 'user_id'], // Seleciona apenas os campos necessários
});
};

// Obtém uma conta pelo ID
exports.getAccountById = async (id) => {
  return await Account.findByPk(id, {
    attributes: ['id', 'name', 'type', 'balance', 'user_id'],
  });
};

// Atualiza uma conta pelo ID
exports.updateAccount = async (id, updatedData) => {
  const account = await Account.findByPk(id);
  if (!account) {
    return null;
  }

  return await account.update(updatedData);
};

// Exclui uma conta pelo ID
exports.deleteAccount = async (id) => {
  const account = await Account.findByPk(id);
  if (!account) {
    return false;
  }

  await account.destroy();
  return true;
};
