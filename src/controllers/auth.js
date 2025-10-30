const controllers = {};
const bcrypt = require('bcrypt');
const auth = require('../utils/auth');
const models = require('../models/user');
const response = require('../utils/response');

// Registration
controllers.registration = async (req, res) => {
  try {
    const hashedPassword = await auth.hashPassword(req.body.password);

    const result = await models.registration({
      ...req.body,
      password: hashedPassword,
    });

    if (result.rowCount === 1) {
      return response(res, 201, 0, 'Registrasi berhasil, silahkan login');
    }

    return response(res, 500, 103, 'Registrasi gagal, silahkan coba lagi');
  } catch (err) {
    console.error('Registration error:', err);

    if (err.code === '23505' || err.message.includes('duplicate key')) {
      return response(res, 409, 103, 'Email sudah digunakan');
    }

    return response(res, 500, 103, 'Terjadi kesalahan sistem');
  }
};

// Login
controllers.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return response(res, 400, 102, 'Email dan password harus diisi');
    }

    const result = await models.getPassByEmail(email);

    // User not found
    if (result.rowCount === 0) {
      return response(res, 401, 103, 'Email belum terdaftar, silahkan registrasi');
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response(res, 401, 103, 'Email atau password salah');
    }

    // Generate token
    const token = auth.genToken(user.email);

    return response(res, 200, 0, 'Login sukses', { token });
  } catch (error) {
    console.error('Login error:', error);
    return response(res, 500, 103, 'Terjadi kesalahan sistem');
  }
};

module.exports = controllers;
