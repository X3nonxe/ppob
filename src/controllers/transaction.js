const controllers = {};
const models = require("../models/transaction");
const response = require("../utils/response");

// Get balance
controllers.getBalance = async (req, res) => {
  try {
    const result = await models.getBalance(req.token.email);
    return response(res, 0, "Get Balance Berhasil", { balance: result });
  } catch (err) {
    return response(res, 103, err.message);
  }
};

// Top up
controllers.topUp = async (req, res) => {
  try {
    const result = await models.topUp(req.token.email, req.body.top_up_amount);
    return response(res, 0, "Top Up Balance berhasil", { balance: result });
  } catch (err) {
    return response(res, 103, err.message);
  }
};

// New transaction
controllers.newTransaction = async (req, res) => {
  try {
    const result = await models.newTransaction(
      req.token.email,
      req.body.service_code
    );
    return response(res, 0, "Transaksi berhasil", result);
  } catch (err) {
    if (err.message.includes("Service") || err.message.includes("Balance")) {
      return response(res, 102, err.message);
    }
    return response(res, 103, err.message);
  }
};

// Get transaction history
controllers.getTransaction = async (req, res) => {
  try {
    let { offset, limit } = req.query;
    if (limit) {
      offset = parseInt(offset);
      limit = parseInt(limit);
    }

    const result = await models.getTransaction(req.token.email, offset, limit);
    const data = limit ? { offset, limit, records: result } : result;
    return response(res, 0, "Get History Berhasil", data);
  } catch (err) {
    return response(res, 103, err.message);
  }
};

module.exports = controllers;
