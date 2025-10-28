const express = require("express");
const routers = express.Router();
const validation = require("../middleware/validation");
const upload = require("../middleware/upload");
const auth = require("../controllers/auth");
const user = require("../controllers/user");
const information = require("../controllers/information");
const transaction = require("../controllers/transaction");

// Auth
routers.post("/registration", validation.emailPassword, auth.registration);
routers.post("/login", validation.emailPassword, auth.login);

// Profile
routers.get("/profile", validation.login, user.getProfile);
routers.put("/profile/update", validation.login, user.updateProfile);
routers.put(
  "/profile/image",
  upload.multer,
  upload.cloudinary,
  validation.login,
  user.updateProfile
);

// Information
routers.get("/banner", information.getBanner);
routers.get("/services", validation.login, information.getServices);

// Transaction
routers.get("/balance", validation.login, transaction.getBalance);
routers.post(
  "/topup",
  validation.login,
  validation.topUpAmount,
  transaction.topUp
);
routers.post("/transaction", validation.login, transaction.newTransaction);
routers.get(
  "/transaction/history",
  validation.login,
  transaction.getTransaction
);

module.exports = routers;
