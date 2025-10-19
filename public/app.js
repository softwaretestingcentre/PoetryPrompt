// Placeholder for frontend logic
// Will connect to backend for prompts, timer, and poem submission

document.addEventListener('DOMContentLoaded', () => {
  // Poems search and display
  const poemsList = document.getElementById('poems-list');
  const searchPoems = document.getElementById('search-poems');

  async function fetchAndDisplayPoems(filter = '') {
    try {
  const res = await fetch('/.netlify/functions/poems');
      const data = await res.json();
      let poems = data.poems || [];
      if (filter) {
        const f = filter.toLowerCase();
        poems = poems.filter(p =>
          (p.theme && p.theme.toLowerCase().includes(f)) ||
          (p.style && p.style.toLowerCase().includes(f)) ||
          (p.text && p.text.toLowerCase().includes(f))
        );
      }
      poemsList.innerHTML = poems.length ? poems.map(poem => `
        <div class="poem-card">
          <div class="poem-meta">
            <strong>${poem.theme || ''}</strong> | <em>${poem.style || ''}</em> <span style="float:right;">${new Date(poem.created_at).toLocaleString()}</span>
          </div>
          <div>${poem.text ? poem.text.replace(/\n/g, '<br>') : ''}</div>
          ${poem.photo_url ? `<div style='margin-top:8px;'><img src='${poem.photo_url}' alt='Poem photo' style='max-width:120px;max-height:120px;border-radius:6px;'></div>` : ''}
        </div>
      `).join('') : '<div>No poems found.</div>';
    } catch (err) {
      poemsList.innerHTML = '<div>Error loading poems.</div>';
    }
  }

  searchPoems.addEventListener('input', e => {
    fetchAndDisplayPoems(e.target.value);
  });

  // Initial load
  fetchAndDisplayPoems();
  const getPromptBtn = document.getElementById('get-prompt');
  const promptDisplay = document.getElementById('prompt-display');
  const timerSection = document.getElementById('timer-section');
  const startTimerBtn = document.getElementById('start-timer');
  const timerSpan = document.getElementById('timer');
  const poemSection = document.getElementById('poem-section');
  const submitPoemBtn = document.getElementById('submit-poem');
  const styleInfo = document.getElementById('style-info');


  let timerInterval;
  let timeLeft = 20 * 60; // 20 minutes in seconds
  let styleShort = '';
  let styleLong = '';
  let styleExpanded = false;

  // Example longer descriptions for styles
  const styleDetails = {
    'Haiku': 'A haiku is a traditional Japanese poem with three lines and a 5-7-5 syllable structure. It often focuses on nature and the seasons, capturing a moment or feeling in a concise way.',
    'Limerick': 'A limerick is a humorous five-line poem with an AABBA rhyme scheme. The first, second, and fifth lines are longer, while the third and fourth are shorter. Limericks are known for their playful tone.',
    'Sonnet': 'A sonnet is a 14-line poem, usually written in iambic pentameter. The most famous forms are the Shakespearean and Petrarchan sonnets, each with its own rhyme scheme. Sonnets often explore themes of love, beauty, and time.',
    'Free Verse': 'Free verse poems do not follow a fixed meter or rhyme scheme. This style allows poets to express themselves with greater freedom, focusing on imagery, emotion, and natural speech patterns.',
    'Villanelle': 'A villanelle is a 19-line poem with two repeating rhymes and two refrains. The structure consists of five tercets followed by a quatrain. Famous examples include "Do not go gentle into that good night" by Dylan Thomas.',
    'Ode': 'An ode is a poem of praise, often addressed to a person, object, or idea. Odes can be formal or informal, and may use elaborate language and structure to celebrate their subject.',
    'Elegy': 'An elegy is a reflective poem that laments the loss of someone or something. Elegies often express sorrow, remembrance, and consolation.',
    'Acrostic': 'In an acrostic poem, the first letter of each line spells out a word or message. This style is often used for names or themes, and can be playful or serious.',
    'Ballad': 'A ballad is a narrative poem, often set to music, with short stanzas and a simple rhyme scheme. Ballads tell stories of love, adventure, or tragedy.',
    'Cinquain': 'A cinquain is a five-line poem with a specific syllable count: 2, 4, 6, 8, 2. Cinquains are concise and focus on vivid imagery.'
    // Add more styles as needed
  };

  getPromptBtn.addEventListener('click', async () => {
    // Reset timer and submission state
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    timerSpan.textContent = '';
    startTimerBtn.disabled = false;
    submitPoemBtn.disabled = true;
    try {
  const res = await fetch('/.netlify/functions/prompt');
      const data = await res.json();
      promptDisplay.textContent = `Theme: ${data.theme} | Style: ${data.style}`;
      styleShort = data.description;
      styleLong = styleDetails[data.style] || data.description;
      styleExpanded = false;
      renderStyleInfo();
      timerSection.style.display = 'block';
      poemSection.style.display = 'none';
    } catch (err) {
      promptDisplay.textContent = 'Error fetching prompt.';
      styleInfo.textContent = '';
    }
  });

  function renderStyleInfo() {
    styleInfo.innerHTML = `
      <span>${styleExpanded ? styleLong : styleShort}</span>
      <a href="#" id="toggle-style-info" class="expand-link">${styleExpanded ? 'Show less' : 'More info'}</a>
    `;
    const toggleLink = document.getElementById('toggle-style-info');
    if (toggleLink) {
      toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        styleExpanded = !styleExpanded;
        renderStyleInfo();
      });
    }
  }


  startTimerBtn.addEventListener('click', () => {
    timeLeft = 20 * 60;
    timerSpan.textContent = formatTime(timeLeft);
    timerSpan.className = 'timer-active';
    timerSection.style.display = 'block';
    poemSection.style.display = 'block';
    startTimerBtn.disabled = true;
    submitPoemBtn.disabled = false;
    timerInterval = setInterval(() => {
      timeLeft--;
      timerSpan.textContent = formatTime(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerSpan.textContent = 'Time is up!';
        timerSpan.className = 'timer-ended';
        startTimerBtn.disabled = false;
        submitPoemBtn.disabled = true;
      }
    }, 1000);
  });


  const photoInput = document.getElementById('poem-photo');
  const photoPreviewContainer = document.getElementById('photo-preview-container');
  const photoPreview = document.getElementById('photo-preview');

  photoInput.addEventListener('change', async () => {
    if (photoInput.files.length) {
      // Show preview in right panel
      const file = photoInput.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        photoPreview.src = e.target.result;
        photoPreviewContainer.style.display = 'flex';
      };
      reader.readAsDataURL(file);

      // OCR
      const formData = new FormData();
      formData.append('photo', file);
      try {
        submitPoemBtn.textContent = 'Extracting...';
        submitPoemBtn.disabled = true;
        const res = await fetch('/.netlify/functions/ocr', {
          method: 'POST',
          body: formData
        });
        const result = await res.json();
        if (result.text) {
          document.getElementById('poem-input').value = result.text.trim();
        } else {
          alert('No text found in image.');
        }
      } catch (err) {
        alert('OCR failed.');
      } finally {
        submitPoemBtn.textContent = 'Submit Poem';
        submitPoemBtn.disabled = false;
      }
    } else {
      photoPreviewContainer.style.display = 'none';
      photoPreview.src = '';
    }
  });

  submitPoemBtn.addEventListener('click', async () => {
    const poemText = document.getElementById('poem-input').value.trim();
    if (!poemText && !photoInput.files.length) {
      alert('Please type a poem or upload a photo.');
      return;
    }
    // Stop timer when submitting poem
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerSpan.textContent = 'Timer stopped';
      timerSpan.className = 'timer-ended';
      startTimerBtn.disabled = false;
    }
    submitPoemBtn.disabled = true;
    submitPoemBtn.textContent = 'Submitting...';
    // Prepare form data
    const formData = new FormData();
    formData.append('text', poemText);
    // Get theme and style from prompt
    const promptText = promptDisplay.textContent;
    let theme = '', style = '';
    if (promptText.includes('Theme:') && promptText.includes('| Style:')) {
      const themeMatch = promptText.match(/Theme: ([^|]+)\s*\|/);
      const styleMatch = promptText.match(/Style: (.+)$/);
      if (themeMatch) theme = themeMatch[1].trim();
      if (styleMatch) style = styleMatch[1].trim();
    }
    formData.append('theme', theme);
    formData.append('style', style);
    if (photoInput.files.length) {
      formData.append('photo', photoInput.files[0]);
    }
    try {
  const res = await fetch('/.netlify/functions/submit', { method: 'POST', body: formData });
      const result = await res.json();
      if (result.success) {
        alert('Poem submitted!');
        submitPoemBtn.textContent = 'Submit Poem';
        submitPoemBtn.disabled = false;
        document.getElementById('poem-input').value = '';
        photoInput.value = '';
        photoPreviewContainer.style.display = 'none';
        photoPreview.src = '';
      } else {
        alert('Submission failed.');
        submitPoemBtn.textContent = 'Submit Poem';
        submitPoemBtn.disabled = false;
      }
    } catch (err) {
      alert('Submission failed.');
      submitPoemBtn.textContent = 'Submit Poem';
      submitPoemBtn.disabled = false;
    }
  });

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
});
