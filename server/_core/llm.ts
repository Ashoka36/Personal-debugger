import { ENV } from './env';

// Simple Gemini LLM client
export async function callGemini(prompt: string): Promise<string> {
  if (!ENV.geminiApiKey) {
    return "Gemini API key not configured. Please set GEMINI_API_KEY environment variable.";
  }
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${ENV.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
  } catch (error) {
    console.error('Gemini API error:', error);
    return `Error calling Gemini: ${error}`;
  }
}
