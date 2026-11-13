"use client";

import Link from "next/link";
import { CONTACT } from "@/data/contact";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type SiteAssistantProps = {
  suggestedPrompts: string[];
};

function SparkleIcon() {
  return (
    <svg
      width="32"
      height="38"
      viewBox="0 0 32 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8.84109 35.4394L8.49193 36.2336C8.23635 36.8148 7.42511 36.8148 7.16966 36.2336L6.82037 35.4394C6.198 34.0236 5.07704 32.8963 3.678 32.2796L2.60224 31.8054C2.02061 31.549 2.02061 30.7101 2.60224 30.4534L3.6178 30.0056C5.05286 29.3732 6.19389 28.2043 6.80564 26.7403L7.16422 25.8821C7.41411 25.2841 8.24746 25.2841 8.49735 25.8821L8.85595 26.7403C9.46769 28.2043 10.6088 29.3732 12.0438 30.0056L13.0593 30.4534C13.6411 30.7101 13.6411 31.549 13.0593 31.8054L11.9836 32.2796C10.5847 32.8963 9.46346 34.0236 8.84109 35.4394Z"
        fill="#0A2244"
      />
      <path
        d="M19.1321 21.837L17.8905 24.6584C17.4133 25.7431 15.9006 25.7431 15.4234 24.6584L14.1818 21.837C13.0768 19.3259 11.088 17.3271 8.60742 16.2345L5.18988 14.7293C4.10337 14.2507 4.10337 12.6823 5.18988 12.2038L8.50068 10.7456C11.0452 9.625 13.0697 7.55206 14.1557 4.95526L15.4134 1.94833C15.8801 0.832329 17.4338 0.832329 17.9006 1.94833L19.1583 4.95526C20.2444 7.55195 22.2689 9.62486 24.8133 10.7456L28.124 12.2038C29.2104 12.6824 29.2104 14.2507 28.124 14.7293L24.7067 16.2345C22.2258 17.3271 20.237 19.3259 19.1321 21.837Z"
        fill="#0A2244"
      />
    </svg>
  );
}

function WaveformIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9.07386 23.3335V7.77796H11.6664V23.3335H9.07386ZM14.259 28.5187V2.59277H16.8516V28.5187H14.259ZM3.88867 18.1483V12.9631H6.48126V18.1483H3.88867ZM19.4442 23.3335V7.77796H22.0368V23.3335H19.4442ZM24.6294 18.1483V12.9631H27.222V18.1483H24.6294Z"
        fill="#0A2244"
      />
    </svg>
  );
}

export function SiteAssistant({ suggestedPrompts }: SiteAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
  }, [input]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  async function sendMessage(content?: string) {
    const text = (content ?? input).trim();
    if (!text || isLoading) return;

    const history = messages;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Request failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? "Sorry, I could not generate a response.",
        },
      ]);
    } catch (error) {
      const fallback =
        error instanceof Error
          ? error.message
          : `Sorry, something went wrong. Please contact ${CONTACT.name} at ${CONTACT.phone}.`;
      setMessages((prev) => [...prev, { role: "assistant", content: fallback }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    sendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function handleSuggestedPrompt(prompt: string) {
    setInput(prompt);
    window.setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleNewChat() {
    if (messages.length === 0) return;
    if (window.confirm("Start a new conversation? Your current chat will be cleared.")) {
      setMessages([]);
      setInput("");
    }
  }

  return (
    <>
      {!isOpen && (
        <div className="site-assistant-pill">
          <div className="site-assistant-pill-inner">
            <div className="site-assistant-pill-field">
              <SparkleIcon />
              <button
                type="button"
                className="site-assistant-pill-input"
                onClick={() => setIsOpen(true)}
                aria-label="Open site assistant"
              >
                Ask anything
              </button>
              <button
                type="button"
                className="site-assistant-pill-wave"
                onClick={() => setIsOpen(true)}
                aria-label="Open site assistant"
              >
                <WaveformIcon />
              </button>
            </div>
            <button
              type="button"
              className="site-assistant-pill-send"
              onClick={() => setIsOpen(true)}
              aria-label="Open chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="site-assistant-panel" role="dialog" aria-label="Site Assistant">
          <header className="site-assistant-header">
            <div>
              <h3>Site Assistant</h3>
              {messages.length > 0 && (
                <button type="button" onClick={handleNewChat}>
                  New chat
                </button>
              )}
            </div>
            <button
              type="button"
              className="site-assistant-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          <div className="site-assistant-body" role="log" aria-live="polite">
            {messages.length === 0 ? (
              <div className="site-assistant-welcome">
                <p className="site-assistant-welcome-title">Welcome to Butler Signs</p>
                <p className="site-assistant-welcome-sub">How can I help you today?</p>
                <div className="site-assistant-suggestions">
                  <p>Suggested questions :</p>
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleSuggestedPrompt(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="site-assistant-messages">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`site-assistant-message site-assistant-message-${message.role}`}
                  >
                    {message.content}
                  </div>
                ))}
                {isLoading && (
                  <div className="site-assistant-message site-assistant-message-assistant site-assistant-loading">
                    <span className="site-assistant-spinner" aria-hidden="true" />
                    Thinking...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <footer className="site-assistant-footer">
            <form className="site-assistant-form" onSubmit={handleSubmit}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
                maxLength={1000}
                disabled={isLoading}
                aria-label="Chat message input"
              />
              <button type="submit" disabled={!input.trim() || isLoading} aria-label="Send message">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
            <p>
              Press Enter to send • AI responses may vary •{" "}
              <Link href="/book">Book online</Link>
            </p>
          </footer>
        </div>
      )}
    </>
  );
}
