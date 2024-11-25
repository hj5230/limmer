import { useState } from "preact/hooks";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

const AVAILABLE_MODELS = [
  { id: "qwen2.5:14b", name: "Qwen 2.5 (14B)" },
  { id: "llama3.2:3b", name: "Llama 3.2 (3B)" },
  { id: "qwen2.5:32b", name: "Qwen 2.5 (32B)" },
  { id: "qwen:7b", name: "Qwen (7B)" },
  { id: "phi3:medium", name: "Phi-3 Medium" },
  { id: "llama3.1:8b", name: "Llama 3.1 (8B)" },
  { id: "qwen2.5:7b", name: "Qwen 2.5 (7B)" },
  { id: "llama3.2:1b", name: "Llama 3.2 (1B)" },
];

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);

  async function chatOnce() {
    if (!input.trim()) {
      setError("Please enter a message");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await invoke("chat_once", {
        model: selectedModel,
        input: input.trim(),
      });
      setResult(response as string);
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <h1>Chat with AI</h1>
      <div className="model-selector">
        <label htmlFor="model-select">Select Model:</label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.currentTarget.value)}
          disabled={isLoading}
        >
          {AVAILABLE_MODELS.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
      <div className="chat-container">
        <textarea
          value={input}
          onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
          placeholder="Type your message here..."
          disabled={isLoading}
        />
        <button 
          onClick={chatOnce} 
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
      {error && (
        <div className="error-container">
          <p className="error">{error}</p>
        </div>
      )}
      <div className="response-container">
        <h2>Response:</h2>
        <p>{result || "No response yet."}</p>
      </div>
    </main>
  );
}

export default App;
