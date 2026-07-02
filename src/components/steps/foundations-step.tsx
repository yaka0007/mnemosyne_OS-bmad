import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { CATEGORY_ICONS } from '../../constants/bmad.constants';

/**
 * Props expected by the FoundationsStep component.
 */
export interface FoundationsStepProps {
  /** The name of the project. */
  projectName: string;
  /** Callback to update the project name. */
  setProjectName: (val: string) => void;
  /** The version of the project. */
  projectVersion: string;
  /** Callback to update the project version. */
  setProjectVersion: (val: string) => void;
  /** The project description. */
  description: string;
  /** Callback to update the project description. */
  setDescription: (val: string) => void;
  /** The selected project category. */
  projectCategory: string;
  /** Callback to update the selected project category. */
  setProjectCategory: (val: string) => void;
  /** Array of active tags for the project. */
  hashtags: string[];
  /** Callback to update the list of hashtags. */
  setHashtags: React.Dispatch<React.SetStateAction<string[]>>;
  /** Callback to navigate between steps. */
  setCurrentStep: (step: number) => void;
}

/**
 * Step 1: Form to collect project foundations including title,
 * description, category classification, and hashtags.
 */
export const FoundationsStep: React.FC<FoundationsStepProps> = ({
  projectName,
  setProjectName,
  projectVersion,
  setProjectVersion,
  description,
  setDescription,
  projectCategory,
  setProjectCategory,
  hashtags,
  setHashtags,
  setCurrentStep
}) => {
  const { t } = useTranslation();
  const [tagInput, setTagInput] = useState('');

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/#/g, '');
      if (clean && !hashtags.includes(clean)) {
        setHashtags(prev => [...prev, clean]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setHashtags(prev => prev.filter(t => t !== tag));
  };

  return (
    <div className="glass-card" style={{ maxWidth: '580px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0' }}>{t('bmad2.step1.title')}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', margin: '0 0 20px 0' }}>
        {t('bmad2.step1.subtitle')}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              {t('bmad2.step1.projectName')}
            </label>
            <input
              type="text"
              className="tech-input"
              placeholder={t('bmad2.step1.projectNamePlaceholder')}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              {t('bmad2.step1.projectVersion') || 'Version'}
            </label>
            <input
              type="text"
              className="tech-input"
              placeholder="0.1.0"
              value={projectVersion}
              onChange={(e) => setProjectVersion(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            {t('bmad2.step1.description')}
          </label>
          <textarea
            className="tech-input"
            rows={2}
            placeholder={t('bmad2.step1.descriptionPlaceholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            {t('bmad2.step1.category')}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {Object.keys(CATEGORY_ICONS).map(catKey => {
              const Icon = CATEGORY_ICONS[catKey]!;
              const isActive = projectCategory === catKey;
              return (
                <div 
                  key={catKey}
                  onClick={() => setProjectCategory(catKey)}
                  className={`category-pill ${isActive ? 'active' : ''}`}
                  style={{ padding: '8px', borderRadius: '8px', fontSize: '10px' }}
                >
                  <Icon className="w-4 h-4 text-accent" />
                  <span style={{ fontSize: '10px' }}>{t(`categories.${catKey}`) || catKey}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            {t('bmad2.step1.tags')}
          </label>
          <input
            type="text"
            className="tech-input"
            placeholder={t('bmad2.step1.tagsPlaceholder')}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
            {hashtags.map(tName => (
              <span 
                key={tName}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(37,99,235,0.08)',
                  border: '1px solid rgba(37,99,235,0.2)',
                  color: '#60a5fa',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  fontSize: '11px'
                }}
              >
                #{tName}
                <button 
                  onClick={() => removeTag(tName)}
                  style={{ border: 'none', background: 'transparent', color: '#f87171', cursor: 'pointer', padding: 0 }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
          <button onClick={() => setCurrentStep(0)} className="tech-button">{t('bmad2.actions.cancel')}</button>
          <button 
            onClick={() => setCurrentStep(2)} 
            disabled={!projectName.trim()} 
            className="tech-button primary"
          >
            {t('bmad2.actions.next')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoundationsStep;
