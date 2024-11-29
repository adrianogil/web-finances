const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const User = require('./userModel'); // Relacionamento com o modelo User

const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Conta Corrente', 'Cartão de Crédito', 'Outro'),
    allowNull: false,
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.0,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Relaciona com o modelo User
      key: 'id',
    },
    onDelete: 'CASCADE', // Exclui contas associadas ao excluir o usuário
  },
}, {
    tableName: 'Account', // Garante que o Sequelize usa o nome correto
    timestamps: true, // Adiciona createdAt e updatedAt
});

module.exports = Account;
