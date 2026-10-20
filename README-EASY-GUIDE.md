# CloudFolio — Beginner's Navigation & Quickstart Guide

Welcome to your **CloudFolio** application folder! This folder is organized so anyone can find files, edit content, and launch the web application without needing deep technical knowledge.

---

## 🚀 How to Run the App with 1-Click (No Terminal Knowledge Needed)

1. Open this `CloudFolio` folder in Mac Finder.
2. **Double-click** `START-CLOUDFOLIO.command`.
3. That's it! Your Mac will launch the web application and open **http://localhost:3000** automatically in your browser.
4. To stop the application, double-click `STOP-CLOUDFOLIO.command` or close the terminal window.

---

## 📂 Easy Folder Directory

You will see 5 numbered folders right at the top of this directory:

### 1️⃣ `1-WEBSITE-PAGES`
Contains all the screens that visitors and candidates see in their browser:
* `page.tsx` — The **Landing Page** (features, hero showcase, interactive innovations).
* `portfolio/[username]/page.tsx` — The **Public Candidate Portfolio** (live interactive architecture, PR diffs, ATS resume download, terminal).
* `dashboard/page.tsx` — The **Studio Dashboard** (manage projects, skills, profile, and settings).
* `login/page.tsx` — The **Sign In** screen.
* `signup/page.tsx` — The **Get Started / Handle Claiming** screen.

### 2️⃣ `2-DESIGN-AND-BUTTONS`
Contains all the design elements, navigation bars, and interactive features:
* `Navbar.tsx` — Top navigation bar with intelligent authentication detection (Sign In vs Dashboard).
* `FloatingTerminalButton.tsx` — Expanding floating terminal dock button (shows logo only until hovered).
* `PortfolioSettingsSection.tsx` — Unified settings & controls hub: Terminal/features toggles, custom domain CNAME routing, career fair QR share, JSON database backup, ATS Markdown resume export, and edge CDN cache purge.
* `AudioVoiceNotePlayer.tsx` — Candidate 30-second audio walkthrough player with live sound wave bars.
* `DeveloperTerminal.tsx` — Retro-modern terminal CLI (`cloudfolio-sh`).
* `StoryModeModal.tsx` — 60-Second high-speed recruiter story mode.
* `InteractiveArchitectureDiagram.tsx` — Interactive system design with live traffic simulation.
* `LandmarkPRViewer.tsx` — Pull requests and monochrome code diff viewer.
* `ResumePDFModal.tsx` — 1-Click ATS resume generator and previewer.

### 3️⃣ `3-STUDENT-DATABASE`
Contains the persistent database:
* `students.json` — The file storing all student profiles, projects, GPA, settings, and recruiter messages.

### 4️⃣ `4-LOGOS-AND-IMAGES`
Contains static logos and pictures:
* `logo.png` — Official CloudFolio logo.
* `favicon.ico` — Website browser tab icon.

### 5️⃣ `5-CORE-LOGIC-AND-TYPES`
Contains data structures and server communication helpers:
* `types.ts` — TypeScript models for students, projects, and settings.
* `mock-data.ts` — Pre-seeded candidate data (Alex Chen).
* `api-client.ts` — Client-side API fetcher.
* `server-db.ts` — Server-side database engine.

---

## 🌐 Quick Links (When App is Running)

* **Homepage**: [http://localhost:3000](http://localhost:3000)
* **Alex Chen's Portfolio**: [http://localhost:3000/portfolio/alexchen](http://localhost:3000/portfolio/alexchen)
* **Candidate Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
* **Settings & Controls**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard) (Click on *Settings & Controls* tab)
