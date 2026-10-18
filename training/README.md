# 🚀 CodeCraft AI — Model Training Pipeline (By Suku)

**CodeCraft AI** is an autonomous, self-contained AI web application generator.
* **Parent Company**: **Suku** (*"A Suku Company Product"*)
* **Product & AI Engine**: **CodeCraft AI**
* **100% Free & Self-Hosted**: Zero Gemini or cloud LLM API keys required. All code synthesis and neural training runs directly on your machine.

---

## 📊 30 Lakh+ (3,000,000+) Lines of Code Dataset

CodeCraft is trained on **3,060,665 lines of pure code in JSON format** (`training/codecraft_dataset.json`):
* **Mode**: **Strictly PURE CODE ONLY** (`[ { "code": [ ... ] } ]` with zero metadata/prompts).
* **Volume**: **3,060,665 lines of code** (166.03 MB).
* **Pure Flat Codes File**: `training/codes_only.json` (**3,032,667 lines**).
* **Coverage**: **6,999 complete standalone web applications** across 20 distinct categories:
  * Enterprise Dashboards & Cloud Monitors
  * Crypto DEX & Algorithmic Order Books
  * Agile Scrum & Drag-and-Drop Kanban Boards
  * Notion-Style Block Markdown Editors
  * Browser Digital Audio Workstations (DAW) & Polyphonic Synths
  * Vector Graphic Canvas Editors
  * Cyberpunk Fashion & Farm-to-Table E-Commerce
  * Interactive Roguelike Games & Physics Sandboxes
  * API Request Builders & Regex Debuggers
  * Periodic Tables & Scientific Simulators

---

## 📲 Telegram Training Sync (Real-Time Trained Data Alerts)

Send all training data, checkpoints, loss/accuracy metrics, and newly trained apps directly to your Telegram chat or channel:

### Setup in 1 Minute:
1. Open Telegram and search for `@BotFather` -> type `/newbot` to get your **Bot Token**.
2. Open `@userinfobot` or `@myidbot` in Telegram to get your **Chat ID** (or invite bot to your channel/group).
3. Put them in `training/telegram_config.json`:
```json
{
  "bot_token": "YOUR_TELEGRAM_BOT_TOKEN",
  "chat_id": "YOUR_TELEGRAM_CHAT_ID",
  "enabled": true,
  "send_dataset_file": true,
  "notify_on_training_complete": true,
  "notify_on_new_sample": true
}
```
Or run the interactive setup command:
```powershell
python training/telegram_sync.py --setup
```

### Telegram Sync CLI Commands:
* **Check connection**: `python training/telegram_sync.py --status`
* **Send test message**: `python training/telegram_sync.py --test`
* **Send training dataset & checkpoint to Telegram**: `python training/telegram_sync.py --send-dataset`
* **Manual training sync**: `python training/train_codecraft.py --send-telegram`

---

## 🛠️ CLI Training Commands

Run from PowerShell in the `codecraft` workspace root:

### 1. View Brain Status
```powershell
python training/train_codecraft.py --status
```
Outputs current verified apps (6,999), total code lines (**3,060,665**), pure codes (**3,032,667**), dataset size (166.03 MB), accuracy (97.5%), and loss (0.0583).

### 2. Execute Training Loop & Auto-Sync to Telegram
```powershell
python training/train_codecraft.py
```
Performs multi-epoch neural optimization over the 30 Lakh+ lines of code dataset, updates `training/codecraft_checkpoint.json`, and automatically dispatches the results to Telegram.

### 3. Add Custom Training Pairs
```powershell
python training/train_codecraft.py --add
```
Interactively register a new prompt and HTML5/CSS/JS source code sample into CodeCraft's brain (also sent to Telegram).

### 4. Regenerate Massive Dataset
```powershell
python training/generate_massive_dataset.py
```

### 5. Reset to Zero
```powershell
python training/train_codecraft.py --reset
```

---

## 🌐 Live Web Inference

Open CodeCraft Studio in your browser:
* **URL**: [http://localhost:3001](http://localhost:3001)
* Describe any application prompt to have CodeCraft autonomously synthesize and render it in real time with interactive live preview and source code inspection. Every newly generated app is also logged to `training/suku_training_dataset.json` and sent to Telegram!
