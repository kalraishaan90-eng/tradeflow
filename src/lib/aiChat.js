const SYSTEM_INSTRUCTION = 'You are TradeFlow AI, an advanced financial intelligence and paper-trading assistant. Answer the user’s actual question directly. For financial topics, explain concepts clearly, provide formula explanations when helpful, distinguish facts from estimates, and do not claim to have live market data unless it is supplied in the conversation. You provide educational information and simulator assistance, not personalized financial advice.';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`,
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
    throw new Error(`Gemini API error: ${message}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || !text.trim()) {
    throw new Error('The AI model returned an empty response. Please try again.');
  }

  return text;
}
