const financialRecordService = require('../services/financialRecordService');

const { getAccountByName, getAccountById } = require('../services/accountService');
const { getCategoryByName, getCategoryById } = require('../services/categoryService');
const { get } = require('config');

async function getFinancialRecordResponse(financialRecord) {
    return {
        id: financialRecord.id,
        description: financialRecord.description,
        amount: financialRecord.amount,
        type: financialRecord.type,
        date: financialRecord.date,
        account: await getAccountById(financialRecord.account_id),
        category: await getCategoryById(financialRecord.category_id),
    };
}


// Cria um novo registro financeiro
exports.createFinancialRecord = async (req, res, next) => {
  try {
    const { description, amount, type, date, account, category} = req.body;
    const user = req.user;

    console.log(req.body);

    if (!description || !amount || !type || !date || !account || !category) {
      return res.status(400).json({ error: 'Os campos "description", "amount", "type", "date", "account" e "category" são obrigatórios.' });
    }

    let accountId, categoryId;

    // Check if account is a integer
    if (!isNaN(account)) {
        accountId = account;
    } else {
        const accountData = await getAccountByName(account);
        if (!accountData) {
            return res.status(404).json({ error: 'Conta não encontrada.' });
        } else {
            accountId = accountData.id;
        }
    }

    // Check if category is a integer
    if (!isNaN(category)) {
        categoryId = category;
    } else {
        const categoryData = await getCategoryByName(category);
        if (!categoryData) {
            return res.status(404).json({ error: 'Categoria não encontrada.' });
        } else {
            categoryId = categoryData.id;
        }
    }

    const financialRecord = await financialRecordService.createFinancialRecord({
      description,
      amount,
      type,
      date,
      account_id: accountId,
      category_id: categoryId,
    }, user);

    res.status(201).json(await getFinancialRecordResponse(financialRecord));
  } catch (error) {
    next(error);
  }
};

exports.getAllFinancialRecords = async (req, res, next) => {
    const user = req.user;
    const { month, category, account, year } = req.query;

    try {
        const categoryId = category ? await getCategoryByName(category) : undefined;
        const accountId = account ? await getAccountByName(account) : undefined;

        // Se o ano não for fornecido, usa o ano atual
        const currentYear = year ? parseInt(year) : new Date().getFullYear();

        const filters = {
            month: month ? parseInt(month) : undefined,
            year: currentYear,
            categoryId: categoryId ? parseInt(categoryId) : undefined,
            accountId: accountId ? parseInt(accountId) : undefined
        };

        const financialRecords = await financialRecordService.getAllFinancialRecords(user, filters);
        const financialRecordsResponse = await Promise.all(
            financialRecords.map(async (record) => await getFinancialRecordResponse(record))
        );

        res.json(financialRecordsResponse);
    } catch (error) {
        console.error(error);
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

    res.json(getFinancialRecordResponse(financialRecord));
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

    res.json(getFinancialRecordResponse(updatedRecord));
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
