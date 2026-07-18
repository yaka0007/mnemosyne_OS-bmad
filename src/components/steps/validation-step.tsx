import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles,
  Copy,
  Palette,
  FileText,
  Maximize2
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { preprocessMarkdown } from '../../utils/text-utils';
import BrainLoader from '../brain-loader';
import { BmadData } from '../../types/bmad.types';

/**
 * Props expected by the ValidationStep component.
 */
export interface ValidationStepProps {
  /** The active name of the project. */
  projectName: string;
  /** Root directory of the active Mnemosyne vault. */
  vaultRoot: string;
  /** Custom folder path for exports chosen by the user. */
  customExportPath: string;
  /** Callback to update the custom export folder path. */
  setCustomExportPath: (val: string) => void;
  /** Set to the target export path once generation succeeds. */
  completedPath: string;
  /** Callback to reset or update the completed export path. */
  setCompletedPath: (val: string) => void;
  /** Whether document files compilation is currently running. */
  isGenerating: boolean;
  /** Current progress details of document files compiling. */
  generationProgress: { current: number; total: number; message: string } | null;
  /** Whether AI Critical Review analysis is currently running. */
  isReviewLoading: boolean;
  /** Markdown text returned by the AI Reviewer. */
  reviewOutput: string;
  /** Actionable suggestions parsed from the AI Critical Review. */
  suggestions: any[];
  /** Checked suggestion card IDs. */
  selectedSuggestionIds: string[];
  /** Callback to update checked suggestion IDs. */
  setSelectedSuggestionIds: React.Dispatch<React.SetStateAction<string[]>>;
  /** Whether the host system has active cloud keys configured. */
  isCloudAvailable: boolean;
  /** Tracks active generation of SVG diagram or HTML presentation. */
  isGeneratingVisual: 'diagram' | 'slides' | null;
  /** Raw code string of the generated SVG architecture diagram. */
  generatedSvg: string;
  /** Callback to clear or update the SVG diagram state. */
  setGeneratedSvg: (val: string) => void;
  /** Raw HTML code string of the generated slides presentation. */
  generatedHtml: string;
  /** Callback to clear or update the HTML slides state. */
  setGeneratedHtml: (val: string) => void;
  /** Handles toggling visual panels to fullscreen modal overlays. */
  setActiveModal: (val: 'diagram' | 'slides' | null) => void;
  /** Handler triggering the AI Critical Review process. */
  runAiReview: () => void;
  /** Handler applying the checkboxed AI suggestions to the workspace data. */
  applySelectedCorrections: () => void;
  /** Handler launching the final documentation compilation. */
  handleGenerateProject: () => void;
  /** Handler triggering local SVG diagram compiling. */
  generateVisualDiagram: () => void;
  /** Handler triggering interactive HTML presentation slides generation. */
  generateVisualSlides: () => void;
  /** Handler exporting visual files to disk. */
  saveVisualFile: (type: 'diagram' | 'slides') => void;
  /** Handler opening the target export folder in the OS explorer. */
  handleOpenInExplorer: () => void;
  /** Callback to trigger scanning projects inside vault root. */
  scanVaultProjects: (root: string) => void;
  /** Callback to navigate between steps. */
  setCurrentStep: (step: number) => void;
  /** Callback to display toast notifications. */
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  /** Callback to select a folder from the host file system. */
  selectFolder: () => Promise<string | null>;
  /** The current BMAD project configuration data. */
  bmadData: BmadData;
}

/**
 * Step 4: Critique review analysis, actionable suggestions corrections,
 * custom export destination, final documents compiler, and visual outputs previewer.
 */
export const ValidationStep: React.FC<ValidationStepProps> = ({
  projectName,
  vaultRoot,
  customExportPath,
  setCustomExportPath,
  completedPath,
  setCompletedPath,
  isGenerating,
  generationProgress,
  isReviewLoading,
  reviewOutput,
  suggestions,
  selectedSuggestionIds,
  setSelectedSuggestionIds,
  isCloudAvailable,
  isGeneratingVisual,
  generatedSvg,
  setGeneratedSvg,
  generatedHtml,
  setGeneratedHtml,
  setActiveModal,
  runAiReview,
  applySelectedCorrections,
  handleGenerateProject,
  generateVisualDiagram,
  generateVisualSlides,
  saveVisualFile,
  handleOpenInExplorer,
  scanVaultProjects,
  setCurrentStep,
  showToast,
  selectFolder,
  bmadData
}) => {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }} className="custom-scrollbar">
      
      {/* Documents generation panel */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px 0' }}>{t('bmad2.step4.title')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', margin: '0 0 16px 0' }}>
          {t('bmad2.step4.subtitle')}
        </p>

        {/* Reviews AI launcher */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <button 
            onClick={runAiReview}
            disabled={isReviewLoading}
            className="tech-button"
            style={{ background: 'rgba(139, 92, 246, 0.08)', borderColor: 'var(--accent-purple)' }}
          >
            {isReviewLoading ? (
              <>
                <BrainLoader size={16} color="var(--accent-purple)" />
                <span>{t('bmad2.status.criticalReview')}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-accent-purple" />
                <span>{t('bmad2.step4.runReview')}</span>
              </>
            )}
          </button>

          {reviewOutput && (
            <button 
              onClick={() => {
                navigator.clipboard.writeText(reviewOutput);
                showToast(t('bmad2.success.reviewCopied'), 'success');
              }}
              className="tech-button"
            >
              <Copy className="w-3.5 h-3.5" /> {t('bmad2.step4.copyReview')}
            </button>
          )}
        </div>

        {/* Collapsible review panel */}
        {reviewOutput && (
          <div style={{
            maxHeight: '260px',
            overflowY: 'auto',
            border: '1px solid var(--border-glass)',
            borderRadius: '12px',
            padding: '16px',
            background: 'rgba(0,0,0,0.3)',
            marginBottom: '16px'
          }} className="markdown-doc custom-scrollbar">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{preprocessMarkdown(reviewOutput)}</ReactMarkdown>
          </div>
        )}

        {/* Suggestions panel */}
        {suggestions.length > 0 && (
          <div style={{ marginBottom: '16px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{t('bmad2.step4.suggestionsTitle')}</span>
                <span style={{ background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-purple)', padding: '2px 8px', borderRadius: '999px', fontSize: '11px' }}>
                  {selectedSuggestionIds.length} / {suggestions.length}
                </span>
              </h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button 
                  onClick={() => setSelectedSuggestionIds(suggestions.map(s => s.id))}
                  className="tech-button"
                  style={{ fontSize: '10.5px', padding: '4px 10px' }}
                >
                  {t('bmad2.step4.selectAll')}
                </button>
                <button 
                  onClick={() => setSelectedSuggestionIds([])}
                  className="tech-button"
                  style={{ fontSize: '10.5px', padding: '4px 10px' }}
                >
                  {t('bmad2.step4.deselectAll')}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px', marginBottom: '12px' }} className="custom-scrollbar">
              {suggestions.map(sug => {
                const isChecked = selectedSuggestionIds.includes(sug.id);
                return (
                  <div 
                    key={sug.id} 
                    style={{ 
                      padding: '12px', 
                      borderRadius: '10px', 
                      border: isChecked ? '1px solid rgba(139, 92, 246, 0.35)' : '1px solid var(--border-glass)',
                      background: isChecked ? 'rgba(139, 92, 246, 0.04)' : 'rgba(255, 255, 255, 0.01)',
                      display: 'flex', 
                      gap: '10px',
                      alignItems: 'flex-start',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSuggestionIds(prev => [...prev, sug.id]);
                        } else {
                          setSelectedSuggestionIds(prev => prev.filter(id => id !== sug.id));
                        }
                      }}
                      style={{ 
                        marginTop: '3px',
                        cursor: 'pointer',
                        width: '14px',
                        height: '14px',
                        accentColor: 'var(--accent)'
                      }}
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-purple)' }}>
                          {sug.fieldLabel || sug.field}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic', lineHeight: '1.4' }}>
                        <strong>{t('bmad2.step4.critique')} :</strong> {sug.critique}
                      </p>
                      <div style={{ 
                        marginTop: '6px', 
                        padding: '8px 10px', 
                        background: 'rgba(0,0,0,0.3)', 
                        border: '1px solid rgba(255,255,255,0.03)', 
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono, monospace)',
                        color: 'rgba(255,255,255,0.85)',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.4'
                      }}>
                        {sug.proposedText}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={applySelectedCorrections}
              className="tech-button primary"
              style={{ width: '100%', justifyContent: 'center', padding: '10px 0', borderRadius: '8px', fontSize: '13px' }}
            >
              <Sparkles className="w-4 h-4" /> {t('bmad2.step4.applyCorrections')}
            </button>
          </div>
        )}

        {/* Export Folder Target Picker */}
        {!completedPath && !isGenerating && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px', 
            background: 'rgba(255,255,255,0.01)', 
            border: '1px solid var(--border-glass)', 
            padding: '12px 16px', 
            borderRadius: '12px',
            marginBottom: '16px',
            marginTop: '16px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('bmad2.step4.exportFolderTarget')}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                fontSize: '12.5px', 
                fontFamily: 'var(--font-mono, monospace)', 
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1
              }} title={customExportPath || `${vaultRoot}/BMAD/${projectName.trim().replace(/[^a-zA-Z0-9-_]/g, '_')}`}>
                {customExportPath || `${vaultRoot}/BMAD/${projectName.trim().replace(/[^a-zA-Z0-9-_]/g, '_')}`}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button 
                  onClick={async () => {
                    try {
                      const picked = await selectFolder();
                      if (picked) {
                        setCustomExportPath(picked.replace(/\\/g, '/'));
                      }
                    } catch (err) {
                      console.warn("Folder selection failed:", err);
                    }
                  }}
                  className="tech-button"
                  style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px' }}
                >
                  {t('bmad2.actions.choose')}
                </button>
                {customExportPath && (
                  <button 
                    onClick={() => setCustomExportPath('')}
                    className="tech-button"
                    style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px', color: 'var(--text-muted)' }}
                  >
                    {t('bmad2.actions.reset')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Generate Action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
          <button onClick={() => setCurrentStep(3)} className="tech-button">{t('bmad2.actions.backToFields')}</button>
          
          {isGenerating ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BrainLoader size={20} />
              <div style={{ fontSize: '13px' }}>
                {generationProgress?.message || t('bmad2.status.writing')}
              </div>
            </div>
          ) : completedPath ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleOpenInExplorer} className="tech-button primary">
                {t('bmad2.actions.openInExplorer')}
              </button>
              <button onClick={() => { setCompletedPath(''); setCurrentStep(0); scanVaultProjects(vaultRoot); }} className="tech-button">
                {t('bmad2.actions.finish')}
              </button>
            </div>
          ) : (
            <button 
              onClick={handleGenerateProject}
              className="tech-button primary"
              style={{ padding: '10px 24px' }}
            >
              {t('bmad2.actions.generateDocs')}
            </button>
          )}
        </div>
      </div>

      {/* Visuals & Presentation Generator panel */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Palette className="w-4 h-4 text-accent" />
          <span>{t('bmad2.visuals.title')}</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', margin: '0 0 16px 0', lineHeight: '1.4' }}>
          {t('bmad2.visuals.subtitle')}
        </p>

        {/* API Key compatibility detector warning */}
        {!isCloudAvailable && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            fontSize: '12px',
            marginBottom: '16px',
            lineHeight: '1.4'
          }}>
            <strong>{t('bmad2.visuals.apiKeyWarningTitle')}</strong> {t('bmad2.visuals.apiKeyWarningBody1')} <strong>{t('bmad2.visuals.vertexAI')}</strong> {t('bmad2.visuals.apiKeyWarningBody2')} <strong>{t('bmad2.visuals.settingsPath')}</strong> {t('bmad2.visuals.apiKeyWarningBody3')}
          </div>
        )}

        {/* Actions grid */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <button
            onClick={generateVisualDiagram}
            disabled={isGeneratingVisual !== null}
            className="tech-button"
            style={{ flex: 1, justifyContent: 'center', height: '36px', gap: '8px' }}
          >
            {isGeneratingVisual === 'diagram' ? (
              <>
                <BrainLoader size={16} />
                <span>{t('bmad2.visuals.generating')}</span>
              </>
            ) : (
              <>
                <Palette className="w-4 h-4 text-accent" />
                <span>{t('bmad2.visuals.generateDiagram')}</span>
              </>
            )}
          </button>

          <button
            onClick={generateVisualSlides}
            disabled={isGeneratingVisual !== null}
            className="tech-button"
            style={{ flex: 1, justifyContent: 'center', height: '36px', gap: '8px' }}
          >
            {isGeneratingVisual === 'slides' ? (
              <>
                <BrainLoader size={16} />
                <span>{t('bmad2.visuals.generating')}</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 text-accent" />
                <span>{t('bmad2.visuals.generateSlides')}</span>
              </>
            )}
          </button>
        </div>

        {/* Previews */}
        {generatedSvg && (
          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{t('bmad2.visuals.diagramPreviewTitle')}</h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setActiveModal('diagram')}
                  className="tech-button"
                  style={{ fontSize: '10.5px', padding: '4px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Maximize2 className="w-3.5 h-3.5" /> {t('bmad2.visuals.expand')}
                </button>
                <button
                  onClick={() => saveVisualFile('diagram')}
                  className="tech-button primary"
                  style={{ fontSize: '10.5px', padding: '4px 10px', borderRadius: '6px' }}
                >
                  {t('bmad2.visuals.saveToProject')}
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedSvg);
                    showToast(t('bmad2.visuals.svgCopiedToast'), "success");
                  }}
                  className="tech-button"
                  style={{ fontSize: '10.5px', padding: '4px 10px', borderRadius: '6px' }}
                >
                  {t('bmad2.visuals.copySvg')}
                </button>
                <button
                  onClick={() => setGeneratedSvg('')}
                  className="tech-button"
                  style={{ fontSize: '10.5px', padding: '4px 10px', borderRadius: '6px', color: 'var(--text-muted)' }}
                >
                  {t('bmad2.visuals.hide')}
                </button>
              </div>
            </div>
            <div 
              className="svg-preview-container"
              style={{
                padding: '16px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'auto',
                maxHeight: '480px',
                minHeight: '300px',
                width: '100%'
              }}
              dangerouslySetInnerHTML={{ __html: generatedSvg }}
            />
          </div>
        )}

        {generatedHtml && (
          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{t('bmad2.visuals.slidesPreviewTitle')}</h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setActiveModal('slides')}
                  className="tech-button"
                  style={{ fontSize: '10.5px', padding: '4px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Maximize2 className="w-3.5 h-3.5" /> {t('bmad2.visuals.expand')}
                </button>
                <button
                  onClick={() => saveVisualFile('slides')}
                  className="tech-button primary"
                  style={{ fontSize: '10.5px', padding: '4px 10px', borderRadius: '6px' }}
                >
                  {t('bmad2.visuals.saveToProject')}
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedHtml);
                    showToast(t('bmad2.visuals.htmlCopiedToast'), "success");
                  }}
                  className="tech-button"
                  style={{ fontSize: '10.5px', padding: '4px 10px', borderRadius: '6px' }}
                >
                  {t('bmad2.visuals.copyHtml')}
                </button>
                <button
                  onClick={() => setGeneratedHtml('')}
                  className="tech-button"
                  style={{ fontSize: '10.5px', padding: '4px 10px', borderRadius: '6px', color: 'var(--text-muted)' }}
                >
                  {t('bmad2.visuals.hide')}
                </button>
              </div>
            </div>
            <iframe 
              srcDoc={generatedHtml}
              title="Presentation Preview"
              style={{
                width: '100%',
                height: '520px',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                background: '#111',
                colorScheme: 'dark'
              }}
            />
          </div>
        )}
      </div>

      {/* Preview of Compiled Drafts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '10px' }}>
        {[
          { title: `📝 01. ${t('steps.brief.title')}`, data: bmadData.brief, fields: ['objective', 'problem', 'scope'] as const },
          { title: `👥 02. ${t('steps.mapping.title')}`, data: bmadData.mapping, fields: ['actors', 'resources', 'risks'] as const },
          { title: `🏗️ 03. ${t('steps.architecture.title')}`, data: bmadData.architecture, fields: ['structure', 'techStack', 'tradeoffs'] as const },
          { title: `📅 04. ${t('steps.delivery.title')}`, data: bmadData.delivery, fields: ['milestones', 'validation', 'kpis'] as const }
        ].map(preview => (
          <div key={preview.title} className="glass-card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px', marginBottom: '10px' }}>
              {preview.title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              {preview.fields.map(f => (
                <div key={f}>
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{t(`bmad2.step3.${f}`)} : </span>
                  <span style={{ color: 'var(--text-primary)' }}>{preview.data[f] || `(${t('doc.empty')})`}</span>
                </div>
              ))}
              <div>
                <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{t('doc.notes')} : </span>
                <span style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>{preview.data.notes || `(${t('doc.empty')})`}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ValidationStep;
