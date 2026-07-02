import React from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslation } from '../i18n';
import BrainLoader from './brain-loader';

/**
 * Props for the AssistedTextarea component.
 */
export interface AssistedTextareaProps {
  /** The localized label text to display above the textarea. */
  label: string;
  /** The current text value inside the editor. */
  value: string;
  /** Localized placeholder helper text. */
  placeholder: string;
  /** Whether the specific field is currently waiting for AI generation. */
  isAssisting: boolean;
  /** Callback function triggered when clicking the Assist AI sparkles button. */
  onAssist: () => void;
  /** Callback triggered when the user types inside the textarea. */
  onChange: (val: string) => void;
}

/**
 * Standard text editor widget enhanced with an AI proactive assistant overlay
 * and loader spinner, styled inside a glassmorphic frame.
 */
export const AssistedTextarea: React.FC<AssistedTextareaProps> = ({
  label,
  value,
  placeholder,
  isAssisting,
  onAssist,
  onChange
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>{label}</label>
        <button 
          type="button"
          onClick={onAssist}
          className={`tech-button ${isAssisting ? 'disabled' : ''}`}
          style={{ padding: '3px 8px', fontSize: '10px' }}
          disabled={isAssisting}
        >
          {isAssisting ? (
            <>
              <BrainLoader size={14} /> {t('bmad2.status.writing') || 'Rédaction...'}
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3" /> {t('bmad2.actions.assist') || 'Assister'}
            </>
          )}
        </button>
      </div>
      <div style={{ position: 'relative' }}>
        <textarea
          className="tech-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isAssisting}
          style={{
            width: '100%',
            minHeight: '100px',
            borderColor: isAssisting ? 'var(--accent)' : undefined,
            boxShadow: isAssisting ? '0 0 12px var(--accent-glow)' : undefined,
            transition: 'all 0.3s ease',
            opacity: isAssisting ? 0.6 : 1,
            pointerEvents: isAssisting ? 'none' : 'auto'
          }}
        />
        {isAssisting && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(7, 7, 10, 0.45)',
            backdropFilter: 'blur(1px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '13px',
            pointerEvents: 'none',
            border: '1px solid var(--border-glass)',
            animation: 'pulse 1.5s infinite ease-in-out'
          }}>
            <BrainLoader size={20} />
            <span style={{ letterSpacing: '0.05em', fontWeight: 500 }}>
              {t('bmad2.status.studyNotVerified') || 'BMAD (En étude - Non vérifié)...'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
export default AssistedTextarea;
