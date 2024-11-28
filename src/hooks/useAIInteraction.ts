import { invoke } from '@tauri-apps/api/core'
import { useState, useRef } from 'preact/hooks'
import { buildPrompt } from '@/utils'
import { ModeType, ModeEnum } from '@/typings'

interface UseAIInteractionProps {
  selectedModel: string
  mode: ModeType
}

export function useAIInteraction({
  selectedModel,
  mode,
}: UseAIInteractionProps) {
  const [input, setInput] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestIdRef = useRef<number>(0)

  const getAIResponse = (text: string) => {
    if (!text.trim()) {
      setSuggestion('')
      setResponse('')
      return
    }

    setIsLoading(true)
    setError(null)

    const currentRequestId = ++requestIdRef.current

    const prompt =
      mode === ModeEnum.COMPLETION
        ? buildPrompt(
            'Given the partial text: "{{text}}", provide next word (response with the word only)',
            { text },
          )
        : text.trim()

    invoke('chat_once', {
      model: selectedModel,
      input: prompt,
    })
      .then(result => {
        if (currentRequestId === requestIdRef.current) {
          if (mode === ModeEnum.COMPLETION) {
            setSuggestion(result as string)
          } else {
            setResponse(result as string)
          }
        }
      })
      .catch(err => {
        if (currentRequestId === requestIdRef.current) {
          console.error('Error:', err)
          setError(
            err instanceof Error
              ? err.message
              : String(err),
          )
        }
      })
      .finally(() => {
        if (currentRequestId === requestIdRef.current) {
          setIsLoading(false)
        }
      })
  }

  return {
    input,
    setInput,
    suggestion,
    setSuggestion,
    response,
    setResponse,
    isLoading,
    error,
    getAIResponse,
  }
}
