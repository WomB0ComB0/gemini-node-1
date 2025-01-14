import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: ".env.local" });;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const prompt =
    "Write a sonnet about a programmers life in the 21st century";

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text
  console.log(text)
}

run()