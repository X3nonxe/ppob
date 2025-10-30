require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  ssl: { rejectUnauthorized: false },
  max: 10,
  min: 0,
  idleTimeoutMillis: 8000,
  connectionTimeoutMillis: 8000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
