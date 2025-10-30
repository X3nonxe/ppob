const validation = {};
const jwt = require("jsonwebtoken");
const response = require("../utils/response");
const { body, validationResult } = require("express-validator");

// Registration
validation.emailPassword = [
  body("email").isEmail().withMessage("Parameter email tidak sesuai format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Parameter password min. 8 karakter"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return response(res, 400, 102, errors.array()[0].msg);
    }
    next();
  },
];

// Login
validation.login = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return response(res, 401, 108, "Silahkan login terlebih dahulu");
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
    if (err) {
      return response(res, 401, 108, "Token tidak valid atau kadaluwarsa");
    }

    req.token = decode;
    next();
  });
};

// Top up
validation.topUpAmount = [
  body("top_up_amount")
    .isInt({ min: 0 })
    .withMessage(
      "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0"
    ),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return response(res, 400, 102, errors.array()[0].msg);
    }
    next();
  },
];

module.exports = validation;
