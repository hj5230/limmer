import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

import { Page } from "./typings";
import { Chat } from "./pages/Chat";
import { Completion } from "./pages/Completion";

import { Theme, Button } from "@radix-ui/themes";

function App() {
  const [page, setPage] = useState<Page>(Page.CHAT);

  function framework(element: JSX.Element) {
    return (
      <Theme>
        <Button onClick={() => setPage(Page.CHAT)}>CHAT</Button>
        <Button onClick={() => setPage(Page.COMPLETION)}>COMPLETION</Button>
        {element}
      </Theme>
    )
  }

  switch (page) {
    case Page.CHAT:
      return framework(<Chat />);

    case Page.COMPLETION:
      return framework(<Completion />);
  }
}

export default App;
