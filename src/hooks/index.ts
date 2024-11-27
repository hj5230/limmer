import { invoke } from '@tauri-apps/api/core'
import { useState } from 'preact/hooks'
import { buildPrompt } from '../utils'

interface UseAIInteractionProps {
  selectedModel: string
  mode: 'chat' | 'completion'
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

  const getAIResponse = async (text: string) => {
    if (!text.trim()) {
      setSuggestion('')
      setResponse('')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const prompt =
        mode === 'completion'
          ? buildPrompt(
              'Complete this code/text (provide only the next word): {{text}}',
              { text },
            )
          : text.trim()

      const result = await invoke('chat_once', {
        model: selectedModel,
        input: prompt,
      })

      if (mode === 'completion') {
        setSuggestion(result as string)
      } else {
        setResponse(result as string)
      }
    } catch (err) {
      console.error('Error:', err)
      setError(
        err instanceof Error ? err.message : String(err),
      )
    } finally {
      setIsLoading(false)
    }
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
