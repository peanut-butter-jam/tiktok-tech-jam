import { useState, useCallback } from "react";
import { ChatButton } from "./chat-button";
import { ChatWindow } from "./chat-window";
import { type ChatMessage } from "./chat-message";

export interface ChatbotProps {
  onSendMessage?: (message: string) => Promise<string>;
  className?: string;
}

export function Chatbot({ onSendMessage, className }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleSendMessage = useCallback(
    async (content: string) => {
      const userMessage: ChatMessage = {
        id: generateId(),
        content,
        role: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        let assistantResponse = "I'm here to help! This is a demo response.";

        if (onSendMessage) {
          assistantResponse = await onSendMessage(content);
        } else {
          // Default mock responses based on content
          if (content.toLowerCase().includes("regulation")) {
            assistantResponse =
              "I can help you with regulations! You can upload, view, and manage regulatory documents through the regulations section. What specific information are you looking for?";
          } else if (content.toLowerCase().includes("feature")) {
            assistantResponse =
              "Features are available in the features section where you can upload and manage different feature sets. Would you like me to guide you to the features page?";
          } else if (content.toLowerCase().includes("help")) {
            assistantResponse =
              "I'm here to assist you! You can ask me about:\n• Navigating the application\n• Uploading documents\n• Managing regulations and features\n• Finding specific information\n\nWhat would you like help with?";
          } else {
            assistantResponse = `I understand you're asking about "${content}". I'm an AI assistant designed to help with this application. Feel free to ask me about regulations, features, or how to use the platform!`;
          }
        }

        const assistantMessage: ChatMessage = {
          id: generateId(),
          content: assistantResponse,
          role: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage: ChatMessage = {
          id: generateId(),
          content:
            "Sorry, I encountered an error while processing your message. Please try again.",
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [onSendMessage]
  );

  return (
    <div className={className}>
      <ChatButton isOpen={isOpen} onClick={toggleChat} />
      <ChatWindow
        isOpen={isOpen}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
