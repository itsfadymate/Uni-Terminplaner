# GIU Schedule Manager

A client-side React + TypeScript application for German International University (GIU) students and faculty to view daily and weekly lecture schedules and check real-time classroom availability.

---

## 🚀 Quick Start

### 1. Run the Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

The application comes pre-loaded with **sample GIU schedules** (including `9MET` and `MET MSC` matching the official GIU timetable format) so you can test all features immediately.

---

## ✨ Features

- 📅 **Daily Schedule View**:
  - Filter by cohort/program (e.g. `9MET`, `MET MSC`, `CS Year 3`).
  - Select day of the week (Monday through Saturday).
  - Automatically highlights the current active time slot (`NOW`).
  - Shows lecture name, instructor/TA, and classroom room number (e.g., `2.07`, `3.16`, `3.01`).

- 📆 **Weekly Grid View**:
  - Full matrix of days (Monday–Saturday) across the 5 standard university time slots:
    - **Slot 1**: 08:30 – 10:00
    - **Slot 2**: 10:30 – 12:00
    - **Slot 3**: 12:15 – 13:45
    - **Slot 4**: 14:15 – 15:45
    - **Slot 5**: 16:00 – 17:30
  - Highlights today's row and the current time slot.

- 🚪 **Empty Classroom Availability**:
  - Check available and occupied rooms on campus for any day and time slot.
  - Quick toggle to filter only **Free Rooms** or **All Rooms**.
  - Shows which lecture and cohort is occupying a room when occupied.
  - Automatically identifies when the room is next free.

- 📂 **Multi-Source Schedule Ingestion**:
  - **Live Google Drive Sync**: Syncs all PDFs from the shared Drive folder via a lightweight Google Apps Script proxy.
  - **Direct PDF Upload**: Drag or pick any downloaded PDF schedule(s) from your computer; parsed entirely in the browser using PDF.js.
  - **JSON Backup/Restore**: Export or import your schedules for offline persistence.

---

## 🔄 Setting Up Google Drive Live Sync

Because Google Drive enforces CORS policies that prevent web browsers from directly fetching file contents without credentials, a tiny, free **Google Apps Script** serverless proxy is included in `apps-script/Code.gs`.

### Deployment Steps (Takes ~2 minutes):

1. Go to [script.google.com](https://script.google.com/) and click **New project**.
2. Copy all code from [`apps-script/Code.gs`](apps-script/Code.gs) and paste it into the editor (replacing any existing code).
3. Click **Deploy** > **New deployment**.
4. In the modal:
   - Click the gear icon next to "Select type" and choose **Web app**.
   - **Description**: `GIU Schedule Proxy`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` *(Allows your browser app to fetch without auth tokens)*
5. Click **Deploy** and authorize Google Drive access if prompted.
6. Copy the generated **Web app URL** (ends with `/exec`).
7. Open the GIU Schedule Manager web app, click the **Settings** (⚙️) icon in the top right, paste your Web app URL, and click **Save**.
8. Click **Sync Drive** in the header. The app will fetch all PDFs from the folder and parse them client-side!

### When the Drive Folder Changes:
If the university updates to a new folder URL:
1. Extract the folder ID from the URL (the string after `/folders/`).
2. In the app, open **Settings** (⚙️).
3. Paste the new **Folder ID** and click **Save**.
4. Click **Sync Drive**.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **PDF Extraction**: PDF.js (`pdfjs-dist`) with client-side text-position clustering
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage & SessionStorage
