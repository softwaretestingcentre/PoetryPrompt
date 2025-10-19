// Poetry styles and descriptions
const poetryStyles = [
  { name: 'Haiku', description: 'A three-line poem with a 5-7-5 syllable structure, often about nature.' },
  { name: 'Limerick', description: 'A five-line humorous poem with an AABBA rhyme scheme.' },
  { name: 'Sonnet', description: 'A 14-line poem with a specific rhyme scheme, often written in iambic pentameter.' },
  { name: 'Free Verse', description: 'Poetry without a fixed pattern of meter or rhyme.' },
  { name: 'Villanelle', description: 'A 19-line poem with two repeating rhymes and two refrains.' },
  { name: 'Ode', description: 'A poem of praise for a person, thing, or idea, often with elaborate structure.' },
  { name: 'Elegy', description: 'A reflective poem that laments the loss of someone or something.' },
  { name: 'Acrostic', description: 'A poem where the first letter of each line spells out a word or message.' },
  { name: 'Ballad', description: 'A narrative poem, often set to music, with short stanzas.' },
  { name: 'Cinquain', description: 'A five-line poem with a specific syllable count: 2, 4, 6, 8, 2.' }
];

const themes = [
  'Love', 'Nature', 'Adventure', 'Memory', 'Childhood', 'Loss', 'Hope', 'Dreams', 'Seasons', 'Friendship',
  'Change', 'Identity', 'Time', 'Family', 'Freedom', 'Journey', 'Solitude', 'Celebration', 'Conflict', 'Imagination',
  'Animals', 'Aging', 'Art', 'Asian American', 'Audio', 'Biography', 'Black History', 'City', 'Death', 'Disability',
  'Faith & Religion', 'Food', 'Gender', 'Hispanic', 'History & Politics', 'Home', 'Humor', 'Immigration', 'LGBTQIA',
  'Marriage', 'Music', 'Mythology & Folklore', 'Parenting', 'Places', 'Race', 'Science', 'Self', 'Spirituality',
  'Sports', 'Technology', 'Travel', 'War', 'Work'
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const style = getRandomItem(poetryStyles);
  const theme = getRandomItem(themes);
  return {
    statusCode: 200,
    body: JSON.stringify({
      theme,
      style: style.name,
      description: style.description
    })
  };
};
