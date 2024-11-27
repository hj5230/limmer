export enum Page {
    CHAT = 'chat',
    COMPLETION = 'completion',
}

export const AVAILABLE_MODELS = [
	{ id: "qwen2.5:14b", name: "Qwen 2.5 (14B)" },
	{ id: "llama3.2:3b", name: "Llama 3.2 (3B)" },
	{ id: "qwen2.5:32b", name: "Qwen 2.5 (32B)" },
	{ id: "qwen:7b", name: "Qwen (7B)" },
	{ id: "phi3:medium", name: "Phi-3 Medium" },
	{ id: "llama3.1:8b", name: "Llama 3.1 (8B)" },
	{ id: "qwen2.5:7b", name: "Qwen 2.5 (7B)" },
	{ id: "llama3.2:1b", name: "Llama 3.2 (1B)" },
];
