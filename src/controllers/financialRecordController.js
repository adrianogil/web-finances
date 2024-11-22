const financialRecordService = require('../services/financialRecordService');

// Cria um novo registro financeiro
exports.createFinancialRecord = async (req, res, next) => {
  try {
    const { description, amount, type, date, account_id, category_id, user_id } = req.body;

    if (!description || !amount || !type || !date || !user_id) {
      return res.status(400).json({ error: 'Os campos "description", "amount", "type", "date" e "user_id" são obrigatórios.' });
    }

    const financialRecord = await financialRecordService.createFinancialRecord({
      description,
      amount,
      type,
      date,
      account_id,
      category_id,
      user_id,
    });
    res.status(201).json(financialRecord);
  } catch (error) {
    next(error);
  }
};

// Lista todos os registros financeiros
exports.getAllFinancialRecords = async (req, res, next) => {
  try {
    const financialRecords = await financialRecordService.getAllFinancialRecords();
    res.json(financialRecords);
  } catch (error) {
    next(error);
  }
};

// Obtém um registro financeiro pelo ID
exports.getFinancialRecordById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const financialRecord = await financialRecordService.getFinancialRecordById(id);

    if (!financialRecord) {
      return res.status(404).json({ error: 'Registro financeiro não encontrado.' });
    }

    res.json(financialRecord);
  } catch (error) {
    next(error);
  }
};

// Atualiza um registro financeiro pelo ID
exports.updateFinancialRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description, amount, type, date, account_id, category_id } = req.body;

    if (!description && !amount && !type && !date && account_id === undefined && category_id === undefined) {
      return res.status(400).json({ error: 'Pelo menos um campo deve ser fornecido para atualização.' });
    }

    const updatedRecord = await financialRecordService.updateFinancialRecord(id, {
      description,
      amount,
      type,
      date,
      account_id,
      category_id,
    });

    if (!updatedRecord) {
      return res.status(404).json({ error: 'Registro financeiro não encontrado.' });
    }

    res.json(updatedRecord);
  } catch (error) {
    next(error);
  }
};

// Exclui um registro financeiro pelo ID
exports.deleteFinancialRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await financialRecordService.deleteFinancialRecord(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Registro financeiro não encontrado.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
