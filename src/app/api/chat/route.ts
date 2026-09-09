import { NextRequest, NextResponse } from 'next/server';

type ChatMessage = {
  role: 'assistant' | 'user';
  content: string;
};

type GithubRepository = {
  name?: string;
  description?: string | null;
  html_url?: string;
  homepage?: string | null;
  language?: string | null;
  stargazers_count?: number;
  fork?: boolean;
};

const baseInstructions = `Eres el asistente personal de Juan Carlos Iasenza. Responde preguntas sobre su experiencia, tecnologías, proyectos y formas de contacto usando únicamente la información disponible en este portafolio. No inventes datos. Si no sabes algo, dilo claramente. Responde en el idioma de la pregunta.

Información conocida: Juan Carlos es desarrollador Full Stack y trabaja con React, TypeScript, JavaScript, Next.js, Node.js, Python y Django. Sus proyectos destacados incluyen Panorama y Owly. Para contacto, el portafolio ofrece email, teléfono, WhatsApp, LinkedIn y GitHub.`;

async function getPortfolioInstructions() {
  const username = process.env.GITHUB_USERNAME || 'jciasenza';
  const headers: HeadersInit = { Accept: 'application/vnd.github.v3+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!response.ok) return baseInstructions;

    const repositories = (await response.json() as GithubRepository[])
      .filter((repository) => !repository.fork)
      .sort((first, second) => (second.stargazers_count || 0) - (first.stargazers_count || 0));

    const repositoryContext = repositories.length > 0
      ? repositories.map((repository) => [
        `- ${repository.name || 'Sin nombre'}`,
        repository.description || 'Sin descripción',
        repository.language ? `Lenguaje: ${repository.language}` : null,
        `Estrellas: ${repository.stargazers_count || 0}`,
        `URL: ${repository.homepage || repository.html_url || 'No disponible'}`,
      ].filter(Boolean).join(' | ')).join('\n')
      : 'No hay repositorios disponibles en este momento.';

    return `${baseInstructions}\n\nRepositorios públicos que aparecen en el portafolio:\n${repositoryContext}`;
  } catch (error) {
    console.error('Error loading repository context for chat:', error);
    return baseInstructions;
  }
}

async function callGemini(messages: ChatMessage[], instructions: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

  if (!apiKey) throw new Error('GEMINI_API_KEY no está configurada.');

  const contents = messages.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }],
  }));
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  let response: Response | undefined;
  let data: any = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: instructions }] },
        contents,
        generationConfig: { temperature: 0.4 },
      }),
      cache: 'no-store',
    });
    data = await response.json().catch(() => null);

    if (response.status !== 503 || attempt === 2) break;
    await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
  }

  if (!response) throw new Error('No se recibió respuesta de Gemini.');

  if (!response.ok) {
    console.error('Gemini API error:', response.status, data);
    const providerMessage = data?.error?.message;
    throw new Error(`Gemini (${response.status}): ${providerMessage || 'no pudo procesar el mensaje.'}`);
  }

  const message = data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text || '')
    .join('')
    .trim();

  if (!message) throw new Error('Gemini devolvió una respuesta vacía.');
  return message;
}

async function callGroq(messages: ChatMessage[], language: string, instructions: string) {
  const apiKey = process.env.GROQ_API_KEY;
  const configuredModel = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

  if (!apiKey) throw new Error('GROQ_API_KEY no está configurada.');

  const modelsResponse = await fetch('https://api.groq.com/openai/v1/models', {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: 'no-store',
  });
  const modelsData = await modelsResponse.json().catch(() => null);
  const availableModels = Array.isArray(modelsData?.data)
    ? modelsData.data.map((item: { id?: string }) => item.id).filter((id: unknown): id is string => typeof id === 'string')
    : [];
  const fallbackModels = ['openai/gpt-oss-20b', 'openai/gpt-oss-120b', 'meta-llama/llama-4-scout-17b-16e-instruct'];
  const model = availableModels.includes(configuredModel)
    ? configuredModel
    : fallbackModels.find((candidate) => availableModels.includes(candidate));

  if (!model) throw new Error('Groq no tiene modelos de chat disponibles para esta clave.');

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        { role: 'system', content: `${instructions}\nIdioma preferido: ${language}.` },
        ...messages,
      ],
    }),
    cache: 'no-store',
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error('Groq API error:', response.status, data);
    const providerMessage = data?.error?.message;
    throw new Error(`Groq (${response.status}): ${providerMessage || 'no pudo procesar el mensaje.'}`);
  }

  const message = data?.choices?.[0]?.message?.content;
  if (typeof message !== 'string' || !message.trim()) throw new Error('Groq devolvió una respuesta vacía.');
  return message.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { messages?: ChatMessage[]; language?: 'es' | 'en'; provider?: string };

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: 'El historial de mensajes es obligatorio.' }, { status: 400 });
    }

    const provider = (body.provider || process.env.AI_PROVIDER || 'gemini').toLowerCase();
    if (provider !== 'gemini' && provider !== 'groq') {
      return NextResponse.json({ error: 'Proveedor inválido. Usa gemini o groq.' }, { status: 400 });
    }
    const instructions = await getPortfolioInstructions();
    const message = provider === 'groq'
      ? await callGroq(body.messages, body.language || 'es', instructions)
      : await callGemini(body.messages, instructions);

    return NextResponse.json({ message, provider });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'No se pudo conectar con el agente.' },
      { status: 502 }
    );
  }
}
