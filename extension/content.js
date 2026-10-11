function isVisible(el) {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  const s = getComputedStyle(el);
  return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
}

function readVisibleEmail() {
  const main = document.querySelector('[role="main"]') || document.body;
  return (main.innerText || "").trim().slice(0, 12000);
}

function findReplyEditor() {
  const candidates = [...document.querySelectorAll(
    '[contenteditable="true"][role="textbox"], [contenteditable="true"][g_editable="true"]'
  )].filter(isVisible);
  return candidates.at(-1) || null;
}

function insertReply(text) {
  const editor = findReplyEditor();
  if (!editor) {
    return { ok: false, error: "Open the email and click Reply in Gmail first, then try again." };
  }

  editor.focus();
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(editor);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);

  const ok = document.execCommand("insertText", false, text);
  if (!ok) {
    editor.textContent = text;
    editor.dispatchEvent(new InputEvent("input", {
      bubbles: true, inputType: "insertText", data: text
    }));
  }
  return { ok: true };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "GET_EMAIL_CONTEXT") {
    sendResponse({ ok: true, context: readVisibleEmail() });
  }
  if (msg?.type === "INSERT_REPLY") {
    sendResponse(insertReply(String(msg.reply || "")));
  }
  return true;
});