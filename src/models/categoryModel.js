const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const User = require('./userModel'); // Assumindo que há um modelo de usuário

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Relaciona com o modelo User
      key: 'id',
    },
    onDelete: 'CASCADE', // Exclui categorias associadas ao excluir o usuário
  },
}, {
  timestamps: true, // Adiciona colunas createdAt e updatedAt automaticamente
});

module.exports = Category;
