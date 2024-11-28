import {
  useState,
  useCallback,
  useMemo,
} from 'preact/hooks'
import { JSX, memo } from 'preact/compat'
import { AVAILABLE_MODELS, Mode } from '@/typings'
import { useAIInteraction } from '@/hooks'
import {
  Skeleton,
  ModelSelector,
  Message,
  Dialog,
  SuggestBtn,
} from '@/components'
import {
  Button,
  TextArea,
  Card,
  Heading,
  Text,
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

  // 使用 useCallback 缓存所有回调函数
  const handleTextareaChange = useCallback(
    (e: JSX.TargetedEvent<HTMLTextAreaElement, Event>) => {
      const newInput = e.currentTarget.value
      setInput(newInput)

      if (mode === 'completion' && newInput.endsWith(' ')) {
        getAIResponse(newInput)
      }
    },
    [mode, getAIResponse, setInput],
  )

  const handleSend = useCallback(() => {
    if (mode === 'chat') {
      getAIResponse(input)
    }
  }, [mode, getAIResponse, input])

  const acceptSuggestion = useCallback(() => {
    if (suggestion) {
      setInput(prev => prev + suggestion + ' ')
      setSuggestion('')
    }
  }, [suggestion, setSuggestion])

  const handleClose = useCallback(() => {
    setResponse('')
  }, [])

  const handleModeChange = useCallback((value: Mode) => {
    setMode(value)
  }, [])

  const handleModelChange = useCallback((model: string) => {
    setSelectedModel(model)
  }, [])

  const textAreaStyle = useMemo(
    () => ({
      fontFamily: 'monospace',
      height: '40vh',
    }),
    [],
  )

  const suggestionStyle = useMemo(
    () => ({
      position: 'absolute' as const,
      bottom: '8px',
      left: input.length * 8 + 16,
      color: 'gray',
      pointerEvents: 'none' as const,
      fontFamily: 'monospace',
    }),
    [input.length],
  )

  const containerStyle = useMemo(
    () => ({
      maxWidth: '800px',
      margin: '0 auto',
    }),
    [],
  )

  const statusText = useMemo(() => {
    if (isLoading) return 'Thinking...'
    if (suggestion) return 'Suggestion available'
    return 'Ready'
  }, [isLoading, suggestion])

  return (
    <Theme>
      <Skeleton>
        <Box p="6" style={containerStyle}>
          <Heading size="8" mb="4">
            AI Interaction
          </Heading>

          <Tabs.Root
            value={mode}
            onValueChange={handleModeChange}
          >
            <Tabs.List>
              <Tabs.Trigger value="chat">Chat</Tabs.Trigger>
              <Tabs.Trigger value="completion">
                Completion
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="chat">
              <Flex direction="column" gap="4">
                <ModelSelector
                  selectedModel={selectedModel}
                  setSelectedModel={handleModelChange}
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

                {error && <Message error={error} />}

                {response ? (
                  <Dialog
                    response={response}
                    onClose={handleClose}
                  />
                ) : (
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
              <Flex direction="column" gap="4">
                <ModelSelector
                  selectedModel={selectedModel}
                  setSelectedModel={handleModelChange}
                  isLoading={isLoading}
                />

                <div style={{ position: 'relative' }}>
                  <TextArea
                    size="3"
                    placeholder="Start typing..."
                    value={input}
                    onChange={handleTextareaChange}
                    disabled={isLoading}
                    style={textAreaStyle}
                  />
                  {suggestion && (
                    <div style={suggestionStyle}>
                      {suggestion}
                    </div>
                  )}
                </div>

                {suggestion && (
                  <SuggestBtn
                    suggestion={suggestion}
                    onAccept={acceptSuggestion}
                  />
                )}

                {error && <Message error={error} />}

                <Card>
                  <Heading size="4" mb="2">
                    Status:
                  </Heading>
                  <Text color="gray">{statusText}</Text>
                </Card>
              </Flex>
            </Tabs.Content>
          </Tabs.Root>
        </Box>
      </Skeleton>
    </Theme>
  )
}

export default memo(App)
