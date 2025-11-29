import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { ManifestoAnalysis } from "../types";

const processEnvApiKey = process.env.GEMINI_API_KEY;

// Schema for structured output
const analysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    englishTranslation: {
      type: SchemaType.STRING,
      description: "A professional and eloquent English translation of the Urdu manifesto.",
    },
    coreValues: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING, description: "One word value name (e.g., Integrity, Service)" },
          score: { type: SchemaType.NUMBER, description: "A hypothetical score out of 100 based on emphasis in text" },
          description: { type: SchemaType.STRING, description: "Short explanation of how this applies to the user." }
        },
        required: ["name", "score", "description"]
      },
      description: "Extract 5 core values from the text."
    },
    dailyMotivation: {
      type: SchemaType.STRING,
      description: "A short, inspiring quote or thought derived from the manifesto for today.",
    },
    suggestedActions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "3 specific, actionable tasks the user can do today to live by this manifesto."
    }
  },
  required: ["englishTranslation", "coreValues", "dailyMotivation", "suggestedActions"]
};

export const analyzeManifesto = async (urduText: string): Promise<ManifestoAnalysis> => {
  if (!processEnvApiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenerativeAI(processEnvApiKey!);

  try {
    const model = ai.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
      systemInstruction: "You are a wise mentor and life coach. Your tone is dignified, encouraging, and professional."
    });

    const result = await model.generateContent(
      `Analyze the following personal mission statement (Manifesto) provided in Urdu. 
      
      Urdu Text: "${urduText}"
      
      Provide a structured analysis including an English translation, core values extraction with relative weights (for a chart), a daily motivation derived from it, and 3 specific actionable steps for a student/professional context.`
    );

    const response = await result.response;
    const text = response.text();
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as ManifestoAnalysis;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};