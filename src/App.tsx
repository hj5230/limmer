import { useState } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'

import { Page } from './typings'
import { Chat } from './pages/Chat'
import { Completion } from './pages/Completion'
import { Playground } from './pages/Playground'

import { Theme, Flex, Button } from '@radix-ui/themes'

function App() {
  const [page, setPage] = useState<Page>(Page.CHAT)

  function framework(element: JSX.Element) {
    return (
      <Theme>
        <Flex gap="2">
          <Button onClick={() => setPage(Page.CHAT)}>
            CHAT
          </Button>
          <Button onClick={() => setPage(Page.COMPLETION)}>
            COMPLETION
          </Button>
          <Button onClick={() => setPage(Page.Playground)}>
            PLAYGROUND
          </Button>
        </Flex>
        {element}
      </Theme>
    )
  }

  switch (page) {
    case Page.CHAT:
      return framework(<Chat />)

    case Page.COMPLETION:
      return framework(<Completion />)

    case Page.Playground:
      return framework(<Playground />)
  }
}

export default App
