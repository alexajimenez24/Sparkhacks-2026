"use client";

import GeneratorInput from '@/components/generator/generator-input';
import { RenderMessage } from '@/components/generator/render-message';
import { useChat } from '@ai-sdk/react';
import { createIdGenerator } from 'ai';
import { useState } from 'react';

export default function FloatingChat() {
  const [isThinking, setIsThinking] = useState(false);

  const chatHandler = useChat({
    generateId: createIdGenerator({ prefix: "msgc" }),
    sendExtraMessageFields: true,
    onResponse: () => setIsThinking(false),
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2">
        <RenderMessage useChat={chatHandler} isThinking={isThinking} />
      </div>

      <form
        onSubmit={(e) => {
          setIsThinking(true);
          chatHandler.handleSubmit(e);
        }}
        className="p-2 border-t"
      >
        <GeneratorInput
          value={chatHandler.input}
          onChange={chatHandler.handleInputChange}
        />
      </form>
    </div>
  );
}