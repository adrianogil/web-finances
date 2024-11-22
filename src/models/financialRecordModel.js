const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const Account = require('./accountModel');
const Category = require('./categoryModel');
const User = require('./userModel');

const FinancialRecord = sequelize.define('FinancialRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Receita', 'Despesa'),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  account_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Account,
      key: 'id',
    },
    onDelete: 'SET NULL', // Define como NULL quando a conta associada for excluída
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Category,
      key: 'id',
    },
    onDelete: 'SET NULL', // Define como NULL quando a categoria associada for excluída
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE', // Exclui registros associados ao excluir o usuário
  },
}, {
  timestamps: true, // Adiciona as colunas createdAt e updatedAt automaticamente
});

module.exports = FinancialRecord;
