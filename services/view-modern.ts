
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const STYLE_CYBERPUNK = `
  /* STYLE: CYBERPUNK / MODERN FLOW (Reference Image Style) */
  
  /* Modern Thin Scrollbar - Dark & Smooth */
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  ::-webkit-scrollbar-track {
    background: transparent; 
  }
  ::-webkit-scrollbar-thumb {
    background: #333; 
    border-radius: 4px;
    transition: background 0.3s;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555; 
  }
  
  .cyberpunk-container {
      background-color: #050505;
      background-image: 
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      min-height: 100vh;
      width: 100%;
      padding: 30px; /* Reduced padding for better 1080p fit */
      box-sizing: border-box;
      position: relative;
      overflow-x: auto;
      display: flex;
      justify-content: center;
      align-items: center; /* Center vertically */
      font-family: 'Inter', sans-serif;
  }

  /* Main Diagram Layout */
  .cyber-wrapper {
      display: flex;
      gap: 80px; /* Reduced from 120px for compact view */
      align-items: flex-start; 
      position: relative;
      z-index: 2;
      padding: 20px;
  }

  /* SVG Layer for connections */
  #cyber-svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      overflow: visible;
  }

  /* Columns (Layers) */
  .cyber-col {
      display: flex;
      flex-direction: column;
      gap: 25px; /* Reduced from 40px */
      align-items: stretch;
      min-width: 240px; /* Reduced from 280px */
      z-index: 2;
      position: relative;
  }

  /* NODES - Reference Style */
  .cyber-node {
      background: #09090b; /* Very dark zinc */
      border: 1px solid #27272a;
      border-radius: 8px; /* Slightly rounded */
      padding: 20px;
      width: 260px;
      position: relative;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
      transition: all 0.4s ease;
      display: flex;
      flex-direction: column;
      gap: 8px;
  }

  .cyber-node:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.7);
      border-color: #52525b;
      z-index: 10;
  }

  /* Left Border Accents (Visual Coding) */
  .accent-purple { border-left: 4px solid #a855f7; }
  .accent-cyan   { border-left: 4px solid #06b6d4; }
  .accent-gold   { border-left: 4px solid #eab308; }
  .accent-pink   { border-left: 4px solid #ec4899; }
  .accent-white  { border-left: 4px solid #f4f4f5; }

  /* Group Containers (Staging/DW) - Dashed Border Style */
  .cyber-group {
      border: 1px dashed #3f3f46;
      border-radius: 12px;
      padding: 25px 20px 20px 20px; /* Compact padding */
      background: rgba(24, 24, 27, 0.4); /* Semi-transparent background */
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 15px; /* Reduced gap */
      margin-top: 10px;
  }
  
  .cyber-group:hover {
      border-color: #71717a;
      background: rgba(24, 24, 27, 0.6);
  }

  /* Group specific border colors */
  .group-cyan { border-color: #06b6d4; }
  .group-gold { border-color: #eab308; }

  .group-label {
      position: absolute;
      top: -10px;
      left: 15px;
      background: #050505; /* Matches body bg to hide line */
      padding: 0 10px;
      color: #e4e4e7;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
  }
  
  /* Text Styles */
  .node-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 4px;
  }
  
  .node-title {
      font-weight: 700;
      color: #fff;
      font-size: 0.9rem; /* Slightly smaller font */
      margin: 0;
      line-height: 1.2;
  }
  
  .node-icon {
      font-size: 1.1rem;
      opacity: 0.9;
  }

  .node-desc {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.65rem;
      color: #a1a1aa;
      line-height: 1.4;
      text-transform: uppercase;
      letter-spacing: 0.5px;
  }
  
  .node-list {
      margin: 6px 0 0 0;
      padding-left: 12px;
      list-style-type: disc;
      color: #71717a;
      font-size: 0.7rem;
      font-family: 'Inter', sans-serif;
  }
  
  .node-list li { margin-bottom: 2px; }
  .node-list li::marker { color: #52525b; }

  /* CONNECTION LINES */
  .cyber-path {
      fill: none;
      stroke-width: 2px;
      stroke-linecap: square; /* Sharp ends */
      opacity: 0.8;
      transition: all 0.3s;
  }
  
  /* Dashed Animation Style */
  .path-animated {
      stroke-dasharray: 8 8; /* Distinct dashes */
      animation: flowDash 1s linear infinite; /* Constant flow */
  }

  /* Colors matching accents */
  .path-cyan { stroke: #06b6d4; filter: drop-shadow(0 0 4px rgba(6, 182, 212, 0.4)); }
  .path-purple { stroke: #a855f7; filter: drop-shadow(0 0 4px rgba(168, 85, 247, 0.4)); }
  .path-gold { stroke: #eab308; filter: drop-shadow(0 0 4px rgba(234, 179, 8, 0.4)); }

  @keyframes flowDash {
      from { stroke-dashoffset: 32; }
      to { stroke-dashoffset: 0; }
  }

  /* Highlight on hover */
  .cyber-path.active {
      stroke-width: 3px;
      filter: drop-shadow(0 0 8px currentColor);
      z-index: 100;
      opacity: 1;
  }
`;

const CYBERPUNK_JS_ENGINE = `
<script>
  function drawCyberpunkLines() {
      const svg = document.getElementById('cyber-svg');
      if(!svg) return;
      svg.innerHTML = ''; // clear

      if(typeof cyberConnections === 'undefined') return;

      // Helper to find port coordinates (Right side for out, Left side for in)
      const getPort = (el, type) => {
          if (!el) return { x: 0, y: 0 };
          const rect = el.getBoundingClientRect();
          const container = document.querySelector('.cyber-wrapper').getBoundingClientRect();
          const relTop = rect.top - container.top;
          const relLeft = rect.left - container.left;
          
          if(type === 'in') {
             // Left Middle
             return { x: relLeft, y: relTop + rect.height/2 };
          } else {
             // Right Middle
             return { x: relLeft + rect.width, y: relTop + rect.height/2 };
          }
      };

      cyberConnections.forEach(conn => {
          const fromEl = document.getElementById(conn.from);
          const toEl = document.getElementById(conn.to);
          
          if(fromEl && toEl) {
              const start = getPort(fromEl, 'out');
              const end = getPort(toEl, 'in');
              
              const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
              
              // MANHATTAN / ORTHOGONAL ROUTING
              // Algorithm: Move horizontal to midpoint, vertical to target Y, horizontal to target X
              
              const midX = start.x + (end.x - start.x) / 2;
              
              // Path definition: M -> L -> L -> L
              const d = \`M \${start.x} \${start.y} 
                         L \${midX} \${start.y} 
                         L \${midX} \${end.y} 
                         L \${end.x} \${end.y}\`;
              
              path.setAttribute("d", d);
              
              // Apply styling
              const colorClass = conn.color === 'purple' ? 'path-purple' : (conn.color === 'gold' ? 'path-gold' : 'path-cyan');
              path.setAttribute("class", \`cyber-path path-animated \${colorClass} path-from-\${conn.from} path-to-\${conn.to}\`);
              
              svg.appendChild(path);
          }
      });
  }

  function setupCyberInteractions() {
      const nodes = document.querySelectorAll('.cyber-node, .cyber-group');
      
      nodes.forEach(node => {
          // Hover Logic for Flow Highlighting
          node.addEventListener('mouseenter', (e) => {
             e.stopPropagation();
             const id = node.id;
             if(id) {
                 document.querySelectorAll(\`.path-from-\${id}, .path-to-\${id}\`).forEach(p => p.classList.add('active'));
             }
          });
          
          node.addEventListener('mouseleave', () => {
             const id = node.id;
             if(id) {
                 document.querySelectorAll(\`.path-from-\${id}, .path-to-\${id}\`).forEach(p => p.classList.remove('active'));
             }
          });
      });
  }

  if(document.querySelector('.cyber-wrapper')) {
      setTimeout(() => { drawCyberpunkLines(); setupCyberInteractions(); }, 500);
      window.addEventListener('resize', drawCyberpunkLines);
  }
</script>
`;

export const MODERN_CONFIG = {
    label: "Cyberpunk Architecture",
    css: STYLE_CYBERPUNK,
    js: CYBERPUNK_JS_ENGINE,
    container: `
    <div class="cyberpunk-container">
        <div class="cyber-wrapper">
            <svg id="cyber-svg"></svg>
            <!-- Content Injected Here by AI -->
        </div>
    </div>
    `,
    promptInfo: `CYBERPUNK ARCHITECTURE INSTRUCTIONS:
    1. **Layout Strategy**: Organize the user's system into 3-4 logical columns (e.g., Sources -> Ingestion/Staging -> Storage/Processing -> Consumption).
    2. **Structure**:
       - Create a \`div.cyber-wrapper\`.
       - Inside, create \`div.cyber-col\` for each column.
    3. **Nodes**:
       - Use \`div.cyber-node\` for components.
       - Attributes: \`id\`, \`class="cyber-node accent-[cyan|purple|gold|white]"\`.
       - Content:
         - \`div.node-header\` -> \`h3.node-title\` + \`span.node-icon\` (emoji).
         - \`div.node-desc\` (short tech detail).
    4. **Groups**:
       - If multiple components belong together (e.g., Staging Area, Data Warehouse), wrap them in \`div.cyber-group\`.
       - Add \`div.group-label\` inside the group (e.g., "DATA WAREHOUSE").
       - Add border color class: \`group-cyan\` or \`group-gold\`.
    5. **Connections**:
       - Generate a JSON array \`cyberConnections\` = [{from: 'id', to: 'id', color: 'cyan'}].
       - Use 'purple' for ingestion flows, 'cyan' for internal flows, 'gold' for outputs.
    6. **GROUNDING**: content MUST be based on the user's prompt (e.g., if they ask for a Chat App, do NOT show StatsBomb or MySQL unless relevant). Ensure the diagram is fully detailed and the animations are smooth.
    `
};
