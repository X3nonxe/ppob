const transaction = {};
const db = require('../configs/db');

// Generate invoice number
transaction.genInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');

  return `INV${day}${month}${year}-${randomNum}`;
};

// Calculate balance
transaction.calculateBalance = async (email, client = null) => {
  const dbClient = client || db;

  try {
    const result = await dbClient.query(
      `SELECT 
         COALESCE(SUM(CASE WHEN transaction_type = 'TOPUP' THEN total_amount ELSE 0 END), 0) -
         COALESCE(SUM(CASE WHEN transaction_type = 'PAYMENT' THEN total_amount ELSE 0 END), 0) as balance
       FROM transactions
       WHERE email = $1`,
      [email]
    );

    // Use parseFloat to handle decimal values properly
    return parseFloat(result.rows[0].balance) || 0;
  } catch (error) {
    console.error('Calculate balance error:', error);
    throw new Error(`Failed to calculate balance: ${error.message}`);
  }
};

module.exports = transaction;
