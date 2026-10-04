const { Pool } = require('pg');
const config = require('./environment');
const logger = require('../utils/logger');
let pool = null;
async function connectDatabase() {
  try {
    pool = new Pool({
      connectionString: config.DATABASE_URL,
      max: config.DB_POOL_SIZE,
      idleTimeoutMillis: 30000,
    });
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    logger.info(`Database connected at ${result.rows[0].now}`);
    client.release();
    return pool;
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
}
function getPool() {
  if (!pool) throw new Error('Database pool not initialized');
  return pool;
}
async function query(text, values = []) {
  const client = await getPool().connect();
  try {
    return await client.query(text, values);
  } finally {
    client.release();
  }
}
module.exports = { connectDatabase,
ls -la config/database.js

