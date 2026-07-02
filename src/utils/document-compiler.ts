import { BmadData } from '../types/bmad.types';

/**
 * Renders the 4 markdown documents structured for BMAD.
 *
 * @param projectName - The active name of the project.
 * @param projectVersion - The active version of the project.
 * @param bmadData - The complete BMAD framework steps data.
 * @param hashtags - The array of custom project tags.
 * @param timestamp - The formatted current date string.
 * @param t - The translation function reference.
 * @returns An array of document configurations containing filename, title and markdown content.
 */
export const compileMarkdownDocuments = (
  projectName: string,
  projectVersion: string,
  bmadData: BmadData,
  hashtags: string[],
  timestamp: string,
  t: (key: string, options?: any) => string
): Array<{ filename: string; title: string; content: string }> => {
  const tagLine = hashtags.map(t => `#${t}`).join(' ') || '#bmad';

  return [
    {
      filename: '01_Brief.md',
      title: t('steps.brief.title') || 'Brief',
      content: `
# ${t('steps.brief.title') || 'Brief'} : ${projectName}
*${t('doc.version') || 'Version'} : ${projectVersion}*
*${t('doc.generatedAt') || 'Généré le'} : ${timestamp}*
*${t('doc.tags') || 'Tags'} : ${tagLine}*

---

## 🎯 ${t('bmad2.step3.objective') || 'Objectif principal'}
${bmadData.brief.objective || `*(${t('doc.toComplete') || 'À compléter'})*`}

## ⚠️ ${t('bmad2.step3.problem') || 'Problème à résoudre'}
${bmadData.brief.problem || `*(${t('doc.toComplete') || 'À compléter'})*`}

## 🧭 ${t('bmad2.step3.scope') || 'Périmètre initial (MVP)'}
${bmadData.brief.scope || `*(${t('doc.toComplete') || 'À compléter'})*`}

## 📝 ${t('doc.notes') || 'Notes & Contexte'}
${bmadData.brief.notes || `*(${t('doc.empty') || 'Vide'})*`}
      `.trim()
    },
    {
      filename: '02_Mapping.md',
      title: t('steps.mapping.title') || 'Mapping',
      content: `
# ${t('steps.mapping.title') || 'Mapping'} : ${projectName}
*${t('doc.version') || 'Version'} : ${projectVersion}*
*${t('doc.generatedAt') || 'Généré le'} : ${timestamp}*
*${t('doc.tags') || 'Tags'} : ${tagLine}*

---

## 👥 ${t('bmad2.step3.actors') || 'Acteurs clés & Services tiers'}
${bmadData.mapping.actors || `*(${t('doc.toComplete') || 'À compléter'})*`}

## ⚙️ ${t('bmad2.step3.resources') || 'Ressources disponibles & Allocation'}
${bmadData.mapping.resources || `*(${t('doc.toComplete') || 'À compléter'})*`}

## 💣 ${t('bmad2.step3.risks') || 'Risques & Dépendances critiques'}
${bmadData.mapping.risks || `*(${t('doc.toComplete') || 'À compléter'})*`}

## 📝 ${t('doc.notes') || 'Notes de Mapping'}
${bmadData.mapping.notes || `*(${t('doc.empty') || 'Vide'})*`}
      `.trim()
    },
    {
      filename: '03_Architecture.md',
      title: t('steps.architecture.title') || 'Architecture',
      content: `
# ${t('steps.architecture.title') || 'Architecture'} : ${projectName}
*${t('doc.version') || 'Version'} : ${projectVersion}*
*${t('doc.generatedAt') || 'Généré le'} : ${timestamp}*
*${t('doc.tags') || 'Tags'} : ${tagLine}*

---

## 🏗️ ${t('bmad2.step3.structure') || 'Structure Globale'}
${bmadData.architecture.structure || `*(${t('doc.toComplete') || 'À compléter'})*`}

## 💻 ${t('bmad2.step3.techStack') || 'Stack Technique'}
${bmadData.architecture.techStack || `*(${t('doc.toComplete') || 'À compléter'})*`}

## ⚖️ ${t('bmad2.step3.tradeoffs') || 'Arbitrages & Compromis'}
${bmadData.architecture.tradeoffs || `*(${t('doc.toComplete') || 'À compléter'})*`}

## 📝 ${t('doc.notes') || 'Notes d\'Architecture'}
${bmadData.architecture.notes || `*(${t('doc.empty') || 'Vide'})*`}
      `.trim()
    },
    {
      filename: '04_Delivery.md',
      title: t('steps.delivery.title') || 'Delivery',
      content: `
# ${t('steps.delivery.title') || 'Delivery'} : ${projectName}
*${t('doc.version') || 'Version'} : ${projectVersion}*
*${t('doc.generatedAt') || 'Généré le'} : ${timestamp}*
*${t('doc.tags') || 'Tags'} : ${tagLine}*

---

## 📅 ${t('bmad2.step3.milestones') || 'Jalons & Planning'}
${bmadData.delivery.milestones || `*(${t('doc.toComplete') || 'À compléter'})*`}

## ✅ ${t('bmad2.step3.validation') || 'Critères de validation (Definition of Done)'}
${bmadData.delivery.validation || `*(${t('doc.toComplete') || 'À compléter'})*`}

## 📈 ${t('bmad2.step3.kpis') || 'Indicateurs de succès (KPIs)'}
${bmadData.delivery.kpis || `*(${t('doc.toComplete') || 'À compléter'})*`}

## 📝 ${t('doc.notes') || 'Notes de Delivery'}
${bmadData.delivery.notes || `*(${t('doc.empty') || 'Vide'})*`}
      `.trim()
    }
  ];
};
