import { Flex, Text } from '@radix-ui/themes'
import { memo } from 'preact/compat'

interface MessageProps {
  error: string
}

function Message({ error }: MessageProps) {
  return (
    <Flex gap="2" align="center">
      <Text color="red">{error}</Text>
    </Flex>
  )
}

export default memo(Message)
