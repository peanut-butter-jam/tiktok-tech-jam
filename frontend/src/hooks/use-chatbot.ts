import { useState, useCallback } from "react";

export interface UseChatbotOptions {
  apiEndpoint?: string;
  headers?: Record<string, string>;
}

export function useChatbot(options: UseChatbotOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (message: string): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        if (options.apiEndpoint) {
          const response = await fetch(options.apiEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...options.headers,
            },
            body: JSON.stringify({
              message,
              timestamp: new Date().toISOString(),
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          return (
            data.response ||
            data.message ||
            "Sorry, I couldn't process your request."
          );
        } else {
          // Mock response for demo purposes
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

          // Enhanced mock responses
          const lowerMessage = message.toLowerCase();

          if (
            lowerMessage.includes("upload") &&
            lowerMessage.includes("regulation")
          ) {
            return "To upload a regulation, go to the Regulations page and click 'Upload New Regulation'. You can upload PDF documents and I'll help you manage them.";
          } else if (
            lowerMessage.includes("upload") &&
            lowerMessage.includes("feature")
          ) {
            return "To upload a feature, navigate to the Features page and use the upload functionality. You can manage and view all your features from there.";
          } else if (
            lowerMessage.includes("navigate") ||
            lowerMessage.includes("page")
          ) {
            return "You can navigate to different sections using the navigation menu:\n• Main Page - Overview dashboard\n• Regulations - Manage regulatory documents\n• Features - Manage feature sets\n\nWhere would you like to go?";
          } else if (
            lowerMessage.includes("help") ||
            lowerMessage.includes("how")
          ) {
            return "I'm here to help! I can assist you with:\n• Navigating the application\n• Uploading and managing documents\n• Understanding regulations and features\n• General questions about the platform\n\nWhat specific help do you need?";
          } else {
            return `I understand you're asking about "${message}". I'm an AI assistant designed to help with this regulatory and feature management platform. Feel free to ask me about uploading documents, navigating pages, or any other questions!`;
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [options.apiEndpoint, options.headers]
  );

  return {
    sendMessage,
    isLoading,
    error,
  };
}
