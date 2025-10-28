const models = {};
const db = require("../configs/db");

// Get banner
models.getBanner = async () => {
  const result = await db.query(
    `SELECT banner_name, banner_image, description FROM banner`
  );
  return result.rows;
};

// Get services
models.getServices = async () => {
  const result = await db.query(
    `SELECT service_code, service_name, service_icon, service_tariff FROM services`
  );
  return result.rows;
};

module.exports = models;
