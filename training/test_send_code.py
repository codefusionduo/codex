#!/usr/bin/env python3
import os
import sys
import html
from telegram_sync import send_telegram_message, send_telegram_document

TRAINING_DIR = os.path.dirname(os.path.abspath(__file__))
if TRAINING_DIR not in sys.path:
    sys.path.insert(0, TRAINING_DIR)

from generate_massive_dataset import build_full_application_code, DOMAINS

# 1. Generate real working application code
domain = DOMAINS[0]
app_code = build_full_application_code(
    app_id="cc_live_demo_01",
    title=domain["title"],
    category=domain["category"],
    theme=domain["theme"],
    features=domain["features"],
    variation=1
)

# 2. Extract first 35 lines to show directly in chat
code_preview = "\n".join(app_code.splitlines()[:35])
escaped_code = html.escape(code_preview)

msg = (
    "💻 <b>CodeCraft AI — Live Code Stream</b>\n"
    "━━━━━━━━━━━━━━━━━━━━\n"
    f"📦 <b>App:</b> <i>{domain['title']}</i>\n"
    f"🏷️ <b>Category:</b> <code>{domain['category']}</code>\n"
    "📜 <b>Direct Code View (in chat):</b>\n\n"
    f"<pre><code class=\"language-html\">{escaped_code}\n... [Full code in attached file]</code></pre>\n"
    "━━━━━━━━━━━━━━━━━━━━\n"
    "✅ <i>Pura code neeche attached .html file me hai (1-tap open)!</i>"
)

print("[*] Sending formatted code snippet to Telegram...")
success_msg, res_msg = send_telegram_message(msg)
print(f"Message sent: {success_msg} -> {res_msg}")

# 3. Also send readable .html file (user can tap and open in browser/Telegram directly)
html_file = os.path.join(TRAINING_DIR, "live_codecraft_app.html")
with open(html_file, "w", encoding="utf-8") as f:
    f.write(app_code)

print("[*] Sending readable .html file to Telegram...")
success_doc, res_doc = send_telegram_document(html_file, caption=f"📄 <b>Live Executable App:</b> <i>{domain['title']}</i>")
print(f"Document sent: {success_doc} -> {res_doc}")
