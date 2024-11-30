# TODO

- Heuristic check it the LLM response is legitimate (is
  there any space between characters)
- **Completion** Track cursor position within the textarea
  (maybe not using textarea at all)
- ~~**Complition** Don't block the user from typing when the
  LLM is thinking (queue the requests)~~
- **Completion** Define 2 set of prompts, one for complete
  current word (if previous input was a charactor) and one
  for guess the next word (if previous input was a space)
- **Performance** Initialize the LLM when app start / select
  model (block user input before complete)
- ~~**Refactor**: Refactor rust-end, use more reasonable
  APIs, provide more commonly used interfaces~~ Consider
  communicate with ollama from webview directly
