import React from 'react';
import { Save, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { BmadData } from '../../types/bmad.types';
import AssistedTextarea from '../assisted-textarea';

/**
 * Props expected by the FlowWizardStep component.
 */
export interface FlowWizardStepProps {
  /** Renders the current tab phase in the BMAD framework. */
  activeBmadTab: 'brief' | 'mapping' | 'architecture' | 'delivery';
  /** Callback to update the active tab selection. */
  setActiveBmadTab: (tab: 'brief' | 'mapping' | 'architecture' | 'delivery') => void;
  /** The complete BMAD framework steps data. */
  bmadData: BmadData;
  /** Callback to update the BMAD steps data object. */
  setBmadData: React.Dispatch<React.SetStateAction<BmadData>>;
  /** Dictionary tracking which fields are waiting for AI generation. */
  assistingFields: Record<string, boolean>;
  /** Callback to trigger the AI assist generation for a target field. */
  handleFieldAiAssist: (phase: string, field: string, currentVal?: string) => void;
  /** Callback returning category-specific placeholder question templates. */
  getGuidedPlaceholder: (phase: string, field: string) => string;
  /** Handler to trigger a project draft JSON configuration save. */
  handleSaveDraft: () => void;
  /** Callback to navigate between steps. */
  setCurrentStep: (step: number) => void;
}

/**
 * Step 3: Tabbed layout featuring 12 guided text editors for the
 * Business, Mapping, Architecture, and Delivery sections of the project.
 */
export const FlowWizardStep: React.FC<FlowWizardStepProps> = ({
  activeBmadTab,
  setActiveBmadTab,
  bmadData,
  setBmadData,
  assistingFields,
  handleFieldAiAssist,
  getGuidedPlaceholder,
  handleSaveDraft,
  setCurrentStep
}) => {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Wizard Tabs Navigation */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-glass)',
        marginBottom: '20px',
        background: 'rgba(255, 255, 255, 0.01)',
        padding: '0 8px'
      }}>
        {[
          { id: 'brief', name: `01. ${t('steps.brief.title') || 'Brief'}` },
          { id: 'mapping', name: `02. ${t('steps.mapping.title') || 'Mapping'}` },
          { id: 'architecture', name: `03. ${t('steps.architecture.title') || 'Architecture'}` },
          { id: 'delivery', name: `04. ${t('steps.delivery.title') || 'Delivery'}` }
        ].map(tInfo => (
          <button
            key={tInfo.id}
            onClick={() => setActiveBmadTab(tInfo.id as any)}
            className={`bmad-tab-button ${activeBmadTab === tInfo.id ? 'active' : ''}`}
          >
            {tInfo.name}
          </button>
        ))}
      </div>

      {/* Active Tab Fields */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }} className="custom-scrollbar">
        
        {/* Guided fields */}
        {activeBmadTab === 'brief' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <AssistedTextarea
              label={t('bmad2.step3.objective') || 'Objectif principal'}
              value={bmadData.brief.objective || ''}
              placeholder={getGuidedPlaceholder('brief', 'objective')}
              isAssisting={!!assistingFields.objective}
              onAssist={() => handleFieldAiAssist('brief', 'objective', bmadData.brief.objective)}
              onChange={(val) => setBmadData({ ...bmadData, brief: { ...bmadData.brief, objective: val } })}
            />

            <AssistedTextarea
              label={t('bmad2.step3.problem') || 'Problème à résoudre'}
              value={bmadData.brief.problem || ''}
              placeholder={getGuidedPlaceholder('brief', 'problem')}
              isAssisting={!!assistingFields.problem}
              onAssist={() => handleFieldAiAssist('brief', 'problem', bmadData.brief.problem)}
              onChange={(val) => setBmadData({ ...bmadData, brief: { ...bmadData.brief, problem: val } })}
            />

            <AssistedTextarea
              label={t('bmad2.step3.scope') || 'Périmètre initial (MVP)'}
              value={bmadData.brief.scope || ''}
              placeholder={getGuidedPlaceholder('brief', 'scope')}
              isAssisting={!!assistingFields.scope}
              onAssist={() => handleFieldAiAssist('brief', 'scope', bmadData.brief.scope)}
              onChange={(val) => setBmadData({ ...bmadData, brief: { ...bmadData.brief, scope: val } })}
            />
          </div>
        )}

        {/* Mapping tab */}
        {activeBmadTab === 'mapping' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <AssistedTextarea
              label={t('bmad2.step3.actors') || 'Acteurs clés & Services tiers'}
              value={bmadData.mapping.actors || ''}
              placeholder={getGuidedPlaceholder('mapping', 'actors')}
              isAssisting={!!assistingFields.actors}
              onAssist={() => handleFieldAiAssist('mapping', 'actors', bmadData.mapping.actors)}
              onChange={(val) => setBmadData({ ...bmadData, mapping: { ...bmadData.mapping, actors: val } })}
            />

            <AssistedTextarea
              label={t('bmad2.step3.resources') || 'Ressources disponibles & Allocation'}
              value={bmadData.mapping.resources || ''}
              placeholder={getGuidedPlaceholder('mapping', 'resources')}
              isAssisting={!!assistingFields.resources}
              onAssist={() => handleFieldAiAssist('mapping', 'resources', bmadData.mapping.resources)}
              onChange={(val) => setBmadData({ ...bmadData, mapping: { ...bmadData.mapping, resources: val } })}
            />

            <AssistedTextarea
              label={t('bmad2.step3.risks') || 'Risques & Dépendances critiques'}
              value={bmadData.mapping.risks || ''}
              placeholder={getGuidedPlaceholder('mapping', 'risks')}
              isAssisting={!!assistingFields.risks}
              onAssist={() => handleFieldAiAssist('mapping', 'risks', bmadData.mapping.risks)}
              onChange={(val) => setBmadData({ ...bmadData, mapping: { ...bmadData.mapping, risks: val } })}
            />
          </div>
        )}

        {/* Architecture tab */}
        {activeBmadTab === 'architecture' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <AssistedTextarea
              label={t('bmad2.step3.structure') || 'Structure Globale'}
              value={bmadData.architecture.structure || ''}
              placeholder={getGuidedPlaceholder('architecture', 'structure')}
              isAssisting={!!assistingFields.structure}
              onAssist={() => handleFieldAiAssist('architecture', 'structure', bmadData.architecture.structure)}
              onChange={(val) => setBmadData({ ...bmadData, architecture: { ...bmadData.architecture, structure: val } })}
            />

            <AssistedTextarea
              label={t('bmad2.step3.techStack') || 'Stack Technique'}
              value={bmadData.architecture.techStack || ''}
              placeholder={getGuidedPlaceholder('architecture', 'techStack')}
              isAssisting={!!assistingFields.techStack}
              onAssist={() => handleFieldAiAssist('architecture', 'techStack', bmadData.architecture.techStack)}
              onChange={(val) => setBmadData({ ...bmadData, architecture: { ...bmadData.architecture, techStack: val } })}
            />

            <AssistedTextarea
              label={t('bmad2.step3.tradeoffs') || 'Arbitrages & Compromis'}
              value={bmadData.architecture.tradeoffs || ''}
              placeholder={getGuidedPlaceholder('architecture', 'tradeoffs')}
              isAssisting={!!assistingFields.tradeoffs}
              onAssist={() => handleFieldAiAssist('architecture', 'tradeoffs', bmadData.architecture.tradeoffs)}
              onChange={(val) => setBmadData({ ...bmadData, architecture: { ...bmadData.architecture, tradeoffs: val } })}
            />
          </div>
        )}

        {/* Delivery tab */}
        {activeBmadTab === 'delivery' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <AssistedTextarea
              label={t('bmad2.step3.milestones') || 'Jalons & Planning'}
              value={bmadData.delivery.milestones || ''}
              placeholder={getGuidedPlaceholder('delivery', 'milestones')}
              isAssisting={!!assistingFields.milestones}
              onAssist={() => handleFieldAiAssist('delivery', 'milestones', bmadData.delivery.milestones)}
              onChange={(val) => setBmadData({ ...bmadData, delivery: { ...bmadData.delivery, milestones: val } })}
            />

            <AssistedTextarea
              label={t('bmad2.step3.validation') || 'Critères de validation (Definition of Done)'}
              value={bmadData.delivery.validation || ''}
              placeholder={getGuidedPlaceholder('delivery', 'validation')}
              isAssisting={!!assistingFields.validation}
              onAssist={() => handleFieldAiAssist('delivery', 'validation', bmadData.delivery.validation)}
              onChange={(val) => setBmadData({ ...bmadData, delivery: { ...bmadData.delivery, validation: val } })}
            />

            <AssistedTextarea
              label={t('bmad2.step3.kpis') || 'Indicateurs de succès (KPIs)'}
              value={bmadData.delivery.kpis || ''}
              placeholder={getGuidedPlaceholder('delivery', 'kpis')}
              isAssisting={!!assistingFields.kpis}
              onAssist={() => handleFieldAiAssist('delivery', 'kpis', bmadData.delivery.kpis)}
              onChange={(val) => setBmadData({ ...bmadData, delivery: { ...bmadData.delivery, kpis: val } })}
            />
          </div>
        )}

        {/* Free Notes */}
        <div style={{ marginTop: '10px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            {t('bmad2.step3.notes', { step: activeBmadTab.toUpperCase() })}
          </label>
          <textarea
            className="tech-input"
            rows={3}
            placeholder={t('bmad2.step3.notesPlaceholder')}
            value={(bmadData[activeBmadTab] as any).notes || ''}
            onChange={(e) => setBmadData({
              ...bmadData,
              [activeBmadTab]: {
                ...(bmadData[activeBmadTab] as any),
                notes: e.target.value
              }
            })}
          />
        </div>

        {/* Save Draft & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px' }}>
          <button 
            onClick={handleSaveDraft}
            className="tech-button"
          >
            <Save className="w-4 h-4 text-emerald-500" /> {t('bmad2.actions.saveDraft')}
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setCurrentStep(2)} className="tech-button">{t('bmad2.actions.back')}</button>
            <button onClick={() => setCurrentStep(4)} className="tech-button primary">
              {t('bmad2.actions.continueToStep4') || 'Continuer vers Étape 4'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FlowWizardStep;
