/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const getThemeVariables = (theme: 'dark' | 'light') => {
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

export const BASE_INSTRUCTION = `You are an expert Solutions Architect and Frontend Engineer.
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