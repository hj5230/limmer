import { useState } from "preact/hooks";
import { invoke } from "@tauri-apps/api/core";

import { AVAILABLE_MODELS } from "../../typings";

import {
  Select,
  Button,
  TextArea,
  Card,
  Heading,
  Text,
  Flex,
  Box,
} from '@radix-ui/themes';

/**
 * TODO:
 *  - Completion cache for same context
 *  - Corrent posotion for the ghost text
 * @returns JSX
 */
export function Completion() {
  const [input, setInput] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);
  const [typingTimeout, setTypingTimeout] = useState<number | null>(null);

  async function getSuggestion(text: string) {
    if (!text.trim()) {
      setSuggestion("");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await invoke("chat_once", {
        model: selectedModel,
        input: `Complete this code/text (provide only the next word): ${text}`,
      });
      setSuggestion(response as string);
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (e: any) => {
    const newInput = e.target.value;
    setInput(newInput);

    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout
    const newTimeout = setTimeout(() => {
      if (newInput.endsWith(" ")) {
        getSuggestion(newInput);
      }
    }, 300) as unknown as number;

    setTypingTimeout(newTimeout);
  };

  const acceptSuggestion = () => {
    if (suggestion) {
      setInput(prev => prev + suggestion + " ");
      setSuggestion("");
    }
  };

  return (
    <Box p="6" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Heading size="8" mb="4">Completion with AI</Heading>
      
      <Flex direction="column" gap="4">
        <Select.Root 
          value={selectedModel} 
          onValueChange={setSelectedModel}
          disabled={isLoading}
        >
          <Select.Trigger placeholder="Select a model" />
          <Select.Content>
            {AVAILABLE_MODELS.map((model) => (
              <Select.Item key={model.id} value={model.id}>
                {model.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <div style={{ position: 'relative' }}>
          <TextArea
            size="3"
            placeholder="Start typing..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
            style={{
              fontFamily: 'monospace',
              height: '50vh',
            }}
          />
          {suggestion && (
            <div 
              style={{ 
                position: 'absolute', 
                bottom: '8px', 
                left: input.length * 8 + 16, // Approximate position
                color: 'gray',
                pointerEvents: 'none',
                fontFamily: 'monospace'
              }}
            >
              {suggestion}
            </div>
          )}
        </div>

        {suggestion && (
          <Button 
            size="2"
            variant="soft"
            onClick={acceptSuggestion}
          >
            Accept Suggestion (Tab)
          </Button>
        )}

        {error && (
          <Flex gap="2" align="center">
            <Text color="red">{error}</Text>
          </Flex>
        )}

        <Card>
          <Heading size="4" mb="2">Status:</Heading>
          <Text color="gray">
            {isLoading ? "Thinking..." : suggestion ? "Suggestion available" : "Ready"}
          </Text>
        </Card>
      </Flex>
    </Box>
  );
}
