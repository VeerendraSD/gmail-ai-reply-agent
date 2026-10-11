# Gmail AI Reply — fully local starter

This personal Chrome extension drafts Gmail replies using Ollama and a local model. It has no paid API, no API key, and no cloud AI calls in its reply-generation path.

## Requirements
- Windows 10/11 recommended for these steps
- 16 GB RAM; CPU-only generation may be slower than a GPU
- Chrome
- Node.js LTS
- Ollama

## 1. Install Ollama and download the model
1. Download and install Ollama from https://ollama.com/download/windows
2. Open PowerShell or Command Prompt.
3. Run:

   `ollama run qwen2.5:3b-instruct`

4. Wait for the model download to finish. Type `Write a short professional email thanking someone for an interview.` to test it. Exit the chat when done (Ctrl+D or `/bye`, depending on terminal).

The model download requires internet once. The model then runs locally.

## 2. Start the local reply server
1. Install Node.js from https://nodejs.org/ if needed.
2. Open a terminal in this project's `server` folder.
3. Run:

   `npm install`

4. Start the server:

   `npm start`

Leave the terminal open. It should say the server is listening on `127.0.0.1:3030`.

Optional check: open http://127.0.0.1:3030/health in your browser; it should show `{"ok":true,...}`.

## 3. Install the Chrome extension
1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this project's `extension` folder.
5. Open Gmail and refresh the page.

## 4. Use it
1. Open an email in Gmail.
2. Click Gmail's **Reply** button to open the reply editor.
3. Click the extension icon in Chrome's toolbar to open its side panel.
4. Type what you want the reply to say, choose a tone, then click **Generate reply**.
5. Review/edit the result and click **Insert into Gmail**.
6. Check the inserted draft and click Send yourself.

## Troubleshooting
- If the `ollama` command is not recognized, quit and reopen your terminal after installing Ollama.
- If the model is missing, run `ollama run qwen2.5:3b-instruct` again.
- If the extension cannot read Gmail, refresh Gmail after loading/reloading the extension.
- If reply insertion fails, open the email and click Reply first. Gmail's page structure can change, so the selector may need adjustment.
- If generation is slow, close other apps. This version runs on CPU if no supported GPU is available.

## Privacy / safety
- Email context is sent from the extension to a local server bound to `127.0.0.1`, then to Ollama at `127.0.0.1:11434`. The generation path does not call a hosted AI API.
- The extension reads visible page text, not all of your mailbox. Gmail's DOM is not a stable public API; reading and insertion are best-effort.
- The server has no authentication and is intended only for local use. Do not expose it to the internet.
- It does not send email automatically. Always review the draft before sending.
- Ollama and model downloads require internet during setup; drafting can work offline after installation and model download.
