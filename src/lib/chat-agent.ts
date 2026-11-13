import fs from "node:fs";
import path from "node:path";
import { CONTACT } from "@/data/contact";

/** Cheapest current OpenAI chat model suitable for site assistants. */
export const CHAT_MODEL = "gpt-4o-mini";

const KNOWLEDGE_PATH = path.join(
  process.cwd(),
  "content",
  "chat-agent-knowledge.md",
);

export type ChatRole = "user" | "assistant";

export type ChatTurn = {
  role: ChatRole;
  content: string;
};

let cachedKnowledge: string | null = null;

export function loadChatAgentKnowledge(): string {
  if (cachedKnowledge) return cachedKnowledge;
  cachedKnowledge = fs.readFileSync(KNOWLEDGE_PATH, "utf8");
  return cachedKnowledge;
}

/** Reset cached knowledge (for tests or hot edits in dev). */
export function clearChatAgentKnowledgeCache(): void {
  cachedKnowledge = null;
}

export function buildChatSystemPrompt(): string {
  const knowledge = loadChatAgentKnowledge();

  return [
    "You are the Site Assistant for Butler Signs, a sign shop in Suitland, Maryland.",
    "Use ONLY the source-of-truth document below. Do not rely on outside knowledge.",
    `If the answer is not in the document, say so and encourage the visitor to contact ${CONTACT.name} at ${CONTACT.phone} or ${CONTACT.email}.`,
    `Every dead-end reply must include contacting ${CONTACT.name} at ${CONTACT.phone} or ${CONTACT.email}.`,
    "",
    "--- SOURCE OF TRUTH ---",
    knowledge,
    "--- END SOURCE OF TRUTH ---",
  ].join("\n");
}

const DEFAULT_SUGGESTED_PROMPTS = [
  "What services do you offer?",
  "What are your hours?",
  "How do I book an appointment?",
  "Tell me about Butler Signs",
];

export function getSuggestedPrompts(): string[] {
  const knowledge = loadChatAgentKnowledge();
  const section = knowledge.split("## Suggested starter questions")[1];
  if (!section) return DEFAULT_SUGGESTED_PROMPTS;

  const prompts = section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);

  return prompts.length > 0 ? prompts : DEFAULT_SUGGESTED_PROMPTS;
}

export const MAX_MESSAGE_LENGTH = 1000;
export const MAX_HISTORY_TURNS = 12;
