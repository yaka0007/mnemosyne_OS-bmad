import { BmadData } from '../types/bmad.types';

/**
 * System prompt instructing the LLM to design an interactive HTML slides presentation.
 */
export const SLIDES_SYSTEM_PROMPT = `Tu es un présentateur d'élite et un développeur web frontend chevronné. Tu conçois des présentations interactives autonomes sous forme d'une page HTML complète (CSS et Javascript inclus). Réponds UNIQUEMENT par le code HTML brut enveloppé dans un bloc \`\`\`html. Pas de blabla.`;

/**
 * Builds the visual prompt instructing the LLM to output the complete HTML slides file.
 *
 * @param projectName - The active name of the project.
 * @param description - Project description text.
 * @param projectCategory - Active project category keyword.
 * @param bmadData - The complete BMAD framework steps data.
 * @returns The formatted prompt text.
 */
export const getHtmlSlidesPrompt = (
  projectName: string,
  description: string,
  projectCategory: string,
  bmadData: BmadData
): string => {
  return `Crée une présentation de diapositives interactive (HTML/CSS/JS) décrivant les fondations et le cadrage du projet BMAD suivant :
Nom du projet: ${projectName}
Description: ${description}
Catégorie: ${projectCategory}

[BMAD DETAILS]
- Objectif: ${bmadData.brief.objective || ''}
- Problème: ${bmadData.brief.problem || ''}
- Périmètre: ${bmadData.brief.scope || ''}
- Acteurs: ${bmadData.mapping.actors || ''}
- Ressources: ${bmadData.mapping.resources || ''}
- Risques: ${bmadData.mapping.risks || ''}
- Structure: ${bmadData.architecture.structure || ''}
- Stack Technique: ${bmadData.architecture.techStack || ''}
- Arbitrages: ${bmadData.architecture.tradeoffs || ''}
- Jalons: ${bmadData.delivery.milestones || ''}
- Validation: ${bmadData.delivery.validation || ''}
- KPIs: ${bmadData.delivery.kpis || ''}

[CONSIGNES DE DESIGN ET STRUCTURE SLIDES]
1. La présentation doit comporter exactement 6 diapositives structurées ainsi :
   - Diapo 1: Titre, Description, Catégorie du projet
   - Diapo 2: Problème & Objectif Principal
   - Diapo 3: Mapping (Acteurs et Ressources clés)
   - Diapo 4: Choix d'Architecture (Structure globale et Stack technique)
   - Diapo 5: Delivery (Jalons et Critères de validation)
   - Diapo 6: Indicateurs de succès (KPIs)

2. **Structure et Script Obligatoires (Squelette à respecter scrupuleusement)** :
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="utf-8">
     <title>Présentation BMAD - ${projectName}</title>
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
          <!-- Contenu Diapo 1 -->
       </section>
       <section class="slide">
          <!-- Contenu Diapo 2 -->
       </section>
       <!-- ... Diapo 3, 4, 5, 6 ... -->
     </div>
     
     <div class="controls">
       <button class="btn" id="prev-btn">← Précédent</button>
       <span id="slide-num" style="font-weight: bold; font-family: monospace;">Slide 1 / 6</span>
       <button class="btn" id="next-btn">Suivant →</button>
     </div>

     <script>
       // Logique de navigation - Attachement des écouteurs programmatiques (impératif)
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

       // Afficher la première diapo
       showSlide(0);

       document.addEventListener('keydown', (e) => {
         if (e.key === 'ArrowLeft') prevSlide();
         if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
       });
     </script>
   </body>
   </html>

3. Remplis proprement les contenus avec des textes condensés et percutants reprenant les détails BMAD ci-dessus.`;
};
