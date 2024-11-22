// Middleware para tratamento de erros
module.exports = (err, req, res, next) => {
    console.error(err.stack); // Log detalhado do erro no console

    const statusCode = err.status || 500; // Código de status HTTP (padrão: 500)
    const message = err.message || 'Ocorreu um erro interno no servidor.';

    res.status(statusCode).json({
      error: {
        message,
        status: statusCode,
      },
    });
  };
