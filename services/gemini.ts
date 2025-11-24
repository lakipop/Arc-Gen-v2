/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const GEMINI_MODEL = 'gemini-3-pro-preview';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY as string });

// Dynamic CSS Variables based on theme
const getThemeVariables = (theme: 'dark' | 'light') => {
    if (theme === 'light') {
        return `
        :root {
            --bg-main: #ffffff;
            --bg-panel: #f8fafc;
            --text-main: #0f172a;
            --text-muted: #475569;
            
            /* Blueprint / High Contrast Colors for White Background */
            --accent-cyan: #0369a1; /* Sky 700 */
            --accent-purple: #7e22ce; /* Purple 700 */
            --accent-gold: #b45309; /* Amber 700 */
            --accent-red: #b91c1c; /* Red 700 */
            
            --border-color: #cbd5e1;
            --border-width: 2px; /* Thicker borders for light mode */
            
            --grid-color: transparent; /* No grid */
            --shadow-color: rgba(0,0,0,0.08);
            --node-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            
            /* Flow Lines - High Visibility */
            --path-color: #94a3b8; 
            --path-active: #0369a1;
            --path-opacity: 1.0;
            
            --flow-primary: #0369a1;
            --flow-secondary: #7e22ce;
            --flow-tertiary: #b45309;
        }
        `;
    }
    return `
    :root {
        --bg-main: #09090b;
        --bg-panel: #18181b;
        --text-main: #e4e4e7;
        --text-muted: #a1a1aa;
        
        /* Neon Colors for Dark Background */
        --accent-cyan: #22d3ee;
        --accent-purple: #c084fc;
        --accent-gold: #facc15;
        --accent-red: #f87171;
        
        --border-color: #27272a;
        --border-width: 1px;
        
        --grid-color: rgba(255,255,255,0.03);
        --shadow-color: rgba(0,0,0,0.5);
        --node-shadow: 0 0 20px rgba(0,0,0,0.2);
        
        /* Flow Lines - Neon Glow */
        --path-color: rgba(255,255,255,0.15);
        --path-active: #22d3ee;
        --path-opacity: 0.3;
        
        --flow-primary: #22d3ee;
        --flow-secondary: #c084fc;
        --flow-tertiary: #facc15;
    }
    `;
};

const BASE_INSTRUCTION = `You are an expert Solutions Architect and Frontend Engineer.
Your GOAL is to generate a SINGLE HTML file containing a comprehensive system architecture diagram.

**CRITICAL REQUIREMENT**: 
1. Return ONLY raw HTML code.
2. The \`body\` MUST have \`overflow: auto\`.
3. Use the provided CSS Variables for ALL colors to ensure theme switching works.

**LAYOUT & POSITIONING**:
1.  **Structure**:
    \`\`\`html
    <body>
      <div class="main-wrapper">
         <h1 class="project-title">PROJECT NAME</h1>
         <!-- Content Container -->
         <div class="diagram-content">...content...</div>
         <div class="footer-credit">
            <span class="status-dot"></span>
            <span>System Architecture by <strong class="team-name">Team Descenders</strong></span>
         </div>
      </div>
    </body>
    \`\`\`

**GLOBAL CSS STYLING**:
\`\`\`css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;600;800&display=swap');

body { background-color: var(--bg-main); color: var(--text-main); font-family: 'Inter', sans-serif; margin: 0; transition: background 0.3s; overflow-y: auto; }

/* SCROLL FIX: min-height instead of height, and let flow naturally */
.main-wrapper { 
  display: flex; flex-direction: column; align-items: center; 
  min-height: 100vh; height: auto;
  padding: 40px; 
  box-sizing: border-box;
  background: var(--bg-main);
  background-image: 
      radial-gradient(circle at 50% 0%, rgba(34, 211, 238, 0.1) 0%, transparent 50%),
      linear-gradient(var(--grid-color) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
  background-size: 100% 100%, 40px 40px, 40px 40px;
}

.diagram-content { 
    flex: 1; 
    width: 100%; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    margin: 20px 0; 
    position: relative; 
    /* Ensure content can grow */
    min-height: 600px;
}

.project-title {
  font-family: 'JetBrains Mono', monospace; font-size: 2.5rem; text-transform: uppercase; letter-spacing: 2px; text-align: center; margin-bottom: 20px; font-weight: 800;
  background: linear-gradient(90deg, var(--accent-cyan), var(--accent-purple), var(--accent-gold));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 10px rgba(var(--accent-cyan), 0.3));
}

.footer-credit {
  font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; margin-top: 40px; padding: 20px;
  border-top: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px; width: 100%; justify-content: center;
}
.team-name { color: var(--accent-cyan); text-shadow: 0 0 5px var(--accent-cyan); }

.status-dot { width: 8px; height: 8px; background-color: #4ade80; border-radius: 50%; animation: blink 2s infinite; }
@keyframes blink { 50% { opacity: 0.5; } }

/* TAB STYLING (Shared) */
.tabs { display: flex; gap: 10px; margin-bottom: 20px; z-index: 10; background: var(--bg-panel); padding: 5px; border-radius: 8px; border: 1px solid var(--border-color); }
.tab-btn { 
  padding: 8px 16px; background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-family: 'JetBrains Mono'; border-radius: 4px; transition: all 0.2s; font-size: 0.8rem;
}
.tab-btn.active { background: var(--accent-cyan); color: #fff; font-weight: bold; box-shadow: 0 2px 10px var(--shadow-color); }
.view-section { display: none; width: 100%; animation: fadeIn 0.5s; flex-direction: column; align-items: center; }
.view-section.active { display: flex; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
\`\`\`
`;

const STYLE_COMPONENT_VIEW = `
  /* STYLE: COMPONENT VIEW (Bento Grid) */
  .bento-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      width: 100%;
      max-width: 1600px;
      padding: 20px;
      grid-auto-rows: minmax(120px, auto);
  }
  
  .bento-card {
      background: var(--bg-panel);
      border: var(--border-width) solid var(--border-color);
      border-radius: 12px;
      padding: 20px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      box-shadow: var(--node-shadow);
  }
  
  .bento-card:hover {
      transform: translateY(-5px) scale(1.02);
      border-color: var(--accent-cyan);
      box-shadow: 0 10px 30px var(--shadow-color);
      z-index: 10;
  }
  
  /* Size variants */
  .bento-large { grid-column: span 2; grid-row: span 2; }
  .bento-wide { grid-column: span 2; }
  .bento-tall { grid-row: span 2; }
  
  /* Color accents */
  .bento-primary { border-left: 4px solid var(--accent-cyan); }
  .bento-secondary { border-left: 4px solid var(--accent-purple); }
  .bento-tertiary { border-left: 4px solid var(--accent-gold); }
  .bento-accent { border-left: 4px solid var(--accent-red); }
  
  .bento-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
  }
  
  .bento-icon {
      width: 36px;
      height: 36px;
      background: rgba(34, 211, 238, 0.1);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: var(--accent-cyan);
      font-weight: bold;
  }
  
  .bento-card h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-main);
      font-family: 'JetBrains Mono';
  }
  
  .bento-card p {
      margin: 10px 0 0 0;
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.6;
  }
  
  .bento-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 15px;
  }
  
  .bento-tag {
      font-size: 0.7rem;
      padding: 4px 10px;
      background: rgba(255,255,255,0.05);
      border-radius: 4px;
      font-family: 'JetBrains Mono';
      color: var(--accent-cyan);
      border: 1px solid var(--border-color);
      transition: all 0.2s;
  }
  
  .bento-card:hover .bento-tag {
      background: rgba(34, 211, 238, 0.15);
      border-color: var(--accent-cyan);
  }
  
  .bento-list {
      list-style: none;
      padding: 0;
      margin: 10px 0 0 0;
  }
  
  .bento-list li {
      padding: 8px 0;
      border-bottom: 1px solid var(--border-color);
      font-size: 0.85rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 8px;
  }
  
  .bento-list li:last-child {
      border-bottom: none;
  }
  
  .bento-list li::before {
      content: "▸";
      color: var(--accent-cyan);
      font-weight: bold;
  }
  
  /* Responsive adjustments */
  @media (max-width: 1024px) {
      .bento-grid { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
      .bento-large { grid-column: span 1; grid-row: span 1; }
      .bento-wide { grid-column: span 1; }
  }
`;

const STYLE_NEON_LOGIC = `
  /* STYLE: NEON FLOW (Interactive) */
  .neon-layout {
      display: flex;
      width: 100%;
      max-width: 1600px;
      justify-content: space-between;
      position: relative;
      padding: 40px 0;
      overflow-x: auto;
  }
  
  /* Neon Columns */
  .neon-col { display: flex; flex-direction: column; gap: 40px; align-items: center; z-index: 5; min-width: 250px; }
  .neon-header { 
      font-family: 'JetBrains Mono'; color: var(--accent-cyan); letter-spacing: 3px; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 20px; position: relative;
      padding-bottom: 10px;
  }
  .neon-header::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 40px; height: 2px; background: var(--accent-cyan); }
  
  /* Neon Nodes */
  .neon-node {
      width: 220px;
      background: rgba(0,0,0,0.6);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 20px;
      position: relative;
      backdrop-filter: blur(10px);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: pointer;
  }
  
  .neon-node:hover {
      transform: scale(1.05);
      box-shadow: 0 0 30px rgba(34, 211, 238, 0.15);
      z-index: 20;
  }
  
  /* Left Border Colors */
  .neon-node.src { border-left: 4px solid var(--accent-cyan); }
  .neon-node.etl { border-left: 4px solid var(--accent-purple); }
  .neon-node.wh { border-left: 4px solid var(--accent-gold); }
  .neon-node.out { border-left: 4px solid var(--text-main); }

  .neon-node h3 { margin: 0 0 5px 0; color: var(--text-main); font-size: 1rem; font-weight: 700; }
  .neon-node p { margin: 0; color: var(--text-muted); font-size: 0.75rem; font-family: 'JetBrains Mono'; }
  
  /* Popup/Modal */
  .neon-modal {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.9);
      width: 400px; background: rgba(15, 15, 20, 0.95); border: 1px solid var(--accent-cyan);
      border-radius: 16px; padding: 30px; z-index: 1000; opacity: 0; pointer-events: none;
      transition: all 0.3s ease; box-shadow: 0 0 50px rgba(0,0,0,0.8);
      backdrop-filter: blur(20px);
  }
  .neon-modal.active { opacity: 1; pointer-events: all; transform: translate(-50%, -50%) scale(1); }
  .modal-close { position: absolute; top: 15px; right: 15px; cursor: pointer; color: var(--text-muted); }
  .modal-close:hover { color: white; }
  
  /* SVG Paths for Neon Flow - FIXED FOR LIGHT THEME */
  #neon-svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
  .neon-path { 
      fill: none; 
      stroke-width: 2px; 
      opacity: var(--path-opacity);
      transition: all 0.3s;
  }
  
  /* Line Types */
  .path-solid { stroke-dasharray: none; }
  .path-dashed { stroke-dasharray: 8, 4; }
  .path-dotted { stroke-dasharray: 2, 4; }

  .neon-path:hover, .neon-path.active { 
      opacity: 1; 
      stroke-width: 3px; 
      filter: drop-shadow(0 0 8px currentColor);
      animation: pathFlow 2s linear infinite;
  }
  
  /* CRITICAL FIX: Path animation now uses CSS variables */
  @keyframes pathFlow {
      from { stroke-dashoffset: 0; }
      to { stroke-dashoffset: 20; }
  }
`;

const STYLE_BRAINSTORMING_LOGIC = `
  /* STYLE: BRAINSTORM DASHBOARD - Enhanced */
  .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      width: 100%;
      max-width: 1400px;
      padding: 40px;
      background-image: linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
      background-size: 20px 20px;
  }
  
  .dash-col { display: flex; flex-direction: column; gap: 20px; }
  .dash-header { 
      font-family: 'JetBrains Mono'; color: var(--accent-cyan); font-weight: 700; letter-spacing: 2px; text-transform: uppercase; font-size: 1rem; 
      text-align: center; border-bottom: 2px solid var(--border-color); padding-bottom: 10px; margin-bottom: 10px;
      transition: all 0.3s;
  }
  
  .dash-header:hover {
      border-bottom-color: var(--accent-cyan);
      transform: translateY(-2px);
  }
  
  .dash-card {
      background: var(--bg-panel);
      border: var(--border-width) solid var(--border-color);
      border-radius: 8px;
      padding: 15px;
      display: flex;
      align-items: center;
      gap: 15px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      position: relative;
      overflow: hidden;
  }
  
  .dash-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.05), transparent);
      transform: translateX(-100%);
      transition: transform 0.6s;
  }
  
  .dash-card:hover {
      border-color: var(--accent-cyan);
      transform: translateX(5px);
      box-shadow: 0 4px 12px var(--shadow-color);
  }
  
  .dash-card:hover::before {
      transform: translateX(100%);
  }
  
  .icon-box { 
      width: 40px; 
      height: 40px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      background: rgba(255,255,255,0.05); 
      border-radius: 6px; 
      color: var(--accent-gold); 
      font-weight: bold; 
      font-size: 0.9rem;
      transition: all 0.3s;
  }
  
  .dash-card:hover .icon-box {
      background: var(--accent-cyan);
      color: var(--bg-main);
      transform: rotate(360deg) scale(1.1);
  }
  
  .dash-content h4 { margin: 0; color: var(--text-main); font-size: 0.95rem; font-weight: 600; }
  .dash-content span { display: block; color: var(--text-muted); font-size: 0.7rem; margin-top: 4px; font-family: 'JetBrains Mono'; }

  /* Enhanced Group Styling */
  .group-staging {
      border: 2px dashed var(--accent-gold);
      padding: 20px;
      border-radius: 10px;
      position: relative;
      margin-top: 10px;
      background: rgba(250, 204, 21, 0.02);
      transition: all 0.3s;
  }
  
  .group-staging:hover {
      background: rgba(250, 204, 21, 0.05);
      border-color: var(--accent-gold);
      box-shadow: 0 0 20px rgba(250, 204, 21, 0.1);
  }
  
  .group-label-yellow { 
      position: absolute; 
      top: -12px; 
      left: 15px; 
      background: var(--bg-main); 
      padding: 2px 10px; 
      color: var(--accent-gold); 
      font-size: 0.7rem; 
      font-weight: bold;
      border-radius: 4px;
      border: 1px solid var(--accent-gold);
  }
  
  .group-warehouse {
      border: 2px solid var(--accent-purple);
      padding: 20px;
      border-radius: 10px;
      position: relative;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      background: rgba(192, 132, 252, 0.02);
      transition: all 0.3s;
  }
  
  .group-warehouse:hover {
      background: rgba(192, 132, 252, 0.05);
      box-shadow: 0 0 20px rgba(192, 132, 252, 0.1);
  }
  
  .group-label-purple { 
      position: absolute; 
      top: -12px; 
      right: 15px; 
      background: var(--accent-purple); 
      padding: 4px 12px; 
      color: white; 
      font-size: 0.7rem; 
      border-radius: 4px;
      font-weight: bold;
  }

  /* Enhanced Mini Tables */
  .mini-table { 
      border: var(--border-width) solid var(--border-color); 
      border-radius: 6px; 
      padding: 12px; 
      background: rgba(0,0,0,0.3);
      transition: all 0.3s;
  }
  
  .mini-table:hover {
      border-color: var(--accent-cyan);
      transform: scale(1.02);
      background: rgba(34, 211, 238, 0.05);
  }
  
  .mini-table-title { 
      font-size: 0.7rem; 
      color: var(--text-muted); 
      text-transform: uppercase; 
      margin-bottom: 8px;
      font-weight: bold;
  }
  
  .mini-row { 
      display: block; 
      font-family: 'JetBrains Mono'; 
      font-size: 0.75rem; 
      color: var(--accent-cyan); 
      margin-bottom: 6px; 
      padding-left: 10px; 
      border-left: 2px solid var(--border-color);
      transition: all 0.2s;
  }
  
  .mini-row:hover {
      border-left-color: var(--accent-cyan);
      padding-left: 15px;
      color: var(--text-main);
  }
  
  /* Click effect */
  .dash-card:active {
      transform: translateX(5px) scale(0.98);
  }
`;

const STYLE_MODERN_FLOW = `
  /* STYLE: MODERN FLOW DIAGRAM (Cyberpunk Theme) */
  
  /* Cyberpunk Flow Animations */
  .flow-line { fill: none; stroke-linecap: round; transition: all 0.3s; }
  @keyframes flowPulse { 
      to { stroke-dashoffset: -1000; } 
  }

  .flow-primary { 
      stroke: var(--flow-primary); 
      stroke-width: 3px; 
      stroke-dasharray: 20 10; 
      animation: flowPulse 20s linear infinite; 
      filter: drop-shadow(0 0 5px var(--flow-primary));
  }
  .flow-secondary { 
      stroke: var(--flow-secondary); 
      stroke-width: 2px; 
      stroke-dasharray: 10 5; 
      animation: flowPulse 40s linear infinite; 
      opacity: 0.8;
  }
  .flow-tertiary { 
      stroke: var(--flow-tertiary); 
      stroke-width: 1px; 
      stroke-dasharray: 4 8; 
      animation: flowPulse 60s linear infinite; 
      opacity: 0.6;
  }

  /* Modern Controls */
  .modern-controls { margin-bottom: 20px; }
  
  /* Flow Container */
  .flow-container { 
      width: 100%; 
      max-width: 900px; 
      display: flex; 
      flex-direction: column; 
      gap: 25px; 
      padding: 30px;
  }
  
  .flow-step { 
      display: flex; 
      gap: 20px; 
      padding: 25px; 
      background: var(--bg-panel); 
      border: var(--border-width) solid var(--border-color); 
      border-radius: 12px; 
      position: relative; 
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
  }
  
  .flow-step::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      transition: width 0.3s;
  }
  
  .flow-step:hover { 
      transform: translateX(10px); 
      background: linear-gradient(90deg, var(--bg-panel), rgba(34, 211, 238, 0.05)); 
      border-color: var(--accent-cyan);
      box-shadow: 0 4px 20px var(--shadow-color);
  }
  
  .flow-step:hover::before {
      width: 8px;
  }
  
  .step-number { 
      font-family: 'JetBrains Mono'; 
      font-size: 1.8rem; 
      font-weight: 800; 
      opacity: 0.3; 
      min-width: 50px;
      transition: all 0.3s;
  }
  
  .flow-step:hover .step-number {
      opacity: 1;
      color: var(--accent-cyan);
      transform: scale(1.2);
  }
  
  /* Border colors for different step types */
  .step-ingest { border-left: 4px solid var(--accent-red); }
  .step-ingest::before { background: var(--accent-red); }
  
  .step-process { border-left: 4px solid var(--accent-purple); }
  .step-process::before { background: var(--accent-purple); }
  
  .step-store { border-left: 4px solid var(--accent-gold); }
  .step-store::before { background: var(--accent-gold); }
  
  .step-serve { border-left: 4px solid var(--accent-cyan); }
  .step-serve::before { background: var(--accent-cyan); }

  .step-content h3 { 
      margin: 0 0 8px 0; 
      font-size: 1.15rem; 
      color: var(--text-main); 
      font-family: 'JetBrains Mono';
      transition: color 0.3s;
  }
  
  .flow-step:hover .step-content h3 {
      color: var(--accent-cyan);
  }
  
  .step-content p { 
      margin: 0; 
      font-size: 0.9rem; 
      color: var(--text-muted); 
      line-height: 1.6; 
  }
  
  .tech-tags { 
      display: flex; 
      gap: 8px; 
      margin-top: 12px; 
      flex-wrap: wrap; 
  }
  
  .tech-tag { 
      font-size: 0.7rem; 
      padding: 4px 10px; 
      background: rgba(255,255,255,0.05); 
      border-radius: 4px; 
      font-family: 'JetBrains Mono'; 
      color: var(--accent-cyan); 
      border: 1px solid var(--border-color);
      transition: all 0.2s;
  }
  
  .tech-tag:hover {
      background: var(--accent-cyan);
      color: var(--bg-main);
      transform: translateY(-2px);
  }

  /* SVG Specific Styles for Architecture Diagram */
  svg { 
      width: 100%; 
      height: auto; 
      max-width: 1200px; 
      background: rgba(0,0,0,0.2); 
      border-radius: 12px; 
      border: var(--border-width) solid var(--border-color); 
      box-shadow: 0 0 20px rgba(0,0,0,0.5); 
  }
  
  .svg-text { 
      font-family: 'JetBrains Mono', monospace; 
      fill: var(--text-main); 
      font-size: 12px; 
  }
  
  .svg-label { 
      font-weight: bold; 
      font-size: 14px; 
      text-transform: uppercase; 
  }
  
  .svg-sublabel { 
      fill: var(--text-muted); 
      font-size: 10px; 
  }
  
  .node-box { 
      fill: var(--bg-panel); 
      stroke: var(--border-color); 
      stroke-width: 1; 
      rx: 6; 
      transition: all 0.3s; 
  }
  
  .node-box:hover { 
      stroke: var(--accent-cyan); 
      filter: drop-shadow(0 0 8px var(--accent-cyan)); 
  }
  
  .group-label { 
      font-family: 'JetBrains Mono'; 
      font-size: 16px; 
      fill: var(--text-muted); 
      font-weight: bold; 
      letter-spacing: 2px; 
      opacity: 0.5; 
  }

  /* Node Specific Colors */
  .node-source { stroke: var(--accent-red); stroke-width: 2px; }
  .node-etl { stroke: var(--accent-purple); stroke-width: 2px; }
  .node-db { stroke: var(--accent-gold); stroke-width: 2px; }
  .node-app { stroke: var(--accent-cyan); stroke-width: 2px; }
`;
const COMPONENT_VIEW_JS_ENGINE = `
<script>
  function initBentoInteractions() {
    const bentoCards = document.querySelectorAll('.bento-card');
    bentoCards.forEach(card => {
      card.addEventListener('click', function() {
        this.classList.toggle('expanded');
      });
    });
  }
  if(document.querySelector('.bento-grid')) {
    setTimeout(initBentoInteractions, 100);
  }
</script>
`;

const NEON_JS_ENGINE = `
<script>
  function drawNeonConnections() {
    const svg = document.getElementById('neon-svg');
    if(!svg) return;
    svg.innerHTML = '';
    if(typeof neonConnections === 'undefined') return;

    neonConnections.forEach(conn => {
        const fromEl = document.getElementById(conn.from);
        const toEl = document.getElementById(conn.to);
        if (fromEl && toEl) {
            const fromRect = fromEl.getBoundingClientRect();
            const toRect = toEl.getBoundingClientRect();
            const container = document.querySelector('.neon-layout');
            if(!container) return;
            const containerRect = container.getBoundingClientRect();

            const startX = fromRect.right - containerRect.left;
            const startY = fromRect.top + fromRect.height/2 - containerRect.top;
            const endX = toRect.left - containerRect.left;
            const endY = toRect.top + toRect.height/2 - containerRect.top;

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            const d = \`M \${startX} \${startY} C \${startX + (endX-startX)*0.6} \${startY}, \${endX - (endX-startX)*0.6} \${endY}, \${endX} \${endY}\`;
            path.setAttribute("d", d);
            
            // FIX: Add node-specific classes for targeting
            path.setAttribute("class", \`neon-path path-\${conn.type || 'solid'} path-from-\${conn.from} path-to-\${conn.to}\`);
            path.style.stroke = getComputedStyle(document.documentElement).getPropertyValue(\`--flow-\${conn.colorType || 'primary'}\`).trim();
            
            // Store connection data on the path element
            path.setAttribute('data-from', conn.from);
            path.setAttribute('data-to', conn.to);
            
            svg.appendChild(path);
        }
    });
  }

  function setupNeonInteractions() {
     const nodes = document.querySelectorAll('.neon-node');
     const modal = document.getElementById('neon-info-modal');
     if(modal) {
         nodes.forEach(node => {
             node.addEventListener('click', (e) => {
                 e.stopPropagation();
                 document.getElementById('modal-title').innerText = node.querySelector('h3').innerText;
                 document.getElementById('modal-body').innerHTML = node.getAttribute('data-info') || "No details.";
                 modal.classList.add('active');
             });
             
             node.addEventListener('mouseenter', () => {
                 const nodeId = node.id;
                 // FIX: Select ALL paths connected to this node (both incoming and outgoing)
                 const connectedPaths = document.querySelectorAll(\`.path-from-\${nodeId}, .path-to-\${nodeId}\`);
                 connectedPaths.forEach(p => {
                     p.classList.add('active');
                     // Force animation restart
                     const currentAnimation = p.style.animation;
                     p.style.animation = 'none';
                     setTimeout(() => {
                         p.style.animation = currentAnimation || '';
                     }, 10);
                 });
             });
             
             node.addEventListener('mouseleave', () => {
                 const nodeId = node.id;
                 // FIX: Remove active class from all connected paths
                 const connectedPaths = document.querySelectorAll(\`.path-from-\${nodeId}, .path-to-\${nodeId}\`);
                 connectedPaths.forEach(p => p.classList.remove('active'));
             });
         });
         document.querySelector('.modal-close').addEventListener('click', () => modal.classList.remove('active'));
     }
  }

  if(document.querySelector('.neon-layout')) {
      setTimeout(() => { drawNeonConnections(); setupNeonInteractions(); }, 500);
      window.addEventListener('resize', drawNeonConnections);
  }
</script>
`;

const MODERN_FLOW_JS_ENGINE = `
<script>
  function showMod(viewId, btn) {
      document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
      document.querySelectorAll('.modern-controls .tab-btn').forEach(b => b.classList.remove('active'));
      const target = document.getElementById('mod-' + viewId);
      if(target) target.classList.add('active');
      btn.classList.add('active');
  }
</script>
`;

const BRAINSTORM_JS_ENGINE = `
<script>
  function initDashboardInteractions() {
      const dashCards = document.querySelectorAll('.dash-card');
      dashCards.forEach(card => {
          card.addEventListener('click', function() {
              this.style.transform = 'translateX(5px) scale(0.98)';
              setTimeout(() => this.style.transform = '', 200);
          });
      });
  }
  if(document.querySelector('.dashboard-grid')) {
      setTimeout(initDashboardInteractions, 100);
  }
</script>
`;
export async function bringToLife(
  prompt: string, 
  styles: string[], 
  theme: 'dark' | 'light', 
  fileBase64?: string, 
  mimeType?: string
): Promise<string> {
  const parts: any[] = [];
  const cssVars = getThemeVariables(theme);

  // Extract team/creator name from prompt
  const extractTeamName = (promptText: string): string => {
    const lowerPrompt = promptText.toLowerCase();
    
    // Patterns to detect team/creator mentions
    const patterns = [
      /(?:by|created by|developed by|team|creator|author|made by)\s+([a-z0-9\s]{3,30})/i,
      /(?:for|from)\s+team\s+([a-z0-9\s]{3,30})/i,
      /team[:\s]+([a-z0-9\s]{3,30})/i
    ];
    
    for(const pattern of patterns) {
      const match = promptText.match(pattern);
      if(match && match[1]) {
        return match[1].trim();
      }
    }
    
    return 'Team Descenders'; // Default
  };
  
  const teamName = extractTeamName(prompt);

  const validStyles = ['neon', 'brainstorming', 'component', 'modern'];
  let activeStyles = styles.filter(s => validStyles.includes(s));
  if (!activeStyles || activeStyles.length === 0) activeStyles = ['neon'];

  const styleConfig: Record<string, { label: string, css: string, js: string, container: string, promptInfo: string }> = {
    'neon': {
        label: "Neon Flow",
        css: STYLE_NEON_LOGIC,
        js: NEON_JS_ENGINE,
        container: `<div class="neon-layout"><svg id="neon-svg"></svg></div><div id="neon-info-modal" class="neon-modal"><span class="modal-close">&times;</span><h2 id="modal-title" style="color:var(--accent-cyan); margin-top:0;">Title</h2><div id="modal-body" style="color:var(--text-muted); font-size:0.9rem;"></div></div>`,
        promptInfo: `NEON FLOW: Create neon-layout, neon-col, neon-node with id and data-info. Add neonConnections script.`
    },
    'brainstorming': {
        label: "Brainstorm Dashboard",
        css: STYLE_BRAINSTORMING_LOGIC,
        js: BRAINSTORM_JS_ENGINE,
        container: `<div class="dashboard-grid"></div>`,
        promptInfo: `BRAINSTORM: Create dashboard-grid with 4 dash-col. Use dash-card, group-staging, group-warehouse.`
    },
    'component': {
        label: "Component View",
        css: STYLE_COMPONENT_VIEW,
        js: COMPONENT_VIEW_JS_ENGINE,
        container: `<div class="bento-grid"></div>`,
        promptInfo: `COMPONENT VIEW: Create bento-grid with bento-card (sizes: bento-large/wide/tall, colors: bento-primary/secondary/tertiary/accent).`
    },
    'modern': {
        label: "Modern Flow Diagram (Cyberpunk Theme)",
        css: STYLE_MODERN_FLOW,
        js: MODERN_FLOW_JS_ENGINE,
        container: `<div class="modern-controls tabs"><button class="tab-btn active" onclick="showMod('arch', this)">Architecture Diagram</button><button class="tab-btn" onclick="showMod('flow', this)">Data Flow Logic</button></div><div id="mod-arch" class="view-section active"></div><div id="mod-flow" class="view-section"><div class="flow-container"></div></div>`,
        promptInfo: `MODERN FLOW: Create SVG architecture + flow-step text explanations in two tabs.`
    }
  };

  let styleInstruction = "";
  if (activeStyles.length > 1) {
      const tabsHtml = activeStyles.map((s, i) => 
          `<button class="tab-btn ${i === 0 ? 'active' : ''}" onclick="switchMainTab('${s}')">${styleConfig[s].label}</button>`
      ).join('\n');
      const contentHtml = activeStyles.map((s, i) => `
          <div id="${s}" class="view-section ${i === 0 ? 'active' : ''}">
             <style>${styleConfig[s].css}</style>
             ${styleConfig[s].container}
             ${styleConfig[s].js}
          </div>
      `).join('\n');
      styleInstruction = `<div class="tabs">${tabsHtml}</div>${contentHtml}<script>function switchMainTab(mode){document.querySelectorAll('.view-section').forEach(el=>el.classList.remove('active'));document.querySelectorAll('.tabs .tab-btn').forEach(el=>el.classList.remove('active'));const target=document.getElementById(mode);if(target)target.classList.add('active');event.target.classList.add('active');}</script>`;
  } else {
      const s = activeStyles[0];
      styleInstruction = `<style>${styleConfig[s].css}</style>${styleConfig[s].container}${styleConfig[s].js}`;
  }

  const specificInstructions = activeStyles.map(s => styleConfig[s].promptInfo).join('\n');
  const teamInstruction = `
    **FOOTER TEAM NAME:**
    In the footer-credit section, use: <strong class="team-name">${teamName}</strong>
    The exact HTML should be:
    <div class="footer-credit">
    <span class="status-dot"></span>
    <span>System Architecture by <strong class="team-name">${teamName}</strong></span>
    </div>
    `;

  const systemInstruction = `${BASE_INSTRUCTION}\n${cssVars}\n${styleInstruction}\n${specificInstructions}\n${teamInstruction}\nGenerate based on user input only. No hardcoded tech.`;
  const basePrompt = `Generate architecture for: "${prompt}". Styles: ${activeStyles.join(', ')}. Theme: ${theme}. Creator/Team: ${teamName}.`;
  parts.push({ text: basePrompt });
  if (fileBase64 && mimeType) {
    parts.push({ inlineData: { data: fileBase64, mimeType: mimeType } });
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: { parts: parts },
      config: { systemInstruction: systemInstruction, temperature: 0.5 },
    });
    let text = response.text || "<!-- Failed -->";
    text = text.replace(/^```html\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');
    return text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}