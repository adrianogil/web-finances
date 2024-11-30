const FinancialRecord = require('../models/financialRecordModel');
const { Op } = require('sequelize');

// Cria um novo registro financeiro
exports.createFinancialRecord = async (recordData, user) => {
    recordData.user_id = user.id;
    return await FinancialRecord.create(recordData);
};

exports.getAllFinancialRecords = async (user, filters) => {
    const whereClause = { user_id: user.id };

    // Filtra por mês e ano se ambos forem fornecidos
    if (filters.month && filters.year) {
        const startOfMonth = new Date(filters.year, filters.month - 1, 1);  // Primeiro dia do mês
        const endOfMonth = new Date(filters.year, filters.month, 0);        // Último dia do mês
        whereClause.date = {
            [Op.between]: [startOfMonth, endOfMonth],
        };
    }
    // Filtra por ano se o mês não for fornecido
    else if (filters.year) {
        const startOfYear = new Date(filters.year, 0, 1); // Primeiro dia do ano
        const endOfYear = new Date(filters.year, 11, 31, 23, 59, 59); // Último dia do ano
        whereClause.date = {
            [Op.between]: [startOfYear, endOfYear],
        };
    }
    // Filtra apenas por mês se o ano não for fornecido
    else if (filters.month) {
        const currentYear = new Date().getFullYear(); // Usa o ano atual
        const startOfMonth = new Date(currentYear, filters.month - 1, 1); // Primeiro dia do mês
        const endOfMonth = new Date(currentYear, filters.month, 0);       // Último dia do mês
        whereClause.date = {
            [Op.between]: [startOfMonth, endOfMonth],
        };
    }

    // Filtra por categoria se fornecido
    if (filters.categoryId) {
        whereClause.category_id = filters.categoryId;
    }

    // Filtra por conta se fornecido
    if (filters.accountId) {
        whereClause.account_id = filters.accountId;
    }

    return await FinancialRecord.findAll({
        where: whereClause,
        attributes: ['id', 'description', 'amount', 'type', 'date', 'account_id', 'category_id'],
    });
};

// Obtém um registro financeiro pelo ID
exports.getFinancialRecordById = async (id) => {
  return await FinancialRecord.findByPk(id, {
    attributes: ['id', 'description', 'amount', 'type', 'date', 'account_id', 'category_id', 'user_id'],
  });
};

// Atualiza um registro financeiro pelo ID
exports.updateFinancialRecord = async (id, updatedData) => {
  const record = await FinancialRecord.findByPk(id);
  if (!record) {
    return null;
  }

  return await record.update(updatedData);
};

// Exclui um registro financeiro pelo ID
exports.deleteFinancialRecord = async (id) => {
  const record = await FinancialRecord.findByPk(id);
  if (!record) {
    return false;
  }

  await record.destroy();
  return true;
};
