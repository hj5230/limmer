import { useState } from 'preact/hooks'
import { JSX } from 'preact/compat'
import { AVAILABLE_MODELS, Mode } from './typings'
import { useAIInteraction } from './hooks'
import { Skeleton, ModelSelector } from './components'
import {
  Button,
  TextArea,
  Card,
  Heading,
  Text,
  AlertDialog,
  Flex,
  Box,
  Tabs,
  Theme,
} from '@radix-ui/themes'

function App() {
  const [mode, setMode] = useState<Mode>('chat')
  const [selectedModel, setSelectedModel] = useState(
    AVAILABLE_MODELS[0].id,
  )

  const {
    input,
    setInput,
    suggestion,
    setSuggestion,
    response,
    setResponse,
    isLoading,
    error,
    getAIResponse,
  } = useAIInteraction({ selectedModel, mode })

  const handleTextareaChange = (
    e: JSX.TargetedEvent<HTMLTextAreaElement, Event>,
  ) => {
    const newInput = e.currentTarget.value
    setInput(newInput)

    if (mode === 'completion') {
      // For completion mode, fetch suggestion after a timeout
      if (newInput.endsWith(' ')) {
        getAIResponse(newInput)
      }
    }
  }

  const handleSend = () => {
    if (mode === 'chat') {
      getAIResponse(input)
    }
  }

  const acceptSuggestion = () => {
    if (suggestion) {
      setInput(prev => prev + suggestion + ' ')
      setSuggestion('')
    }
  }

  return (
    <Theme>
      <Skeleton>
        <Box
          p="6"
          style={{ maxWidth: '800px', margin: '0 auto' }}
        >
          <Heading size="8" mb="4">
            AI Interaction
          </Heading>

          <Tabs.Root
            value={mode}
            onValueChange={(value: Mode) => setMode(value)}
          >
            <Tabs.List>
              <Tabs.Trigger value="chat">Chat</Tabs.Trigger>
              <Tabs.Trigger value="completion">
                Completion
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="chat">
              {/* Chat Mode */}
              <Flex direction="column" gap="4">
                {/* Shared Components */}
                <ModelSelector
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                  isLoading={isLoading}
                />

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
                  onClick={handleSend}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </Button>

                {error && (
                  <Flex gap="2" align="center">
                    <Text color="red">{error}</Text>
                  </Flex>
                )}

                {response && (
                  <AlertDialog.Root open={!!response}>
                    <AlertDialog.Content>
                      <AlertDialog.Title>
                        Response
                      </AlertDialog.Title>
                      <AlertDialog.Description>
                        {response}
                      </AlertDialog.Description>
                      <Flex gap="3" mt="4" justify="end">
                        <AlertDialog.Cancel>
                          <Button
                            variant="soft"
                            color="gray"
                            onClick={() => setResponse('')}
                          >
                            Close
                          </Button>
                        </AlertDialog.Cancel>
                      </Flex>
                    </AlertDialog.Content>
                  </AlertDialog.Root>
                )}

                {!response && (
                  <Card>
                    <Heading size="4" mb="2">
                      Response:
                    </Heading>
                    <Text color="gray">
                      No response yet.
                    </Text>
                  </Card>
                )}
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="completion">
              {/* Completion Mode */}
              <Flex direction="column" gap="4">
                {/* Shared Components */}
                <ModelSelector
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                  isLoading={isLoading}
                />

                <div style={{ position: 'relative' }}>
                  <TextArea
                    size="3"
                    placeholder="Start typing..."
                    value={input}
                    onChange={handleTextareaChange}
                    disabled={isLoading}
                    style={{
                      fontFamily: 'monospace',
                      height: '40vh',
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
                        fontFamily: 'monospace',
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
                  <Heading size="4" mb="2">
                    Status:
                  </Heading>
                  <Text color="gray">
                    {isLoading
                      ? 'Thinking...'
                      : suggestion
                        ? 'Suggestion available'
                        : 'Ready'}
                  </Text>
                </Card>
              </Flex>
            </Tabs.Content>
          </Tabs.Root>
        </Box>
      </Skeleton>
    </Theme>
  )
}

export default App
