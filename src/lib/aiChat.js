const SYSTEM_INSTRUCTION = 'You are TradeFlow AI, an advanced financial intelligence and paper-trading assistant. Answer the user’s actual question directly. For financial topics, explain concepts clearly, provide formula explanations when helpful, distinguish facts from estimates, and do not claim to have live market data unless it is supplied in the conversation. You provide educational information and simulator assistance, not personalized financial advice.';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Fallback priority: if a model encounters high demand (503) or rate limits, seamlessly try the next one
const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-flash-lite-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash'
];

let currentActiveModel = 'gemini-3.5-flash';

export function getActiveModelName() {
  switch (currentActiveModel) {
    case 'gemini-3.5-flash': return 'Gemini 3.5 Flash';
    case 'gemini-flash-lite-latest': return 'Gemini Flash-Lite';
    case 'gemini-3.1-flash-lite': return 'Gemini 3.1 Flash-Lite';
    case 'gemini-3.8-flash': return 'Gemini 3.8 Flash';
    default: return 'Gemini Flash';
  }
}

export async function generateAIReply(history = [], userMessage = '') {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured.');
  }

  // Find the first user message so model greetings at the start don't confuse multi-turn ordering
  const firstUserMessage = history.findIndex(message => message.role === 'user');
  const rawHistory = history
    .slice(firstUserMessage < 0 ? history.length : firstUserMessage)
    .filter(message => message.content && (message.role === 'user' || message.role === 'ai' || message.role === 'model'))
    .slice(-20);

  // Group consecutive messages with the same role into valid alternating turns
  const formattedTurns = [];
  for (const msg of rawHistory) {
    const role = msg.role === 'user' ? 'user' : 'model';
    if (formattedTurns.length > 0 && formattedTurns[formattedTurns.length - 1].role === role) {
      formattedTurns[formattedTurns.length - 1].parts[0].text += `\n${msg.content.slice(0, 4000)}`;
    } else {
      formattedTurns.push({
        role,
        parts: [{ text: msg.content.slice(0, 4000) }]
      });
    }
  }

  // Append latest user message
  if (formattedTurns.length > 0 && formattedTurns[formattedTurns.length - 1].role === 'user') {
    formattedTurns[formattedTurns.length - 1].parts[0].text += `\n${userMessage}`;
  } else {
    formattedTurns.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });
  }

  const payload = {
    contents: formattedTurns,
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048
    }
  };

  let lastErrorMessage = '';

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const message = errData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        lastErrorMessage = message;
        console.warn(`Gemini model ${model} failed (${response.status}): ${message}. Trying next fallback model...`);
        continue;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim()) {
        currentActiveModel = model;
        return text;
      }
    } catch (err) {
      console.warn(`Gemini model ${model} request error: ${err.message}. Trying next fallback model...`);
      lastErrorMessage = err.message;
    }
  }

  throw new Error(`Gemini API error: ${lastErrorMessage || 'Service temporarily unavailable. Please try again.'}`);
}
