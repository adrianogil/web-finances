const FinancialRecord = require('../models/financialRecordModel');

// Cria um novo registro financeiro
exports.createFinancialRecord = async (recordData) => {
  return await FinancialRecord.create(recordData);
};

// Lista todos os registros financeiros
exports.getAllFinancialRecords = async () => {
  return await FinancialRecord.findAll({
    attributes: ['id', 'description', 'amount', 'type', 'date', 'account_id', 'category_id', 'user_id'],
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
