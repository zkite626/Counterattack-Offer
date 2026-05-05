"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAI } from "@/contexts/AIContext";
import { useStreamResponse } from "@/lib/ai/stream";
import type { ChatMessage } from "@/types";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import "./InterviewChat.css";

interface CareerQaChatProps {
  contextSummary: string;
}

interface ChatTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_QUESTIONS = [
  "我没有实习，怎么介绍自己更好？",
  "这个岗位适不适合我？",
  "如何把校园经历讲成岗位能力？",
  "面试被问到短板怎么答？",
];

function bubbleClass(role: ChatTurn["role"]): string {
  return role === "assistant" ? "interview-chat__bubble--interviewer" : "interview-chat__bubble--student";
}

export default function CareerQaChat({ contextSummary }: CareerQaChatProps) {
  const router = useRouter();
  const { activeModel } = useAI();
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    content: streamContent,
    isLoading: streamLoading,
    error: streamError,
    startStream,
    stopStream,
  } = useStreamResponse();

  const hasContext = useMemo(() => contextSummary.trim().length > 0, [contextSummary]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamContent]);

  useEffect(() => () => {
    stopStream();
  }, [stopStream]);

  const sendMessage = useCallback(
    async (rawText?: string) => {
      const text = (rawText ?? input).trim();
      if (!text || streamLoading || !activeModel) return;

      const userMessage: ChatTurn = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date().toISOString(),
      };
      const history: ChatMessage[] = [
        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
        { role: "user", content: text },
      ];

      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      await startStream("/ai/career-qa", {
        modelConfigId: activeModel.id,
        stream: true,
        input: {
          messages: history,
          contextSummary,
        },
      });
    },
    [activeModel, contextSummary, input, messages, startStream, streamLoading],
  );

  useEffect(() => {
    if (!streamLoading && streamContent && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.role === "user") {
        const assistantMessage: ChatTurn = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: streamContent,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => {
          if (prev.length > 0 && prev[prev.length - 1].role === "assistant") {
            return prev;
          }

          return [...prev, assistantMessage];
        });
      }
    }
  }, [messages, streamContent, streamLoading]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  if (!activeModel) {
    return (
      <div className="interview-chat">
        <div className="interview-chat__messages">
          <div className="interview-chat__empty">
            <span className="interview-chat__empty-icon">
              <Icon name="chat" size="2rem" />
            </span>
            <p>求职 AI 问答</p>
            <p className="interview-chat__empty-hint">请先在模型管理中选择可用 AI 模型</p>
            <div style={{ marginTop: "var(--space-4)" }}>
              <Button
                size="sm"
                icon={<Icon name="settings" size="1em" />}
                onClick={() => router.push("/settings")}
              >
                去模型管理
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-chat">
      <div className="interview-chat__messages">
        {messages.length === 0 && (
          <div className="interview-chat__empty">
            <span className="interview-chat__empty-icon">
              <Icon name="chat" size="2rem" />
            </span>
            <p>开始提问求职问题</p>
            <p className="interview-chat__empty-hint">
              可以聊简历、面试、岗位选择，也可以直接问职业规划
            </p>
            {!hasContext && (
              <p className="interview-chat__empty-hint">当前还没有接入个人信息，也能正常聊天</p>
            )}
            <div className="interview-chat__quick-prompts">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  className="interview-chat__quick-prompt"
                  onClick={() => setInput(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`interview-chat__bubble ${bubbleClass(message.role)}`}
          >
            <div className="interview-chat__avatar">
              {message.role === "assistant" ? (
                <Icon name="sparkle" size="1.25em" />
              ) : (
                <Icon name="user" size="1.25em" />
              )}
            </div>
            <div className="interview-chat__msg-content">
              <div className="interview-chat__msg-role">
                {message.role === "assistant" ? "求职顾问" : "你"}
              </div>
              <div className="interview-chat__msg-text">{message.content}</div>
            </div>
          </div>
        ))}

        {streamLoading && streamContent && (
          <div className="interview-chat__bubble interview-chat__bubble--interviewer">
            <div className="interview-chat__avatar">
              <Icon name="sparkle" size="1.25em" />
            </div>
            <div className="interview-chat__msg-content">
              <div className="interview-chat__msg-role">求职顾问</div>
              <div className="interview-chat__msg-text">
                {streamContent}
                <span className="interview-chat__cursor" />
              </div>
            </div>
          </div>
        )}

        {streamLoading && !streamContent && (
          <div className="interview-chat__bubble interview-chat__bubble--interviewer">
            <div className="interview-chat__avatar">
              <Icon name="sparkle" size="1.25em" />
            </div>
            <div className="interview-chat__msg-content">
              <div className="interview-chat__msg-role">求职顾问</div>
              <div className="interview-chat__typing">
                <span className="interview-chat__dot" />
                <span className="interview-chat__dot" />
                <span className="interview-chat__dot" />
              </div>
            </div>
          </div>
        )}

        {streamError && !streamLoading && (
          <div className="interview-chat__bubble interview-chat__bubble--interviewer">
            <div className="interview-chat__avatar">
              <Icon name="warning" size="1.1em" />
            </div>
            <div className="interview-chat__msg-content">
              <div className="interview-chat__msg-role">求职顾问</div>
              <div className="interview-chat__msg-text">{streamError}</div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="interview-chat__input-area">
        <textarea
          className="interview-chat__textarea"
          placeholder="输入你的求职问题..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          disabled={streamLoading}
        />
        <button
          className="interview-chat__send-btn"
          onClick={() => void sendMessage()}
          disabled={!input.trim() || streamLoading}
        >
          发送
        </button>
      </div>
    </div>
  );
}
