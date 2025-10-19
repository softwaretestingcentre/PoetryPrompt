const Tesseract = require('tesseract.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Netlify Lambda does not support Express middleware directly, so we parse multipart manually
const Busboy = require('busboy');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  return new Promise((resolve, reject) => {
    const busboy = new Busboy({ headers: event.headers });
    let filePath = null;
    let fileWriteStream = null;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      filePath = path.join('/tmp', filename);
      fileWriteStream = fs.createWriteStream(filePath);
      file.pipe(fileWriteStream);
    });

    busboy.on('finish', async () => {
      if (!filePath) {
        resolve({ statusCode: 400, body: JSON.stringify({ error: 'No file uploaded' }) });
        return;
      }
      try {
        const result = await Tesseract.recognize(filePath, 'eng');
        resolve({ statusCode: 200, body: JSON.stringify({ text: result.data.text }) });
      } catch (err) {
        resolve({ statusCode: 500, body: JSON.stringify({ error: 'OCR failed' }) });
      } finally {
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });

    busboy.end(Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8'));
  });
};
