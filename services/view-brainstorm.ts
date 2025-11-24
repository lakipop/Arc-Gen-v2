/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

export const BRAINSTORM_CONFIG = {
    label: "Brainstorm Dashboard",
    css: STYLE_BRAINSTORMING_LOGIC,
    js: BRAINSTORM_JS_ENGINE,
    container: `<div class="dashboard-grid"></div>`,
    promptInfo: `BRAINSTORM: Create dashboard-grid with 4 dash-col. Use dash-card, group-staging, group-warehouse.`
};