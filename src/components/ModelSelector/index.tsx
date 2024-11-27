import { AVAILABLE_MODELS } from '../../typings'
import { Select } from '@radix-ui/themes'

export function ModelSelector({
  selectedModel,
  setSelectedModel,
  isLoading,
}: {
  selectedModel: string
  setSelectedModel: (value: string) => void
  isLoading: boolean
}) {
  return (
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
  )
}
