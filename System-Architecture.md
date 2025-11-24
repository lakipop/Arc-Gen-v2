
# System Architecture Documentation

## Overview
The **Interactive Architecture Generator V1** is a React-based web application designed to generate professional, interactive system architecture diagrams using Generative AI (Google Gemini 1.5 Pro). The system takes user text prompts and optional reference images, processes them through a sophisticated prompt engineering pipeline, and renders a self-contained HTML/CSS/JS artifact that is fully interactive.

## Directory Structure

```text
├── index.html                      # Application entry point & Tailwind setup
├── index.tsx                       # React DOM mounting
├── App.tsx                         # Main Application Controller
├── components/                     # UI Components
│   ├── Hero.tsx                    # Landing page visual header
│   ├── InputArea.tsx               # Main user interaction (Prompt, Styles, File Upload)
│   ├── LivePreview.tsx             # Iframe renderer, recording, and export logic
│   └── CreationHistory.tsx         # History sidebar/timeline of generated artifacts
├── services/                       # Core Business Logic & AI Integration
│   ├── architecture-generator.core.ts    # Main orchestration service (AI calls)
│   ├── architecture-generator.config.ts  # Base configuration & Global Theme variables
│   ├── view-neon.ts                # Configuration for "Neon Flow" visualization
│   ├── view-brainstorm.ts          # Configuration for "Brainstorming" visualization
│   ├── view-component.ts           # Configuration for "Bento Grid" visualization
│   └── view-modern.ts              # Configuration for "Cyberpunk" visualization
└── metadata.json                   # App capabilities manifest
```

## Component Responsibilities

### Core Application (`App.tsx`)
- **State Management**: Manages global application state (current theme, active generation, history).
- **Routing**: Orchestrates the flow between the Hero/Input view and the Live Preview.
- **Service Integration**: Calls the `architecture-generator.core.ts` service to initiate AI generation.

### UI Components
- **InputArea.tsx**:
  - Handles complex user inputs (Text, File Drag & Drop, Style Selection).
  - Implements the "Cycling Text" animation for prompt inspiration.
  - Manages style selection logic (Single vs Multi-select).
- **LivePreview.tsx**:
  - **Sandboxing**: Renders generated HTML safely within an `iframe`.
  - **Exporting**: Uses `html2canvas` for PNG snapshots and `MediaRecorder` for video exports.
  - **Loading State**: Displays a simulated terminal/progress bar during AI generation.

### AI Services (`services/`)
The architecture uses a **Modular Strategy Pattern** to construct prompts dynamically.

1.  **`architecture-generator.core.ts`**:
    - The entry point for generation (`bringToLife` function).
    - Detects "Team/Creator" names from prompts using Regex.
    - Aggregates configuration from specific View modules.
    - Constructs the final `System Instruction` for Gemini.

2.  **`architecture-generator.config.ts`**:
    - Defines the **Global CSS Variables** (Theme Engine) for Dark/Light mode.
    - Defines the **Base HTML Skeleton** that ensures consistency across all outputs.

3.  **View Modules (`view-*.ts`)**:
    - Each module exports a self-contained configuration object:
        - `css`: Unique styling for that view.
        - `js`: JavaScript logic for interactivity (e.g., drawing SVG lines, drag-and-drop).
        - `container`: HTML wrapper structure.
        - `promptInfo`: Specific instructions for the AI on how to populate this view.

## Prompt Engineering System

The core innovation lies in how the `System Instruction` is dynamically assembled before being sent to the LLM.

### 1. The Assembly Pipeline
When a user requests a diagram, the system builds the prompt in layers:

| Layer | Source | Description |
| :--- | :--- | :--- |
| **Foundation** | `BASE_INSTRUCTION` | Enforces HTML structure, `overflow: auto`, and import of specific Google Fonts. |
| **Theme Engine** | `getThemeVariables()` | Injects CSS Variables (e.g., `--accent-cyan`) based on the user's selected UI theme (Dark/Light). This ensures the generated HTML supports theming natively. |
| **View Logic** | `StyleConfig` | Injects the CSS/JS specific to the selected style (e.g., SVG drawing logic for Neon, Grid layouts for Bento). |
| **Content Rules** | `promptInfo` | Tells the AI specifically what HTML classes to use (e.g., "Use `.neon-node` for services"). |
| **User Context** | User Input | The actual prompt describing the system (e.g., "Uber Backend"). |

### 2. Multi-View Generation
If multiple styles are selected, the System Prompt instructs the AI to:
1.  Generate HTML for **all** selected views.
2.  Wrap them in a Tab container.
3.  Inject a JS Tab Switcher script.

### 3. The "Self-Contained" Rule
The AI is strictly instructed to return **Raw HTML** only. It does not return Markdown or explanations. This allows the response to be piped directly into the `srcDoc` of the iframe in `LivePreview.tsx`.

## Data Flow

1.  **User Input**: Text + Optional Image (Base64).
2.  **Prompt Construction**: React State -> `architecture-generator.core.ts`.
3.  **AI Processing**: Request sent to `gemini-3-pro-preview`.
4.  **Response Handling**:
    - Raw text received.
    - Markdown code blocks (````html`) stripped.
5.  **Rendering**: String injected into `iframe`.
6.  **Interactivity**: The injected JS (from View Modules) initializes inside the iframe, setting up SVG paths, click handlers, and animations.

## Technical Constraints & Safety
- **Overflow Handling**: The body is forced to `overflow: auto` to ensure large diagrams are scrollable.
- **Sandboxing**: The preview iframe uses `sandbox="allow-scripts allow-same-origin allow-modals"` to prevent malicious execution while allowing necessary interactivity.
- **Theme Consistency**: All generated CSS uses CSS Variables (`var(--accent-cyan)`) instead of hardcoded hex values, allowing the `LivePreview` to manipulate the look and feel dynamically.
