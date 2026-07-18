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
      title: t('steps.brief.title'),
      content: `
# ${t('steps.brief.title')} : ${projectName}
*${t('doc.version')} : ${projectVersion}*
*${t('doc.generatedAt')} : ${timestamp}*
*${t('doc.tags')} : ${tagLine}*

---

## 🎯 ${t('bmad2.step3.objective')}
${bmadData.brief.objective || `*(${t('doc.toComplete')})*`}

## ⚠️ ${t('bmad2.step3.problem')}
${bmadData.brief.problem || `*(${t('doc.toComplete')})*`}

## 🧭 ${t('bmad2.step3.scope')}
${bmadData.brief.scope || `*(${t('doc.toComplete')})*`}

## 📝 ${t('doc.notes')}
${bmadData.brief.notes || `*(${t('doc.empty')})*`}
      `.trim()
    },
    {
      filename: '02_Mapping.md',
      title: t('steps.mapping.title'),
      content: `
# ${t('steps.mapping.title')} : ${projectName}
*${t('doc.version')} : ${projectVersion}*
*${t('doc.generatedAt')} : ${timestamp}*
*${t('doc.tags')} : ${tagLine}*

---

## 👥 ${t('bmad2.step3.actors')}
${bmadData.mapping.actors || `*(${t('doc.toComplete')})*`}

## ⚙️ ${t('bmad2.step3.resources')}
${bmadData.mapping.resources || `*(${t('doc.toComplete')})*`}

## 💣 ${t('bmad2.step3.risks')}
${bmadData.mapping.risks || `*(${t('doc.toComplete')})*`}

## 📝 ${t('doc.notes')}
${bmadData.mapping.notes || `*(${t('doc.empty')})*`}
      `.trim()
    },
    {
      filename: '03_Architecture.md',
      title: t('steps.architecture.title'),
      content: `
# ${t('steps.architecture.title')} : ${projectName}
*${t('doc.version')} : ${projectVersion}*
*${t('doc.generatedAt')} : ${timestamp}*
*${t('doc.tags')} : ${tagLine}*

---

## 🏗️ ${t('bmad2.step3.structure')}
${bmadData.architecture.structure || `*(${t('doc.toComplete')})*`}

## 💻 ${t('bmad2.step3.techStack')}
${bmadData.architecture.techStack || `*(${t('doc.toComplete')})*`}

## ⚖️ ${t('bmad2.step3.tradeoffs')}
${bmadData.architecture.tradeoffs || `*(${t('doc.toComplete')})*`}

## 📝 ${t('doc.notes')}
${bmadData.architecture.notes || `*(${t('doc.empty')})*`}
      `.trim()
    },
    {
      filename: '04_Delivery.md',
      title: t('steps.delivery.title'),
      content: `
# ${t('steps.delivery.title')} : ${projectName}
*${t('doc.version')} : ${projectVersion}*
*${t('doc.generatedAt')} : ${timestamp}*
*${t('doc.tags')} : ${tagLine}*

---

## 📅 ${t('bmad2.step3.milestones')}
${bmadData.delivery.milestones || `*(${t('doc.toComplete')})*`}

## ✅ ${t('bmad2.step3.validation')}
${bmadData.delivery.validation || `*(${t('doc.toComplete')})*`}

## 📈 ${t('bmad2.step3.kpis')}
${bmadData.delivery.kpis || `*(${t('doc.toComplete')})*`}

## 📝 ${t('doc.notes')}
${bmadData.delivery.notes || `*(${t('doc.empty')})*`}
      `.trim()
    }
  ];
};
