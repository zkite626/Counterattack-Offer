import { useState, useCallback, useRef } from 'react';

// SSE 数据行解析：从 SSE 文本中提取 content 字段
function parseSSELine(line: string): string | null {
  if (!line.startsWith('data: ')) return null;
  const data = line.slice(6).trim();
  if (data === '[DONE]') return null;
  try {
    const parsed = JSON.parse(data);
    return parsed.choices?.[0]?.delta?.content ?? null;
  } catch {
    return null;
  }
}

/**
 * 将 fetch Response 转换为可消费的文本流
 * 返回一个 ReadableStream，每个 chunk 是解码后的文本内容
 */
export function createSSEStream(response: Response): ReadableStream<string> {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body 为空');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  return new ReadableStream<string>({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        // 保留最后一行（可能不完整）
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const content = parseSSELine(line);
          if (content) {
            controller.enqueue(content);
          }
        }
      } catch (error) {
        controller.error(error);
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}

// useStreamResponse hook 的返回类型
interface UseStreamResponseReturn {
  content: string;
  isLoading: boolean;
  error: string | null;
  startStream: (url: string, body: Record<string, unknown>) => Promise<void>;
  stopStream: () => void;
}

/**
 * 前端消费 SSE 流的 React Hook
 * 用于面试对话等需要流式输出的场景
 */
export function useStreamResponse(): UseStreamResponseReturn {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopStream = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsLoading(false);
  }, []);

  const startStream = useCallback(
    async (url: string, body: Record<string, unknown>) => {
      // 终止之前的请求
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setContent('');
      setError(null);
      setIsLoading(true);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
          credentials: 'include',
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          throw new Error(errData?.error?.message ?? `请求失败 (${response.status})`);
        }

        const stream = createSSEStream(response);
        const reader = stream.getReader();

        let accumulated = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += value;
          setContent(accumulated);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : '流式请求失败');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  return { content, isLoading, error, startStream, stopStream };
}
