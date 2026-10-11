const $ = (id) => document.getElementById(id);

async function activeGmailTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url?.startsWith("https://mail.google.com/")) {
    throw new Error("Open Gmail in the active Chrome tab first.");
  }
  return tab;
}

async function generateReply() {
  const instruction = $("instruction").value.trim();
  if (!instruction) { $("status").textContent = "Enter your reply instructions first."; return; }

  $("generate").disabled = true;
  $("status").textContent = "Reading email and drafting locally…";
  try {
    const tab = await activeGmailTab();
    const result = await chrome.tabs.sendMessage(tab.id, { type: "GET_EMAIL_CONTEXT" });
    const emailContext = result?.context || "";
    if (!emailContext) throw new Error("Couldn't read the email. Refresh Gmail and open an email first.");

    const res = await fetch("http://127.0.0.1:3030/api/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailContext, instruction, tone: $("tone").value })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Reply generation failed.");
    $("reply").value = (data.reply || "").trim();
    const hasText = !!$("reply").value;
    $("insert").disabled = !hasText;
    $("copy").disabled = !hasText;
    $("status").textContent = hasText ? "Draft ready. Review it before inserting." : "The model returned an empty reply. Try again.";
  } catch (e) {
    $("status").textContent = e.message || "Something went wrong.";
  } finally {
    $("generate").disabled = false;
  }
}

$("generate").addEventListener("click", generateReply);
$("insert").addEventListener("click", async () => {
  try {
    const tab = await activeGmailTab();
    const result = await chrome.tabs.sendMessage(tab.id, {
      type: "INSERT_REPLY", reply: $("reply").value.trim()
    });
    if (!result?.ok) throw new Error(result?.error || "Couldn't insert reply.");
    $("status").textContent = "Inserted into Gmail. Review it before sending.";
  } catch (e) { $("status").textContent = e.message || "Couldn't insert reply."; }
});
$("copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("reply").value);
    $("status").textContent = "Reply copied.";
  } catch { $("status").textContent = "Copy failed; select the draft and copy it manually."; }
});
$("reply").addEventListener("input", () => {
  const ok = !!$("reply").value.trim();
  $("insert").disabled = !ok;
  $("copy").disabled = !ok;
});