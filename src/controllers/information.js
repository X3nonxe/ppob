const controllers = {};
const models = require("../models/information");
const response = require("../utils/response");

// Get banner
controllers.getBanner = async (req, res) => {
  try {
    const result = await models.getBanner();
    return response(res, 200, 0, "Sukses", result);
  } catch (err) {
    return response(res, 103, err.message);
  }
};

// Get services
controllers.getServices = async (req, res) => {
  try {
    const result = await models.getServices();
    return response(res, 200, 0, "Sukses", result);
  } catch (err) {
    return response(res, 103, err.message);
  }
};

module.exports = controllers;
