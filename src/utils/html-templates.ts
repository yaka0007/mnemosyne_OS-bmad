import { BmadData } from '../types/bmad.types';

/**
 * System prompt instructing the LLM to design an interactive HTML slides presentation.
 */
export const SLIDES_SYSTEM_PROMPT = `You are an elite presenter and a seasoned frontend web developer. You design self-contained interactive slide presentations as a single complete HTML page (CSS and JavaScript included). Reply ONLY with the raw HTML code wrapped in a \`\`\`html block. No commentary.`;

/**
 * Builds the visual prompt instructing the LLM to output the complete HTML slides file.
 *
 * @param projectName - The active name of the project.
 * @param description - Project description text.
 * @param projectCategory - Active project category keyword.
 * @param bmadData - The complete BMAD framework steps data.
 * @param language - Human language for every visible string in the deck.
 * @returns The formatted prompt text.
 */
export const getHtmlSlidesPrompt = (
  projectName: string,
  description: string,
  projectCategory: string,
  bmadData: BmadData,
  language: string = 'English'
): string => {
  return `[OUTPUT LANGUAGE] Write ALL visible text in ${language} — slide titles, body text, bullet points, and the navigation button labels (translate "Previous"/"Next"/"Slide" into ${language}).

Create an interactive slide presentation (HTML/CSS/JS) describing the foundations and scoping of the following BMAD project:
Project name: ${projectName}
Description: ${description}
Category: ${projectCategory}

[BMAD DETAILS]
- Objective: ${bmadData.brief.objective || ''}
- Problem: ${bmadData.brief.problem || ''}
- Scope: ${bmadData.brief.scope || ''}
- Actors: ${bmadData.mapping.actors || ''}
- Resources: ${bmadData.mapping.resources || ''}
- Risks: ${bmadData.mapping.risks || ''}
- Structure: ${bmadData.architecture.structure || ''}
- Tech stack: ${bmadData.architecture.techStack || ''}
- Trade-offs: ${bmadData.architecture.tradeoffs || ''}
- Milestones: ${bmadData.delivery.milestones || ''}
- Validation: ${bmadData.delivery.validation || ''}
- KPIs: ${bmadData.delivery.kpis || ''}

[DESIGN AND SLIDE STRUCTURE RULES]
1. The presentation must contain exactly 6 slides structured as follows:
   - Slide 1: Title, Description, Project category
   - Slide 2: Problem & Main objective
   - Slide 3: Mapping (key Actors and Resources)
   - Slide 4: Architecture choices (global Structure and Tech stack)
   - Slide 5: Delivery (Milestones and Validation criteria)
   - Slide 6: Success indicators (KPIs)

2. **Mandatory structure and script (skeleton to follow scrupulously)**:
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="utf-8">
     <title>BMAD Presentation - ${projectName}</title>
     <style>
       body {
         background: radial-gradient(circle at center, #16122c 0%, #0c0a18 100%);
         color: #e2e8f0;
         font-family: system-ui, -apple-system, sans-serif;
         margin: 0;
         padding: 0;
         display: flex;
         flex-direction: column;
         height: 100vh;
         justify-content: center;
         align-items: center;
         overflow: hidden;
       }
       .slides-wrapper {
         width: 100%;
         height: calc(100vh - 100px);
         display: flex;
         justify-content: center;
         align-items: center;
         position: relative;
       }
       .slide {
         display: none !important;
         width: 90%;
         max-width: 800px;
         height: 80%;
         padding: 40px;
         box-sizing: border-box;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         background: rgba(255, 255, 255, 0.02);
         border: 1px solid rgba(255, 255, 255, 0.06);
         border-radius: 16px;
         backdrop-filter: blur(16px);
         box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05);
         text-align: center;
         overflow-y: auto;
       }
       .slide.active {
         display: flex !important;
         animation: fadeIn 0.4s ease-in-out;
       }
       @keyframes fadeIn {
         from { opacity: 0; transform: translateY(10px); }
         to { opacity: 1; transform: translateY(0); }
       }
       .controls {
         display: flex;
         align-items: center;
         gap: 16px;
         height: 60px;
         margin-bottom: 20px;
         z-index: 100;
       }
       .btn {
         padding: 8px 24px;
         background: rgba(139, 92, 246, 0.1);
         border: 1px solid rgba(139, 92, 246, 0.3);
         color: #c084fc;
         border-radius: 8px;
         cursor: pointer;
         font-weight: bold;
         font-size: 14px;
         text-shadow: 0 0 5px rgba(139, 92, 246, 0.4);
         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
         transition: all 0.25s ease;
       }
       .btn:hover {
         background: rgba(139, 92, 246, 0.25);
         border-color: rgba(139, 92, 246, 0.6);
         box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
         transform: translateY(-1px);
       }
       h1 { font-size: 2.2rem; color: #ffffff; margin-bottom: 1rem; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
       h2 { font-size: 1.5rem; color: #a78bfa; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
       p, li { font-size: 1.1rem; line-height: 1.6; color: #cbd5e1; }
       ul { text-align: left; display: inline-block; margin: 0 auto; padding-left: 20px; }
       li { margin-bottom: 8px; }
       strong { color: #f3e8ff; }
     </style>
   </head>
   <body>
     <div class="slides-wrapper">
       <section class="slide active">
          <!-- Slide 1 content -->
       </section>
       <section class="slide">
          <!-- Slide 2 content -->
       </section>
       <!-- ... Slides 3, 4, 5, 6 ... -->
     </div>

     <div class="controls">
       <button class="btn" id="prev-btn">← Previous</button>
       <span id="slide-num" style="font-weight: bold; font-family: monospace;">Slide 1 / 6</span>
       <button class="btn" id="next-btn">Next →</button>
     </div>

     <script>
       // Navigation logic — attach listeners programmatically (mandatory)
       let currentIdx = 0;
       const slides = document.querySelectorAll('.slide');
       const slideNum = document.getElementById('slide-num');
       
       function showSlide(idx) {
         slides.forEach((s, i) => {
           s.classList.toggle('active', i === idx);
         });
         slideNum.textContent = 'Slide ' + (idx + 1) + ' / ' + slides.length;
         currentIdx = idx;
       }
       
       function prevSlide() {
         let idx = currentIdx - 1;
         if (idx < 0) idx = slides.length - 1;
         showSlide(idx);
       }
       
       function nextSlide() {
         let idx = currentIdx + 1;
         if (idx >= slides.length) idx = 0;
         showSlide(idx);
       }

       document.getElementById('prev-btn').addEventListener('click', prevSlide);
       document.getElementById('next-btn').addEventListener('click', nextSlide);

       // Show the first slide
       showSlide(0);

       document.addEventListener('keydown', (e) => {
         if (e.key === 'ArrowLeft') prevSlide();
         if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
       });
     </script>
   </body>
   </html>

3. Fill the slide contents cleanly with condensed, punchy text drawn from the BMAD details above.`;
};
