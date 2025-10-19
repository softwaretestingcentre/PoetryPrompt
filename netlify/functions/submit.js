const { Pool } = require('pg');
const Tesseract = require('tesseract.js');
const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  return new Promise((resolve, reject) => {
    const busboy = new Busboy({ headers: event.headers });
    let fields = {};
    let filePath = null;
    let fileWriteStream = null;
    let photoUrl = null;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      filePath = path.join('/tmp', filename);
      fileWriteStream = fs.createWriteStream(filePath);
      file.pipe(fileWriteStream);
      photoUrl = `/uploads/${filename}`; // In production, upload to cloud storage
    });

    busboy.on('field', (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on('finish', async () => {
      try {
        const { theme, style, text } = fields;
        const result = await pool.query(
          'INSERT INTO poems (theme, style, text, photo_url) VALUES ($1, $2, $3, $4) RETURNING *',
          [theme, style, text, photoUrl]
        );
        resolve({ statusCode: 200, body: JSON.stringify({ success: true, poem: result.rows[0] }) });
      } catch (err) {
        resolve({ statusCode: 500, body: JSON.stringify({ error: 'Failed to save poem' }) });
      } finally {
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });

    busboy.end(Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8'));
  });
};
