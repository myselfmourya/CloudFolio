# CloudFolio ☁️

**CloudFolio** is a modern, interactive student and developer portfolio platform built with Next.js, React, Tailwind CSS, and TypeScript. It features interactive architecture diagrams, PR diff viewers, terminal simulation, recruiter story mode, and ATS resume generation.

---

## ✨ Features

- **Candidate Showcase & Portfolios**: Dynamic public portfolio routes with verified student credentials, stats, and project showcases.
- **Interactive Architecture Diagrams**: Live systems design with simulated traffic and service interactions.
- **Landmark PR Viewer**: Review architectural decisions and code diffs.
- **Developer Terminal**: Built-in interactive CLI terminal (`cloudfolio-sh`).
- **Story Mode**: 60-second high-speed recruiter walkthrough.
- **ATS Resume Generator**: 1-click ATS resume preview and download.
- **Studio Dashboard**: Manage projects, skills, profile, and security settings.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/myselfmourya/CloudFolio.git
   cd CloudFolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Add your API keys in `.env.local` if needed (e.g. `GEMINI_API_KEY`).

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the browser:**
   Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Animations & Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Backend / DB**: Next.js API Routes & JSON File Database

---

## 📄 License

MIT
