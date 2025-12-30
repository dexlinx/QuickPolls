
import { GoogleGenAI, Type } from "@google/genai";
import { Poll, PollOption } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generatePollSuggestions = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a poll question and 4 multiple-choice options for the topic: "${topic}". Return the response as a single valid JSON object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["question", "options"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return null;
  }
};

export const analyzePollResults = async (poll: Poll) => {
  try {
    const dataString = poll.options.map(o => `${o.text}: ${o.votes} votes`).join(', ');
    const prompt = `Analyze these poll results for the question: "${poll.question}". 
    The distribution is: ${dataString}. 
    Provide a brief, insightful 2-sentence summary of what these results might indicate about the class's understanding or preference.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error analyzing results:", error);
    return "Analysis unavailable at this time.";
  }
};
