# KriahTrack — Full Stack Setup Guide

## What You Have
A complete school web app with:
- **Real database** (SQLite file on disk — data never wipes)
- **REST API** (Node.js/Express)
- **Full UI** (all modules: students, providers, worksheets, reports, OCR, analytics, admin)
- **Real OCR** (Tesseract.js — reads handwritten numbers)

---

## Option A — Run On Your Own Computer (Preview/Testing)

### Requirements
- [Node.js](https://nodejs.org) — download and install (free, takes 2 minutes)

### Steps
```bash
# 1. Unzip the folder
# 2. Open Terminal / Command Prompt inside the kriahtrack-server folder
cd kriahtrack-server

# 3. Install dependencies (one time only)
npm install

# 4. Start the server
node src/server.js

# 5. Open browser
# Go to: http://localhost:3000
```

That's it. Data saves to `db/kriahtrack.db` automatically every 5 seconds.

---

## Option B — Run On School Network (All Staff Access)

Run the server on **any computer on the school network**:
```bash
node src/server.js
```
Then every teacher/admin opens their browser and goes to:
```
http://[computer-ip-address]:3000
```
Find the IP: on Windows run `ipconfig`, on Mac run `ifconfig`.

---

## Option C — Online (Access From Anywhere, Free)

### Deploy to Railway (free, 5 minutes)
1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Upload this folder to GitHub first, then connect
4. Railway auto-detects Node.js and runs it
5. You get a URL like `https://kriahtrack.railway.app`

### Deploy to Render (free)
1. Create account at [render.com](https://render.com)
2. New → Web Service → connect GitHub repo
3. Build command: `npm install`
4. Start command: `node src/server.js`
5. Free tier available

---

## Where Data Is Stored

```
kriahtrack-server/
└── db/
    └── kriahtrack.db    ← ALL your data lives here
```

- **Auto-saves** every 5 seconds
- **Never wipes** on refresh or restart
- **Backup**: click the download button in the app header, or copy `kriahtrack.db`
- To restore: replace `kriahtrack.db` with your backup file

---

## Data Backup

### From the app
Click the ↓ button in the top header → downloads `kriahtrack-backup-[date].json`

### Manual backup
Just copy `db/kriahtrack.db` to a safe location (USB, Google Drive, etc.)

---

## Folder Structure

```
kriahtrack-server/
├── src/
│   ├── server.js      — Web server & API routes
│   └── database.js    — Database layer (SQLite)
├── public/
│   ├── index.html     — Main app
│   ├── styles.css     — Design system
│   ├── pages.js       — All page renderers
│   ├── utils.js       — Helper functions
│   ├── data.js        — Data constants
│   ├── ocr_engine.js  — Handwriting OCR
│   ├── api.js         — API client
│   ├── app_connected.js — App bootstrap
│   └── assets/        — Logo & letterhead
├── db/
│   └── kriahtrack.db  — Your database (auto-created)
└── package.json
```

---

## Troubleshooting

**"Cannot find module" error**
→ Run `npm install` first

**Port already in use**
→ Change port: `PORT=3001 node src/server.js`

**Data not saving**
→ Check that `db/` folder exists and is writable

**OCR not working**
→ Needs internet connection first time (downloads Tesseract model ~10MB)
→ After first use, works offline