const models = {};
const db = require('../configs/db');
const { genInvoiceNumber, calculateBalance } = require('../utils/transaction');
const { TRANSACTION_TYPES, SERVICE_CODES } = require('../utils/constans');
const { ServiceNotFoundError, InsufficientBalanceError, ValidationError } = require('../utils/customError');

// Get balance
models.getBalance = async (email) => {
  try {
    return await calculateBalance(email);
  } catch (error) {
    console.error('Get balance error:', error);
    throw new Error(`Failed to get balance: ${error.message}`);
  }
};

// Top up
models.topUp = async (email, total_amount) => {
  const client = await db.connect();

  try {
    const invoiceNum = genInvoiceNumber();

    await client.query('BEGIN');

    await client.query(
      `INSERT INTO transactions (email, invoice_number, service_code, transaction_type, total_amount) 
       VALUES ($1, $2, $3, $4, $5)`,
      [email, invoiceNum, SERVICE_CODES.TOPUP, TRANSACTION_TYPES.TOPUP, total_amount]
    );

    const balance = await calculateBalance(email, client);

    await client.query('COMMIT');

    return balance;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Top-up error:', error);
    throw new Error(`Top-up failed: ${error.message}`);
  } finally {
    client.release();
  }
};

// New transaction
models.newTransaction = async (email, service_code) => {
  const client = await db.connect();

  try {
    const invoiceNum = genInvoiceNumber();

    await client.query('BEGIN');

    // Check if the service is available
    const service = await client.query(`SELECT * FROM services WHERE service_code = $1`, [service_code]);

    if (service.rowCount === 0) {
      throw new ServiceNotFoundError('Service atau Layanan tidak ditemukan');
    }

    const total_amount = service.rows[0].service_tariff;

    const balance = await calculateBalance(email, client);

    if (balance < total_amount) {
      throw new InsufficientBalanceError('Balance / saldo tidak mencukupi');
    }

    const result = await client.query(
      `WITH new_transaction AS (
         INSERT INTO transactions (email, service_code, invoice_number, transaction_type, total_amount)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *
       )
       SELECT 
         nt.invoice_number, 
         nt.service_code, 
         s.service_name, 
         nt.transaction_type, 
         nt.total_amount, 
         nt.created_on
       FROM new_transaction nt
       JOIN services s ON nt.service_code = s.service_code`,
      [email, service_code, invoiceNum, TRANSACTION_TYPES.PAYMENT, total_amount]
    );

    await client.query('COMMIT');

    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('New transaction error:', error);

    if (error instanceof ServiceNotFoundError || error instanceof InsufficientBalanceError || error instanceof ValidationError) {
      throw error;
    }

    throw new Error(`Transaction failed: ${error.message}`);
  } finally {
    client.release();
  }
};

// Get transaction history
models.getTransaction = async (email, offset = 0, limit = null) => {
  try {
    const query = `
      SELECT 
        t.invoice_number, 
        t.transaction_type, 
        COALESCE(s.description, 'Top Up') as description, 
        t.total_amount, 
        t.created_on
      FROM transactions t
      LEFT JOIN services s ON t.service_code = s.service_code
      WHERE t.email = $1
      ORDER BY t.created_on DESC
      ${limit ? 'LIMIT $2 OFFSET $3' : ''}
    `;

    const params = limit ? [email, limit, offset] : [email];
    const result = await db.query(query, params);

    return result.rows;
  } catch (error) {
    console.error('Get transaction error:', error);
    throw new Error(`Failed to get transactions: ${error.message}`);
  }
};

module.exports = models;
