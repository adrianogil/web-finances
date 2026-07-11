const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/userModel');
const { authenticateToken, getAuthToken } = require('../middlewares/authMiddleware');

const router = express.Router();

const salt = 10;
const AUTH_COOKIE_NAME = 'authToken';
const AUTH_COOKIE_MAX_AGE_MS = 60 * 60 * 1000;

function getAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: AUTH_COOKIE_MAX_AGE_MS,
    path: '/',
  };
}

function getClearAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };
}

function hashPassword(password, salt) {
    const saltBuffer = Buffer.from(salt.toString(), 'hex'); // Gera o buffer do salt
    return crypto.pbkdf2Sync(password, saltBuffer, 10000, 64, 'sha512').toString('hex');
}

// Rota para registrar um novo usuário
router.post('/register', async (req, res, next) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'Os campos "full_name", "email" e "password" são obrigatórios.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email já está em uso.' });
    }

    const hashedPassword = hashPassword(password, salt);

    const user = await User.create({
      full_name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Usuário registrado com sucesso.', user: { id: user.id, email: user.email } });
  } catch (error) {
    next(error);
  }
});

// Rota para login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Os campos "email" e "password" são obrigatórios.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Email não encontrado.' });
    }

    const inputHash = hashPassword(password, salt);
    const isPasswordValid = inputHash === user.password;

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.get('jwtSecret'),
      { expiresIn: '1h' } // Token expira em 1 hora
    );

    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
    const responseBody = { userName: user.full_name, message: 'Login realizado com sucesso.' };
    if (req.body.includeToken === true || req.query.includeToken === 'true') {
      responseBody.token = token;
    }

    res.json(responseBody);
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, getClearAuthCookieOptions());
  res.json({ message: 'Logout realizado com sucesso.' });
});

router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'full_name'],
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json({
      id: user.id,
      email: user.email,
      userName: user.full_name,
    });
  } catch (error) {
    next(error);
  }
});

// Rota para verificar o token JWT
router.get('/verify', (req, res) => {
  const token = getAuthToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  jwt.verify(token, config.get('jwtSecret'), (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido.' });
    }

    res.json({ message: 'Token válido.', user: decoded });
  });
});

module.exports = router;
