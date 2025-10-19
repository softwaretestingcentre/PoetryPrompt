const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const result = await pool.query('SELECT * FROM poems ORDER BY created_at DESC');
    return { statusCode: 200, body: JSON.stringify({ poems: result.rows }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch poems' }) };
  }
};
