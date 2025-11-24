
# Interactive Architecture Generator V1

**Architect The Future.** Turn ideas into enterprise-grade, interactive system architecture diagrams instantly using Generative AI.

![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Version](https://img.shields.io/badge/Version-1.0-cyan.svg)
![Powered By](https://img.shields.io/badge/Powered%20By-Google%20Gemini-orange.svg)

## 🚀 Overview

The **Interactive Architecture Generator** is a cutting-edge web application that leverages the multimodal capabilities of Google's **Gemini 3 Pro** model to generate detailed, visually stunning, and interactive HTML/CSS system diagrams. 

Unlike static image generators, this tool produces **code-based artifacts**. This means text is selectable, layouts are responsive, and components are interactive (hover effects, modals, data flow animations).

## ✨ Key Features

### 🎨 Multi-Style Generation Engine
Choose from four distinct visualization styles, or generate a hybrid view:
*   **Neon Flow**: High-contrast, glowing visualizations perfect for dark mode. Features animated SVG data paths connecting microservices.
*   **Bento Grid (Component View)**: A clean, modular "Apple-style" grid layout for listing system components, specs, and infrastructure details.
*   **Brainstorm Dashboard**: A strategic view simulating a whiteboard with sticky notes, staging areas, and warehouse groupings.
*   **Cyberpunk (Modern Flow)**: A futuristic, detailed view with tabbed interfaces separating high-level architecture from detailed data flow logic.

### 👁️ Image Analysis & Reconstruction (OCR)
Upload a photo of a whiteboard sketch, a screenshot of an existing diagram, or a PDF. The system uses Gemini's vision capabilities to:
1.  **Read** the text labels (OCR).
2.  **Analyze** the topology (relationships, arrows, grouping).
3.  **Reconstruct** the diagram as clean, interactive HTML code.

### 🛠️ Professional Tools
*   **Live Preview**: Real-time rendering in a secure sandbox.
*   **Export Options**:
    *   **HTML**: Download the fully self-contained source code.
    *   **PNG**: High-resolution snapshots (with background layer correction).
    *   **Video**: Record 60fps webm videos of the flow animations.
*   **Theme Engine**: One-click toggling between **Dark Mode** (Neon/Cyberpunk) and **Light Mode** (Blueprint/High-Contrast).

## 🏗️ System Architecture

The application is built using a **Modular Prompt Injection** architecture.

### Tech Stack
*   **Frontend**: React 19, TypeScript, Tailwind CSS
*   **AI Model**: Google Gemini 3 Pro Preview (`gemini-3-pro-preview`) via `@google/genai` SDK
*   **Utilities**: `html2canvas` (Snapshots), `pdf.js` (PDF rendering)

### How It Works

1.  **Prompt Assembly**:
    When you click "Generate", the app constructs a massive System Instruction by combining:
    *   **Base Config**: HTML skeletons, Google Fonts imports.
    *   **Theme Logic**: Dynamic CSS Variables based on the current UI state.
    *   **View Modules**: Specific CSS/JS logic for the selected style (e.g., `view-neon.ts` injects SVG path drawing algorithms).

2.  **AI Generation**:
    The prompt is sent to Gemini. The model returns a single, raw string of HTML.

3.  **Sandboxed Rendering**:
    The HTML is injected into an `iframe`. The embedded JavaScript immediately initializes, drawing connections and setting up interactions without external dependencies.

## 📂 Project Structure

```text
/
├── App.tsx                         # Main Controller & Theme Manager
├── components/
│   ├── InputArea.tsx               # Prompting, File Upload, Style Selection
│   ├── LivePreview.tsx             # Iframe Renderer & Export Logic
│   └── ...
├── services/
│   ├── architecture-generator.core.ts    # Main AI Orchestration
│   ├── view-neon.ts                # Neon Style Logic
│   ├── view-component.ts           # Bento Grid Style Logic
│   └── ...
└── System-Architecture.md          # Detailed technical docs
```

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   A Google Cloud Project with Gemini API access.
*   `API_KEY` set in your environment.

### Installation

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## 📝 Usage Guide

1.  **Enter a Prompt**: Describe your system (e.g., *"Real-time chat app with Redis pub/sub and MongoDB"*).
2.  **Select Style**: Click "Neon Flow" or "Bento Grid". You can select multiple to generate a tabbed interface.
3.  **Optional - Upload Image**: Drag and drop a whiteboard photo to have the AI digitize it.
4.  **Generate**: Watch the progress bar as the "compiler" builds your diagram.
5.  **Interact & Export**: Click nodes to see details, then download the HTML or record a video.

---

**Created by Team Descenders**
