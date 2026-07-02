import React from 'react';
import { Palette, FileText } from 'lucide-react';

/**
 * Props for the ModalPreview component.
 */
export interface ModalPreviewProps {
  /** The current active modal type or null if hidden. */
  activeModal: 'diagram' | 'slides' | null;
  /** The generated SVG content string. */
  generatedSvg: string;
  /** The generated HTML slides content string. */
  generatedHtml: string;
  /** Callback function to close the modal. */
  onClose: () => void;
}

/**
 * Fullscreen glassmorphic modal overlay offering high-fidelity preview
 * of the generated SVG architecture diagram or HTML presentation.
 */
export const ModalPreview: React.FC<ModalPreviewProps> = ({
  activeModal,
  generatedSvg,
  generatedHtml,
  onClose
}) => {
  if (!activeModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(5, 5, 8, 0.9)',
      backdropFilter: 'blur(20px)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div className="glass-card" style={{
        width: '92vw',
        height: '88vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        position: 'relative',
        background: 'rgba(20, 20, 25, 0.85)',
        border: '1px solid var(--border-glass)',
        borderRadius: '16px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {activeModal === 'diagram' ? (
              <>
                <Palette className="w-5 h-5 text-accent" />
                <span>📐 Diagramme d'Architecture Agrandi</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 text-accent" />
                <span>📊 Diaporama de Présentation Agrandi</span>
              </>
            )}
          </h3>
          <button
            onClick={onClose}
            className="tech-button primary"
            style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '12px' }}
          >
            Fermer
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, width: '100%', height: '100%', overflow: 'auto', background: '#0a0a0f', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {activeModal === 'diagram' ? (
            <div 
              style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', overflow: 'auto' }}
              dangerouslySetInnerHTML={{ __html: generatedSvg }}
            />
          ) : (
            <iframe 
              srcDoc={generatedHtml}
              title="Presentation Fullscreen Preview"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '8px',
                background: '#111',
                colorScheme: 'dark'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalPreview;
