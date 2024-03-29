import dotenv from 'dotenv';
dotenv.config({ path: ".env.local" });
import readline from 'readline';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let isAwaitingResponse = false;

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 500
    }
  })

  function askAndRespond() {
    if (!isAwaitingResponse) {
      rl.question("You: ", async (message) => {
        if (message.toLowerCase() === "exit") {
          rl.close();
          return;
        } else {
          isAwaitingResponse = true;
          try {
            const result = await chat.sendMessageStream(message)
            let text = "";
            for await (const chunk of result.stream) {
              const chunkText = await chunk.text();
              console.log(`Gemini: ${chunkText.replace(/<[^>]*>?/gm, "")}`)
              text += chunkText;
            }
            isAwaitingResponse = false;
            askAndRespond()
          } catch (error) {
            console.log("Error: ", error)
            isAwaitingResponse = false;
            askAndRespond()
          }
        }
      }
      )
    } else {
      console.log("PLease wait for the current response to complete")
    }
  }

  askAndRespond()
}

run()