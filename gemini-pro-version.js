import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });;
import * as fs from "fs";
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path).toString("base64")),
      mimeType
    }
  }
}

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = "Is there anything i can improve on my logo?";

  const imageParts = [fileToGenerativePart("MyLogo.png", "image/png")];

  const result = await model.generateContent(prompt, ...imageParts);
  const response = await result.response;
  const text = response.text();
  console.log(text)
}

run()