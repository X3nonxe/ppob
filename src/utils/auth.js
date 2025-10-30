const auth = {};
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Hashing password
auth.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  } catch (err) {
    throw err;
  }
};

// Generate token
auth.genToken = (email) => {
  const payload = {
    email,
  };

  const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
  return token;
};

module.exports = auth;
