import {
  buildChatSystemPrompt,
  CHAT_MODEL,
  MAX_HISTORY_TURNS,
  MAX_MESSAGE_LENGTH,
  type ChatTurn,
} from "@/lib/chat-agent";
import { CONTACT } from "@/data/contact";
import { NextResponse } from "next/server";

type ChatRequestBody = {
  message?: unknown;
  history?: unknown;
};

function isChatTurn(value: unknown): value is ChatTurn {
  if (!value || typeof value !== "object") return false;
  const turn = value as Record<string, unknown>;
  return (
    (turn.role === "user" || turn.role === "assistant") &&
    typeof turn.content === "string" &&
    turn.content.trim().length > 0
  );
}

function parseBody(body: ChatRequestBody): { message: string; history: ChatTurn[] } | null {
  if (typeof body.message !== "string") return null;

  const message = body.message.trim();
  if (!message || message.length > MAX_MESSAGE_LENGTH) return null;

  const history: ChatTurn[] = [];
  if (Array.isArray(body.history)) {
    for (const turn of body.history.slice(-MAX_HISTORY_TURNS)) {
      if (!isChatTurn(turn)) continue;
      if (turn.content.length > MAX_MESSAGE_LENGTH) continue;
      history.push({ role: turn.role, content: turn.content.trim() });
    }
  }

  return { message, history };
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: `Chat is not available at the moment. Please contact ${CONTACT.name} at ${CONTACT.phone}.` },
      { status: 503 },
    );
  }

  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parseBody(body);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid message or history." }, { status: 400 });
  }

  const { message, history } = parsed;

  const messages = [
    { role: "system" as const, content: buildChatSystemPrompt() },
    ...history.map((turn) => ({
      role: turn.role,
      content: turn.content,
    })),
    { role: "user" as const, content: message },
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages,
        temperature: 0.3,
        max_tokens: 500,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("[POST /api/chat] OpenAI error", response.status, detail);
      return NextResponse.json(
        { error: `The assistant is temporarily unavailable. Please contact ${CONTACT.name} at ${CONTACT.phone}.` },
        { status: 502 },
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };

    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json(
        { error: "Empty response from assistant." },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[POST /api/chat]", error);
    return NextResponse.json(
      { error: `Unable to reach the assistant. Please contact ${CONTACT.name} at ${CONTACT.phone}.` },
      { status: 502 },
    );
  }
}
