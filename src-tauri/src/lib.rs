use std::env;
use serde::Deserialize;
use serde_json::json;
use reqwest;

#[derive(Deserialize, Debug)]
struct OllamaResponse {
    message: OllamaMessage,
}

#[derive(Deserialize, Debug)]
struct OllamaMessage {
    content: String,
}

#[tauri::command]
async fn chat_once(model: &str, input: &str) -> Result<String, String> {
    let client = reqwest::Client::new();
    
    let api_url = env::var("OLLAMA_API_URL")
        .unwrap_or_else(|_| "http://172.26.240.1:11434/api/chat".to_string());
    
    let payload = json!({
        "model": model,
        "messages": [{
            "role": "user",
            "content": input
        }]
    });

    let res = client
        .post(api_url)
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    if !res.status().is_success() {
        return Err(format!("API returned error status: {}", res.status()));
    }

    let mut full_response = String::new();
    let text = res.text().await.map_err(|e| format!("Failed to get response text: {}", e))?;
    
    // 处理流式响应
    for line in text.lines() {
        if let Ok(response) = serde_json::from_str::<OllamaResponse>(line) {
            full_response.push_str(&response.message.content);
        }
    }
    
    Ok(full_response)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![chat_once])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
