import { AlertDialog, Button, Flex } from '@radix-ui/themes'
import { memo } from 'preact/compat'

interface DialogProps {
  response: string
  onClose: () => void
}

function Dialog({ response, onClose }: DialogProps) {
  return (
    <AlertDialog.Root open={!!response}>
      <AlertDialog.Content>
        <AlertDialog.Title>Response</AlertDialog.Title>
        <AlertDialog.Description>
          {response}
        </AlertDialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button
              variant="soft"
              color="gray"
              onClick={onClose}
            >
              Close
            </Button>
          </AlertDialog.Cancel>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}

export default memo(Dialog)
