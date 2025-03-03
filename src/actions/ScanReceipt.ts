"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
export const ScanReceipt = async (fileFormData: FormData) => {
  try {
    const genAi = new GoogleGenerativeAI(
      process.env.GOOGLE_GENERATIVE_AI_API_KEY as string,
    );

    const model = await genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

    const file: File = fileFormData.get("receipt") as File;

    if (!file) {
      throw new Error("No file found in the form data");
    }

    const buffer = await file.arrayBuffer();
    const fileBufferString = Buffer.from(buffer).toString("base64");

    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: Housing,Transportation,Groceries,Utilities,Entertainment,Food,Shopping,Healthcare,Education,Personal,Travel,Insurance,Gifts,Bills,Other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: fileBufferString,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);
      console.log("Scanned receipt data:", data);
      return {
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description,
        category: data.category,
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
    }
    throw err;
  }
};
