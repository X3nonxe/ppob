const controllers = {};
const models = require("../models/user");
const response = require("../utils/response");
const hashing = require("../utils/auth");

// Get profile
controllers.getProfile = async (req, res) => {
  try {
    const result = await models.getProfile(req.token.email);
    return response(res, 200, 0, "Sukses", result);
  } catch (err) {
    return response(res, 500, 103, err.message);
  }
};

// Update profile
controllers.updateProfile = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await hashing(req.body.password);
    }
    const result = await models.updateProfile(req.body, req.token.email);
    const msg = req.body.profile_image ? "Image " : "";
    return response(res, 200, 0, `Update Pofile ${msg}berhasil`, result);
  } catch (err) {
    return response(res, 500, 103, err.message);
  }
};

module.exports = controllers;
