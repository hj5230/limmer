import { Button } from '@radix-ui/themes'
import { memo } from 'preact/compat'

interface SuggestBtnProps {
  suggestion: string
  onAccept: () => void
}

function SuggestBtn({ onAccept }: SuggestBtnProps) {
  return (
    <Button size="2" variant="soft" onClick={onAccept}>
      Accept Suggestion (Tab)
    </Button>
  )
}

export default memo(SuggestBtn)
