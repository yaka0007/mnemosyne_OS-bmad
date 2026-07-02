import { BmadData } from '../types/bmad.types';

/** Locale-aware column headers and empty-list fallbacks (default = English). */
export interface SvgDiagramLabels {
  actorsFallback: string;
  structureFallback: string;
  techStackFallback: string;
  milestonesFallback: string;
  colActors: string;
  colStructure: string;
  colTechStack: string;
  colMilestones: string;
}

const DEFAULT_LABELS: SvgDiagramLabels = {
  actorsFallback: 'Users & Systems',
  structureFallback: 'Structure & Core',
  techStackFallback: 'Tech Stack',
  milestonesFallback: 'Key Milestones',
  colActors: 'Actors & Inputs',
  colStructure: 'Key Components',
  colTechStack: 'Technologies & Stack',
  colMilestones: 'Milestones & Metrics',
};

/**
 * Generates a deterministic high-fidelity SVG architecture diagram based on project configuration.
 *
 * @param projectName - The active name of the project.
 * @param bmadData - The detailed BMAD steps object containing actors, stack, kpis, etc.
 * @param labels - Locale-aware column headers/fallbacks; defaults to English if omitted.
 * @returns A string representing the formatted inline SVG code.
 */
export const generateSvgFromData = (
  projectName: string,
  bmadData: BmadData,
  labels: SvgDiagramLabels = DEFAULT_LABELS,
): string => {
  const escapeXml = (str: string) => {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const cleanList = (text: string): string[] => {
    if (!text) return [];
    return text
      .split(/[,\n]/)
      .map(item => item.trim())
      .filter(item => item.length > 0 && !item.toLowerCase().startsWith('ex:'));
  };

  /**
   * Splits a string into two lines to fit card boundaries cleanly.
   */
  const splitText = (text: string, maxLen: number = 22): { line1: string; line2: string } => {
    if (text.length <= maxLen) {
      return { line1: text, line2: '' };
    }
    
    // Find last space within maxLen
    let splitIdx = text.lastIndexOf(' ', maxLen);
    if (splitIdx === -1 || splitIdx < 6) {
      // If no space, hard split
      splitIdx = maxLen;
    }
    
    const line1 = text.substring(0, splitIdx).trim();
    let line2 = text.substring(splitIdx).trim();
    
    if (line2.length > maxLen) {
      line2 = line2.substring(0, maxLen - 2) + '...';
    }
    
    return { line1, line2 };
  };

  const actors = cleanList(bmadData.mapping.actors || '');
  const structures = cleanList(bmadData.architecture.structure || '');
  const techStack = cleanList(bmadData.architecture.techStack || '');
  const milestones = cleanList(bmadData.delivery.milestones || '');
  const kpis = cleanList(bmadData.delivery.kpis || '');

  if (actors.length === 0) actors.push(labels.actorsFallback);
  if (structures.length === 0) structures.push(labels.structureFallback);
  if (techStack.length === 0) techStack.push(labels.techStackFallback);
  if (milestones.length === 0) milestones.push(labels.milestonesFallback);

  const width = 1000;
  const height = 460;

  // Shifted columns to left to accommodate wider cards within 1000px width limit
  const xCol1 = 130;
  const xCol2 = 380;
  const xCol3 = 630;
  const xCol4 = 880;

  // Increased card width from 175 to 210 to display more text
  const cardWidth = 210;
  const cardHeight = 65;

  const getCardsForCol = (items: string[], x: number, colName: string, iconType: string) => {
    const displayItems = items.slice(0, 3);
    const spacing = 110;
    const startY = (height / 2) - ((displayItems.length - 1) * spacing / 2) + 20;

    return displayItems.map((item, idx) => {
      const y = startY + idx * spacing;
      return {
        text: item,
        x: x - cardWidth / 2,
        y: y - cardHeight / 2,
        cx: x,
        cy: y,
        colName,
        iconType
      };
    });
  };

  const col1Cards = getCardsForCol(actors, xCol1, labels.colActors, "user");
  const col2Cards = getCardsForCol(structures, xCol2, labels.colStructure, "cpu");
  const col3Cards = getCardsForCol(techStack, xCol3, labels.colTechStack, "code");
  const col4Items = milestones.concat(kpis);
  const col4Cards = getCardsForCol(col4Items, xCol4, labels.colMilestones, "target");

  const allColumns = [col1Cards, col2Cards, col3Cards, col4Cards];

  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    <!-- Background grid pattern -->
    <pattern id="dot-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#2e2e36" opacity="0.4" />
    </pattern>
    <!-- Card glow effect -->
    <filter id="card-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.5" />
      <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="var(--accent)" flood-opacity="0.15" />
    </filter>
    <!-- Gradients -->
    <linearGradient id="header-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2563eb" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.9" />
    </linearGradient>
    <linearGradient id="col1-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#312e81" />
    </linearGradient>
    <linearGradient id="col2-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="col3-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#581c87" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#3b0764" stop-opacity="0.5" />
    </linearGradient>
    <linearGradient id="col4-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#064e3b" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#022c22" stop-opacity="0.6" />
    </linearGradient>
    <!-- Arrow Marker -->
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4b5563" />
    </marker>
    <marker id="arrow-accent" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#60a5fa" />
    </marker>
  </defs>

  <!-- Background base -->
  <rect width="100%" height="100%" fill="#141416" rx="16" />
  <!-- Grid overlay -->
  <rect width="100%" height="100%" fill="url(#dot-grid)" rx="16" />

  <!-- Frame Title Bar -->
  <rect x="0" y="0" width="${width}" height="55" fill="url(#header-grad)" rx="16" clip-path="polygon(0 0, 100% 0, 100% 55, 0 55)" />
  <!-- Frame details -->
  <circle cx="25" cy="27" r="6" fill="#ef4444" />
  <circle cx="45" cy="27" r="6" fill="#f59e0b" />
  <circle cx="65" cy="27" r="6" fill="#10b981" />
  <text x="100" y="32" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14.5px" font-weight="700" letter-spacing="0.05em">${escapeXml(projectName).toUpperCase()} — ARCHITECTURE FLOW</text>
  <text x="${width - 150}" y="32" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="11px" font-weight="600" opacity="0.8">BMAD DIAGRAM 2.0</text>

  <!-- Column Labels -->
  <text x="${xCol1}" y="90" fill="#93c5fd" font-family="system-ui, sans-serif" font-size="12px" font-weight="700" text-anchor="middle" letter-spacing="0.05em">${col1Cards[0]?.colName.toUpperCase()}</text>
  <text x="${xCol2}" y="90" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="12px" font-weight="700" text-anchor="middle" letter-spacing="0.05em">${col2Cards[0]?.colName.toUpperCase()}</text>
  <text x="${xCol3}" y="90" fill="#c084fc" font-family="system-ui, sans-serif" font-size="12px" font-weight="700" text-anchor="middle" letter-spacing="0.05em">${col3Cards[0]?.colName.toUpperCase()}</text>
  <text x="${xCol4}" y="90" fill="#34d399" font-family="system-ui, sans-serif" font-size="12px" font-weight="700" text-anchor="middle" letter-spacing="0.05em">${col4Cards[0]?.colName.toUpperCase()}</text>

  <!-- Flow Connectors -->
`;

  // Draw Bézier connections between columns
  for (let c = 0; c < allColumns.length - 1; c++) {
    const fromCol = allColumns[c]!;
    const toCol = allColumns[c + 1]!;

    fromCol.forEach((fromCard) => {
      toCol.forEach((toCard) => {
        const xStart = fromCard.cx + cardWidth / 2;
        const yStart = fromCard.cy;
        const xEnd = toCard.x - 2;
        const yEnd = toCard.cy;

        const cp1x = xStart + (xEnd - xStart) * 0.45;
        const cp1y = yStart;
        const cp2x = xStart + (xEnd - xStart) * 0.55;
        const cp2y = yEnd;

        const isMainLink = fromCard.text.length % 2 === 0 && toCard.text.length % 3 === 0;
        const strokeColor = isMainLink ? '#3b82f6' : '#2e2e38';
        const opacity = isMainLink ? '0.45' : '0.25';
        const strokeWidth = isMainLink ? '1.8' : '1.2';
        const marker = isMainLink ? 'url(#arrow-accent)' : 'url(#arrow)';

        svgContent += `  <path d="M ${xStart} ${yStart} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${xEnd} ${yEnd}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" opacity="${opacity}" marker-end="${marker}" />\n`;
      });
    });
  }

  // Draw card items with multiline support and hover tooltip
  const renderCard = (card: any, gradId: string, borderColor: string, iconMarkup: string) => {
    const { line1, line2 } = splitText(card.text, 22);
    return `  <!-- Card: ${escapeXml(card.text)} -->
  <g transform="translate(${card.x}, ${card.y})" filter="url(#card-glow)">
    <title>${escapeXml(card.text)}</title>
    <rect width="${cardWidth}" height="${cardHeight}" fill="url(#${gradId})" stroke="${borderColor}" stroke-width="1.2" rx="10" />
    <!-- Icon Container -->
    <g transform="translate(12, 18)">
      <rect width="28" height="28" fill="#1e293b" opacity="0.6" rx="6" />
      ${iconMarkup}
    </g>
    <!-- Text -->
    <text x="50" y="${line2 ? 31 : 38}" fill="#ffffff" font-family="system-ui, sans-serif" font-size="11px" font-weight="600">${escapeXml(line1)}</text>
    ${line2 ? `<text x="50" y="45" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="10.5px" font-weight="500">${escapeXml(line2)}</text>` : ''}
  </g>\n`;
  };

  const iconUser = `<path d="M14 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0z M2 21a8 8 0 0 1 16 0" fill="none" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="scale(0.8) translate(3, 3)" />`;
  const iconCpu = `<rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="#94a3b8" stroke-width="1.5" transform="scale(0.8) translate(3, 3)"/><path d="M9 1v2 M15 1v2 M9 21v2 M15 21v2 M21 9h2 M21 15h2 M1 9h2 M1 15h2" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" transform="scale(0.8) translate(3, 3)"/>`;
  const iconCode = `<path d="m18 16 4-4-4-4 M6 8l-4 4 4 4 M14.5 4l-5 16" fill="none" stroke="#c084fc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="scale(0.8) translate(3, 3)"/>`;
  const iconTarget = `<circle cx="12" cy="12" r="10" fill="none" stroke="#34d399" stroke-width="1.5" transform="scale(0.8) translate(3, 3)"/><circle cx="12" cy="12" r="6" fill="none" stroke="#34d399" stroke-width="1.5" transform="scale(0.8) translate(3, 3)"/><circle cx="12" cy="12" r="2" fill="#34d399" transform="scale(0.8) translate(3, 3)"/>`;

  col1Cards.forEach(card => { svgContent += renderCard(card, 'col1-grad', 'rgba(59, 130, 246, 0.35)', iconUser); });
  col2Cards.forEach(card => { svgContent += renderCard(card, 'col2-grad', 'rgba(148, 163, 184, 0.25)', iconCpu); });
  col3Cards.forEach(card => { svgContent += renderCard(card, 'col3-grad', 'rgba(139, 92, 246, 0.35)', iconCode); });
  col4Cards.forEach(card => { svgContent += renderCard(card, 'col4-grad', 'rgba(16, 185, 129, 0.35)', iconTarget); });

  svgContent += `</svg>`;
  return svgContent;
};
