const express = require('express');
const path = require('path');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ dest: 'uploads/' });

// OCR endpoint
app.post('/api/ocr', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    const result = await Tesseract.recognize(req.file.path, 'eng');
    res.json({ text: result.data.text });
  } catch (err) {
    res.status(500).json({ error: 'OCR failed' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Poetry styles and descriptions (sampled from Scribophile)
const poetryStyles = [
  {
    name: 'Haiku',
    description: 'A three-line poem with a 5-7-5 syllable structure, often about nature.'
  },
  {
    name: 'Limerick',
    description: 'A five-line humorous poem with an AABBA rhyme scheme.'
  },
  {
    name: 'Sonnet',
    description: 'A 14-line poem with a specific rhyme scheme, often written in iambic pentameter.'
  },
  {
    name: 'Free Verse',
    description: 'Poetry without a fixed pattern of meter or rhyme.'
  },
  {
    name: 'Villanelle',
    description: 'A 19-line poem with two repeating rhymes and two refrains.'
  },
  {
    name: 'Ode',
    description: 'A poem of praise for a person, thing, or idea, often with elaborate structure.'
  },
  {
    name: 'Elegy',
    description: 'A reflective poem that laments the loss of someone or something.'
  },
  {
    name: 'Acrostic',
    description: 'A poem where the first letter of each line spells out a word or message.'
  },
  {
    name: 'Ballad',
    description: 'A narrative poem, often set to music, with short stanzas.'
  },
  {
    name: 'Cinquain',
    description: 'A five-line poem with a specific syllable count: 2, 4, 6, 8, 2.'
  }
  // Add more styles as needed
];

// Example themes (expand as needed or extract from PDF)
const themes = [
  'Love',
  'Nature',
  'Adventure',
  'Memory',
  'Childhood',
  'Loss',
  'Hope',
  'Dreams',
  'Seasons',
  'Friendship',
  'Change',
  'Identity',
  'Time',
  'Family',
  'Freedom',
  'Journey',
  'Solitude',
  'Celebration',
  'Conflict',
  'Imagination'
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

app.get('/api/prompt', (req, res) => {
  const style = getRandomItem(poetryStyles);
  const theme = getRandomItem(themes);
  res.json({
    theme,
    style: style.name,
    description: style.description
  });
});

app.listen(PORT, () => {
  console.log(`PoetryPrompt server running on http://localhost:${PORT}`);
});
