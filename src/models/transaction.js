const models = {};
const db = require("../configs/db");
const { genInvoiceNumber, calculateBalance } = require("../utils/transaction");

// Get balance
models.getBalance = async (email) => {
  return await calculateBalance(email);
};

// Top up
models.topUp = async (email, total_amount) => {
  try {
    // Generate invoice number
    const invoiceNum = genInvoiceNumber();

    // Start a transaction
    await db.query("BEGIN");

    // Insert the top-up transaction
    await db.query(
      `INSERT INTO transactions (email, invoice_number, service_code, transaction_type, total_amount) 
       VALUES ($1, $2, $3, $4, $5)`,
      [email, invoiceNum, "TOPUP", "TOPUP", total_amount]
    );

    // Calculate the balance
    const balance = await calculateBalance(email);

    // Commit the transaction
    await db.query("COMMIT");

    // Return the balance
    return balance;
  } catch (error) {
    // Rollback the transaction in case of error
    await db.query("ROLLBACK");
    throw error;
  }
};

// New transaction
models.newTransaction = async (email, service_code) => {
  try {
    // Generate invoice number
    const invoiceNum = genInvoiceNumber();

    // Start a transaction
    await db.query("BEGIN");

    // Check if the service available
    const service = await db.query(
      `
      SELECT *
      FROM services
      WHERE service_code = $1
      `,
      [service_code]
    );

    if (service.rowCount === 0) {
      throw new Error("Service atau Layanan tidak ditemukan");
    }

    // Get total amount
    const total_amount = service.rows[0].service_tariff;

    // Calculate the balance
    const balance = await calculateBalance(email);
    if (balance < total_amount) {
      throw new Error("Balance / saldo tidak mencukupi");
    }

    // Insert the new transaction and get the service_name
    const result = await db.query(
      `WITH new_transaction AS (
         INSERT INTO transactions (email, service_code, invoice_number, transaction_type, total_amount)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *
       )

       SELECT nt.invoice_number, nt.service_code, s.service_name, nt.transaction_type, nt.total_amount, nt.created_on
       FROM new_transaction nt
       JOIN services s ON nt.service_code = s.service_code`,
      [email, service_code, invoiceNum, "PAYMENT", total_amount]
    );

    // Commit the transaction
    await db.query("COMMIT");

    // Return the inserted transaction details
    return result.rows[0];
  } catch (error) {
    // Rollback the transaction in case of error
    await db.query("ROLLBACK");
    throw error;
  }
};

// Get transaction history
models.getTransaction = async (email, offset, limit) => {
  try {
    let query = `
      SELECT invoice_number, transaction_type, description, total_amount, t.created_on
      FROM transactions t
      JOIN services s ON t.service_code = s.service_code
      WHERE email = $1
      ORDER BY created_on DESC
    `;
    const params = [email];

    if (limit) {
      query += ` LIMIT $2 OFFSET $3`;
      params.push(limit, offset);
    }

    const result = await db.query(query, params);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = models;
