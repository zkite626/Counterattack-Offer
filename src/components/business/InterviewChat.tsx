"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAI } from "@/contexts/AIContext";
import { useStreamResponse } from "@/lib/ai/stream";
import Icon from "@/components/ui/Icon";
import type { InterviewMessage } from "@/types";
import "./InterviewChat.css";

interface InterviewChatProps {
  jobTitle?: string;
}

export default function InterviewChat({ jobTitle }: InterviewChatProps) {
  const { activeModel } = useAI();
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { content: streamContent, isLoading: streamLoading, startStream } = useStreamResponse();

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamContent]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || streamLoading || !activeModel?.apiKey) return;

    // 添加用户消息
    const userMsg: InterviewMessage = {
      id: `user-${Date.now()}`,
      role: "student",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // 构造聊天历史
    const chatHistory = [
      ...messages.map((m) => ({
        role: m.role === "interviewer" ? "assistant" as const : "user" as const,
        content: m.content,
      })),
      { role: "user" as const, content: text },
    ];

    // 启动 SSE 流
    await startStream("/api/ai/chat", {
      messages: [
        {
          role: "system",
          content: `你是一位专业的${jobTitle ?? "岗位"}面试官。你在模拟真实面试场景，对学生进行提问和追问。要求：
1. 基于学生的回答进行深入追问
2. 指出回答中的亮点和可改进之处
3. 保持专业、友善的面试氛围
4. 一次只问一个问题`,
        },
        ...chatHistory,
      ],
      modelConfig: {
        baseUrl: activeModel.baseUrl,
        apiKey: activeModel.apiKey,
        model: activeModel.model,
      },
      stream: true,
    });
  }, [input, streamLoading, activeModel, messages, jobTitle, startStream]);

  // 流结束后将内容转为正式消息
  useEffect(() => {
    if (!streamLoading && streamContent && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "student") {
        const aiMsg: InterviewMessage = {
          id: `ai-${Date.now()}`,
          role: "interviewer",
          content: streamContent,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => {
          // 避免重复添加
          if (prev.length > 0 && prev[prev.length - 1].role === "interviewer") return prev;
          return [...prev, aiMsg];
        });
      }
    }
  }, [streamLoading, streamContent, messages]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="interview-chat">
      <div className="interview-chat__messages">
        {messages.length === 0 && (
          <div className="interview-chat__empty">
            <span className="interview-chat__empty-icon"><Icon name="mic" size="2rem" /></span>
            <p>开始模拟面试对话</p>
            <p className="interview-chat__empty-hint">输入你的回答，AI 面试官会继续追问</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`interview-chat__bubble interview-chat__bubble--${msg.role}`}
          >
            <div className="interview-chat__avatar">
              {msg.role === "interviewer" ? <Icon name="sparkle" size="1.25em" /> : <Icon name="user" size="1.25em" />}
            </div>
            <div className="interview-chat__msg-content">
              <div className="interview-chat__msg-role">
                {msg.role === "interviewer" ? "面试官" : "你"}
              </div>
              <div className="interview-chat__msg-text">{msg.content}</div>
            </div>
          </div>
        ))}

        {/* 流式输出中 */}
        {streamLoading && streamContent && (
          <div className="interview-chat__bubble interview-chat__bubble--interviewer">
            <div className="interview-chat__avatar"><Icon name="sparkle" size="1.25em" /></div>
            <div className="interview-chat__msg-content">
              <div className="interview-chat__msg-role">面试官</div>
              <div className="interview-chat__msg-text">
                {streamContent}
                <span className="interview-chat__cursor" />
              </div>
            </div>
          </div>
        )}

        {streamLoading && !streamContent && (
          <div className="interview-chat__bubble interview-chat__bubble--interviewer">
            <div className="interview-chat__avatar"><Icon name="sparkle" size="1.25em" /></div>
            <div className="interview-chat__msg-content">
              <div className="interview-chat__msg-role">面试官</div>
              <div className="interview-chat__typing">
                <span className="interview-chat__dot" />
                <span className="interview-chat__dot" />
                <span className="interview-chat__dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="interview-chat__input-area">
        <textarea
          className="interview-chat__textarea"
          placeholder="输入你的回答..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          disabled={streamLoading}
        />
        <button
          className="interview-chat__send-btn"
          onClick={sendMessage}
          disabled={!input.trim() || streamLoading}
        >
          发送
        </button>
      </div>
    </div>
  );
}
