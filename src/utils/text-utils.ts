/**
 * Pre-processes markdown to ensure list markers (*, -, \d+.) and headers are recognized on new lines.
 * It collapses three or more consecutive newlines and injects double newlines before lists/headers if missing.
 *
 * @param content - The raw markdown text content.
 * @returns Preprocessed markdown text.
 */
export const preprocessMarkdown = (content: string): string => {
  if (!content) return '';
  let text = content.replace(/\r\n/g, '\n');
  // Add double newlines before list elements, blockquotes, and headers if they don't already have them.
  text = text.replace(/([^\n])\n\s*([-*+•\d+\.#>])/g, '$1\n\n$2');
  // Collapse three or more newlines
  text = text.replace(/\n{3,}/g, '\n\n');
  return text;
};

/**
 * Robust parser to strip markdown wrappers and extract a clean code block (SVG or HTML).
 * Extracts raw tags case-insensitively, handling unclosed or truncated tags gracefully.
 *
 * @param text - The raw text received from the model inference.
 * @param type - The target format to extract ('xml' representing SVG, or 'html').
 * @returns Cleaned code block string containing the visual code, or trimmed raw text as fallback.
 */
export const cleanCodeBlock = (text: string, type: 'xml' | 'html'): string => {
  if (!text) return '';
  let cleaned = text.trim();
  
  if (type === 'xml') {
    const startIdx = cleaned.toLowerCase().indexOf('<svg');
    if (startIdx !== -1) {
      const endIdx = cleaned.toLowerCase().lastIndexOf('</svg>');
      if (endIdx !== -1) {
        return cleaned.substring(startIdx, endIdx + 6).trim();
      }
      return cleaned.substring(startIdx).trim(); // Truncated/unterminated SVG
    }
  } else if (type === 'html') {
    const docStartIdx = cleaned.toLowerCase().indexOf('<!doctype html>');
    if (docStartIdx !== -1) {
      const htmlEnd = cleaned.toLowerCase().lastIndexOf('</html>');
      if (htmlEnd !== -1) {
        return cleaned.substring(docStartIdx, htmlEnd + 7).trim();
      }
      return cleaned.substring(docStartIdx).trim();
    }
    const htmlStart = cleaned.toLowerCase().indexOf('<html');
    if (htmlStart !== -1) {
      const htmlEnd = cleaned.toLowerCase().lastIndexOf('</html>');
      if (htmlEnd !== -1) {
        return cleaned.substring(htmlStart, htmlEnd + 7).trim();
      }
      return cleaned.substring(htmlStart).trim();
    }
  }
  
  // Default fallback: strip markdown blocks and return
  cleaned = cleaned.replace(/```(?:xml|html|svg|markdown)?/gi, '');
  cleaned = cleaned.replace(/```/g, '');
  return cleaned.trim();
};
