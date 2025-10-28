const transaction = {};
const db = require("../configs/db");

// Generate invoice number
transaction.genInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `INV${day}${month}${year}-${randomNum}`;
};

// Calculate balance
transaction.calculateBalance = async (email) => {
  const result = await db.query(
    `SELECT 
       (SELECT COALESCE(SUM(total_amount), 0) FROM transactions WHERE email = $1 AND transaction_type = 'TOPUP') 
       - 
       (SELECT COALESCE(SUM(total_amount), 0) FROM transactions WHERE email = $1 AND transaction_type = 'PAYMENT') 
       AS balance`,
    [email]
  );
  return parseInt(result.rows[0].balance);
};

module.exports = transaction;
