/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
      padding: 15px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      box-shadow: var(--node-shadow);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: fit-content;
  }
  
  .bento-group {
      border: 2px dashed var(--accent-gold);
      padding: 20px;
      border-radius: 10px;
      position: relative;
      margin-top: 10px;
      background: rgba(250, 204, 21, 0.02);
      transition: all 0.3s;
  }
  
  .bento-group:hover {
      background: rgba(250, 204, 21, 0.05);
      border-color: var(--accent-gold);
      box-shadow: 0 0 20px rgba(250, 204, 21, 0.1);
  }
  
  .bento-group-label { 
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
      margin-bottom: 10px;
  }
  
  .bento-icon {
      width: 32px;
      height: 32px;
      background: rgba(34, 211, 238, 0.1);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      color: var(--accent-cyan);
      font-weight: bold;
  }
  
  .bento-card h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-main);
      font-family: 'Inter', sans-serif;
  }
  
  .bento-card p {
      margin: 10px 0 0 0;
      font-size: 0.8rem;
      color: var(--text-muted);
      line-height: 1.5;
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

export const COMPONENT_CONFIG = {
    label: "Component View",
    css: STYLE_COMPONENT_VIEW,
    js: COMPONENT_VIEW_JS_ENGINE,
    container: `<div class="bento-grid"></div>`,
    promptInfo: `COMPONENT VIEW: Create a compact and detailed bento-grid with bento-card. Use various sizes (bento-large/wide/tall) and colors (bento-primary/secondary/tertiary/accent). Each card should have a title, a detailed description, a deep analysis note, and the component must fit the text size. Use bento-group to group related components.`
};