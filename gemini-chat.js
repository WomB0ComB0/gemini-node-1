import dotenv from 'dotenv';
dotenv.config({ path: ".env.local" });
import readline from 'readline';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 500
    }
  })

  async function askAndRespond() {
    rl.question('You: ', async (message) => {
      if (message.toLowerCase() === 'exit') {
        rl.close();
        return;
      } else {
        const result = await chat.sendMessageStream(message)
        const response = await result.response
        console.log(`Gemini: ${response.text().toString().replace(
          /<[^>]*>?/gm,
          ''
        )}`)
        askAndRespond()
      }
    })
  }

  askAndRespond()
}

run()