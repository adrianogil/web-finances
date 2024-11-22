const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Validação para garantir formato de e-mail
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subscription_status: {
    type: DataTypes.ENUM('Free Trial', 'Premium'),
    defaultValue: 'Free Trial',
  },
  preferences: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  timestamps: true, // Adiciona as colunas createdAt e updatedAt automaticamente
});

module.exports = User;
