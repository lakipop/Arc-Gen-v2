/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { getThemeVariables, BASE_INSTRUCTION } from './architecture-generator.config';
import { NEON_CONFIG } from './view-neon';
import { BRAINSTORM_CONFIG } from './view-brainstorm';
import { COMPONENT_CONFIG } from './view-component';
import { MODERN_CONFIG } from './view-modern';

const GEMINI_MODEL = 'gemini-3-pro-preview';
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    'neon': NEON_CONFIG,
    'brainstorming': BRAINSTORM_CONFIG,
    'component': COMPONENT_CONFIG,
    'modern': MODERN_CONFIG
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
  
  // OCR & Image Analysis Logic
  let imageAnalysisInstruction = "";
  if (fileBase64) {
      imageAnalysisInstruction = `
      **IMAGE ANALYSIS & RECONSTRUCTION MODE**:
      1. The user has uploaded an image of a diagram (whiteboard sketch, screenshot, or flowchart).
      2. Perform OCR to extract all text labels.
      3. Analyze the visual topology: relationships, arrows, groupings, and hierarchy.
      4. **GOAL**: Reconstruct this EXACT architecture using the selected HTML/CSS style.
      5. Map the visual elements from the image to the most appropriate components in the requested style (e.g., if "Neon" is selected, map boxes to neon-nodes).
      6. If the text is illegible, infer logical component names based on context.
      `;
  }

  const teamInstruction = `
    **FOOTER TEAM NAME:**
    In the footer-credit section, use: <strong class="team-name">${teamName}</strong>
    The exact HTML should be:
    <div class="footer-credit">
    <span class="status-dot"></span>
    <span>System Architecture by <strong class="team-name">${teamName}</strong></span>
    </div>
    `;

  const systemInstruction = `${BASE_INSTRUCTION}\n${cssVars}\n${styleInstruction}\n${specificInstructions}\n${imageAnalysisInstruction}\n${teamInstruction}\nGenerate based on user input only. No hardcoded tech.`;
  
  // Update base prompt to reflect image intent if file is present
  let finalPrompt = "";
  if (fileBase64) {
      finalPrompt = `Analyze the attached image and generate an architecture diagram based on it. Additional Context: "${prompt}". Styles: ${activeStyles.join(', ')}. Theme: ${theme}. Creator/Team: ${teamName}.`;
  } else {
      finalPrompt = `Generate architecture for: "${prompt}". Styles: ${activeStyles.join(', ')}. Theme: ${theme}. Creator/Team: ${teamName}.`;
  }

  parts.push({ text: finalPrompt });
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