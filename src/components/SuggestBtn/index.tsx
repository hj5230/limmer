import { Button } from '@radix-ui/themes'
import { memo } from 'preact/compat'

interface SuggestBtnProps {
  suggestion: string
  onAccept: () => void
}

function SuggestBtn({
  suggestion,
  onAccept,
}: SuggestBtnProps) {
  return (
    <Button size="2" variant="soft" onClick={onAccept}>
      {suggestion} (Tab)
    </Button>
  )
}

export default memo(SuggestBtn)
