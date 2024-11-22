const express = require('express');
const path = require('path');

// Rotas importadas
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const accountRoutes = require('./routes/accountRoutes');
const financialRecordRoutes = require('./routes/financialRecordRoutes');

// Middleware de tratamento de erros
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Configurar middleware para analisar JSON
app.use(express.json());

// Configurar rotas da API REST
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/financial-records', financialRecordRoutes);

// Configurar para servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'public')));

// Rota para servir o arquivo HTML principal
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Middleware global para tratamento de erros
app.use(errorHandler);

module.exports = app;
