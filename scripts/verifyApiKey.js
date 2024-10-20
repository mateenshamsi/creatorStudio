require('dotenv').config({ path: '.env.local' })
const Groq = require("groq-sdk");

async function verifyApiKey() {
  try {
    console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Set' : 'Not set');
    const groq = new Groq();
    const models = await groq.models.list();
    console.log('API key is valid. Available models:', models.data.map(m => m.id));
  } catch (error) {
    console.error('Error verifying API key:', error.message);
  }
}

verifyApiKey();