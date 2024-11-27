import { invoke } from '@tauri-apps/api/core'
import { useState } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'

import { AVAILABLE_MODELS } from '../../typings'

import {
  Select,
  Button,
  TextArea,
  Card,
  Heading,
  Text,
  AlertDialog,
  Flex,
  Box,
} from '@radix-ui/themes'

export function Chat() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState(
    AVAILABLE_MODELS[0].id,
  )

  async function chatOnce() {
    if (!input.trim()) {
      setError('Please enter a message')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await invoke('chat_once', {
        model: selectedModel,
        input: input.trim(),
      })
      setResult(response as string)
    } catch (error) {
      console.error('Error:', error)
      setError(
        error instanceof Error
          ? error.message
          : String(error),
      )
    } finally {
      setIsLoading(false)
    }
  }

  function handleTextareaChange(
    e: JSX.TargetedEvent<HTMLTextAreaElement, Event>,
  ) {
    setInput(e.currentTarget.value)
  }

  return (
    <Box
      p="6"
      style={{ maxWidth: '800px', margin: '0 auto' }}
    >
      <Heading size="8" mb="4">
        Chat with AI
      </Heading>

      <Flex direction="column" gap="4">
        <Select.Root
          value={selectedModel}
          onValueChange={setSelectedModel}
          disabled={isLoading}
        >
          <Select.Trigger placeholder="Select a model" />
          <Select.Content>
            {AVAILABLE_MODELS.map(model => (
              <Select.Item key={model.id} value={model.id}>
                {model.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <TextArea
          size="3"
          placeholder="Type your message here..."
          value={input}
          onChange={handleTextareaChange}
          disabled={isLoading}
        />

        <Button
          size="3"
          disabled={isLoading || !input.trim()}
          onClick={chatOnce}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>

        {error && (
          <Flex gap="2" align="center">
            <Text>{error}</Text>
          </Flex>
        )}

        <AlertDialog.Root open={!!result}>
          <AlertDialog.Content>
            <AlertDialog.Title>Response</AlertDialog.Title>
            <AlertDialog.Description>
              {result}
            </AlertDialog.Description>
            <Flex gap="3" mt="4" justify="end">
              <AlertDialog.Cancel>
                <Button
                  variant="soft"
                  color="gray"
                  onClick={() => setResult('')}
                >
                  Close
                </Button>
              </AlertDialog.Cancel>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>

        {!result && (
          <Card>
            <Heading size="4" mb="2">
              Response:
            </Heading>
            <Text color="gray">No response yet.</Text>
          </Card>
        )}
      </Flex>
    </Box>
  )
}
