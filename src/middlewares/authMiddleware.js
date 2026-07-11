const jwt = require('jsonwebtoken');
const config = require('config');

function getCookieValue(req, cookieName) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [name, ...valueParts] = cookie.trim().split('=');
    if (name === cookieName) {
      return decodeURIComponent(valueParts.join('='));
    }
  }

  return null;
}

function getAuthToken(req) {
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader && authHeader.split(' ')[1]; // Formato esperado: "Bearer <token>"
  return bearerToken || getCookieValue(req, 'authToken');
}

// Middleware para autenticar o token JWT
exports.authenticateToken = (req, res, next) => {
  const token = getAuthToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }

  jwt.verify(token, config.get('jwtSecret'), (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }

    req.user = user; // Armazena os dados do usuário no request para uso posterior
    next();
  });
};

exports.getAuthToken = getAuthToken;

// Middleware para verificar se o usuário tem permissão (exemplo de autorização)
exports.requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Usuário autorizado
  } else {
    return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
  }
};
