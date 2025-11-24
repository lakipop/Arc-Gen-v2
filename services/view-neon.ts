
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const STYLE_NEON_LOGIC = `
  /* STYLE: NEON FLOW (Interactive) */
  
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

  .neon-layout {
      display: flex;
      width: fit-content;
      min-width: 100%;
      min-height: 100vh;
      justify-content: center;
      align-items: center;
      gap: 80px; 
      position: relative;
      padding: 60px;
      box-sizing: border-box;
  }
  
  /* Neon Columns */
  .neon-col { 
      display: flex; 
      flex-direction: column; 
      gap: 50px; 
      align-items: center; 
      z-index: 5; 
      min-width: 220px;
      flex-shrink: 0;
      position: relative;
  }
  
  .neon-header { 
      font-family: 'JetBrains Mono'; color: var(--text-muted); letter-spacing: 3px; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 20px; 
      border-bottom: 1px solid var(--accent-cyan); padding-bottom: 8px;
      text-shadow: 0 0 10px rgba(34, 211, 238, 0.3);
  }
  
  /* Neon Nodes - Enhanced Style */
  .neon-node {
      width: 200px;
      background: rgba(9, 9, 11, 0.9);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 16px 20px;
      position: relative;
      backdrop-filter: blur(12px);
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
  }
  
  .neon-node:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 0 25px rgba(34, 211, 238, 0.15), inset 0 0 10px rgba(34, 211, 238, 0.05);
      border-color: var(--accent-cyan);
      z-index: 20;
  }
  
  /* Left Border Colors */
  .neon-node.src { border-left: 3px solid var(--accent-cyan); }
  .neon-node.etl { border-left: 3px solid var(--accent-purple); }
  .neon-node.wh { border-left: 3px solid var(--accent-gold); }
  .neon-node.out { border-left: 3px solid var(--text-main); }

  .neon-node h3 { margin: 0 0 6px 0; color: var(--text-main); font-size: 0.95rem; font-weight: 600; letter-spacing: 0.5px; }
  .neon-node p { margin: 0; color: var(--text-muted); font-size: 0.7rem; font-family: 'JetBrains Mono'; line-height: 1.4; opacity: 0.8; }
  
  /* Popup/Modal */
  .neon-modal {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.9);
      width: 400px; background: rgba(9, 9, 11, 0.98); border: 1px solid var(--accent-cyan);
      border-radius: 12px; padding: 30px; z-index: 1000; opacity: 0; pointer-events: none;
      transition: all 0.3s ease; box-shadow: 0 0 80px rgba(0,0,0,0.9);
      backdrop-filter: blur(20px);
  }
  .neon-modal.active { opacity: 1; pointer-events: all; transform: translate(-50%, -50%) scale(1); }
  .modal-close { position: absolute; top: 15px; right: 15px; cursor: pointer; color: var(--text-muted); font-size: 1.2rem; }
  .modal-close:hover { color: white; }
  
  /* SVG Paths for Neon Flow */
  #neon-svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; overflow: visible; }
  
  .neon-path { 
      fill: none; 
      stroke-width: 2px; 
      opacity: 0.3;
      transition: all 0.5s ease;
      stroke-linecap: round;
      /* Removed Arrowheads as requested */
  }
  
  /* Line Types & Animations */
  
  /* Solid lines: Very slow, smooth flow in normal state */
  .path-solid { 
      stroke-dasharray: 12, 12; 
      animation: flowAnimation 120s linear infinite; /* Extremely slow flow */
  }
  
  .path-dashed { stroke-dasharray: 6, 8; animation: flowAnimation 140s linear infinite; }
  .path-dotted { stroke-dasharray: 3, 6; animation: flowAnimation 160s linear infinite; }

  /* Active/Hover State: Fast & Intense Glow */
  .neon-path:hover, .neon-path.active { 
      opacity: 1; 
      stroke-width: 3px; 
      stroke-dasharray: 10, 5; /* Tighter dash for speed illusion */
      /* Double drop-shadow for intense neon neon glow */
      filter: drop-shadow(0 0 6px currentColor) drop-shadow(0 0 15px currentColor);
      animation: flowAnimation 3s linear infinite; /* Smooth active speed (adjusted from 0.8s) */
      z-index: 10;
  }
  
  @keyframes flowAnimation {
      from { stroke-dashoffset: 1000; }
      to { stroke-dashoffset: 0; }
  }
`;

const NEON_JS_ENGINE = `
<script>
  function drawNeonConnections() {
    const svg = document.getElementById('neon-svg');
    if(!svg) return;
    
    // Clear existing content (No markers needed)
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

            // Calculate anchor points (Right side of source -> Left side of target)
            const startX = fromRect.right - containerRect.left;
            const startY = fromRect.top + fromRect.height/2 - containerRect.top;
            const endX = toRect.left - containerRect.left;
            const endY = toRect.top + toRect.height/2 - containerRect.top;

            // Bezier Curve Calculation
            const deltaX = endX - startX;
            // More dramatic curves for smoother flow
            const curvature = deltaX > 0 ? 0.6 : 1.5; 
            
            const cp1x = startX + Math.abs(deltaX) * curvature;
            const cp1y = startY;
            const cp2x = endX - Math.abs(deltaX) * curvature;
            const cp2y = endY;

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            
            // Generate path string
            const d = \`M \${startX} \${startY} C \${cp1x} \${cp1y}, \${cp2x} \${cp2y}, \${endX} \${endY}\`;
            
            path.setAttribute("d", d);
            
            // Set attributes
            const typeClass = conn.type === 'dashed' ? 'path-dashed' : (conn.type === 'dotted' ? 'path-dotted' : 'path-solid');
            path.setAttribute("class", \`neon-path \${typeClass} path-from-\${conn.from} path-to-\${conn.to}\`);
            
            // Dynamic color assignment
            const strokeColor = getComputedStyle(document.documentElement).getPropertyValue(\`--flow-\${conn.colorType || 'primary'}\`).trim();
            path.style.stroke = strokeColor;
            
            // Store connection data
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
                 const title = node.querySelector('h3') ? node.querySelector('h3').innerText : 'Details';
                 document.getElementById('modal-title').innerText = title;
                 document.getElementById('modal-body').innerHTML = node.getAttribute('data-info') || "No details available.";
                 modal.classList.add('active');
             });
             
             node.addEventListener('mouseenter', () => {
                 const nodeId = node.id;
                 const connectedPaths = document.querySelectorAll(\`.path-from-\${nodeId}, .path-to-\${nodeId}\`);
                 connectedPaths.forEach(p => {
                     p.classList.add('active');
                 });
             });
             
             node.addEventListener('mouseleave', () => {
                 const nodeId = node.id;
                 const connectedPaths = document.querySelectorAll(\`.path-from-\${nodeId}, .path-to-\${nodeId}\`);
                 connectedPaths.forEach(p => p.classList.remove('active'));
             });
         });
         document.querySelector('.modal-close').addEventListener('click', () => modal.classList.remove('active'));
         // Close modal on background click
         window.addEventListener('click', (e) => {
            if(e.target === modal) modal.classList.remove('active');
         });
     }
  }

  if(document.querySelector('.neon-layout')) {
      // Delay initial draw to ensure layout is settled
      setTimeout(() => { drawNeonConnections(); setupNeonInteractions(); }, 500);
      // Redraw on window resize
      window.addEventListener('resize', () => {
          requestAnimationFrame(drawNeonConnections);
      });
  }
</script>
`;

export const NEON_CONFIG = {
    label: "Neon Flow",
    css: STYLE_NEON_LOGIC,
    js: NEON_JS_ENGINE,
    container: `<div class="neon-layout"><svg id="neon-svg"></svg></div><div id="neon-info-modal" class="neon-modal"><span class="modal-close">&times;</span><h2 id="modal-title" style="color:var(--accent-cyan); margin-top:0;">Title</h2><div id="modal-body" style="color:var(--text-muted); font-size:0.9rem;"></div></div>`,
    promptInfo: `NEON FLOW: Create a compact 'neon-layout' with 3-4 'neon-col' elements. Ensure components have 'neon-node' class with 'id' and 'data-info'. 
    Keep text concise.
    Define connections in a 'neonConnections' array (JSON) with fields: from, to, type (solid/dashed), colorType (primary/secondary).
    Use 'solid' type for main flows.`
};
