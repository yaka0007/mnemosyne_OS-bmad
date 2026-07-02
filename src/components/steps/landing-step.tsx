import React from 'react';
import { Sparkles, Plus, FolderOpen, FolderGit2, FileText, Trash2 } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { CATEGORY_ICONS } from '../../constants/bmad.constants';
import BrainLoader from '../brain-loader';

/**
 * Props expected by the LandingStep component.
 */
export interface LandingStepProps {
  /** List of loaded draft BMAD projects in the vault. */
  bmadProjects: any[];
  /** Whether the list of existing projects is expanded/visible. */
  showBmadInfo: boolean;
  /** Callback to toggle the visibility of the project explorer drawer. */
  setShowBmadInfo: (show: boolean) => void;
  /** Handler to load a selected project config. */
  handleLoadProject: (proj: any) => void;
  /** Handler to delete a selected project config. */
  handleDeleteProject: (proj: any, event: React.MouseEvent) => void;
  /** Whether the vault directories are currently being scanned for project files. */
  loadingProjects: boolean;
  /** Callback to start a new project from scratch (reset states). */
  onNewProject: () => void;
}

/**
 * Step 0: Landing page offering options to start a new workspace
 * or explore, reload, and manage existing BMAD projects.
 */
export const LandingStep: React.FC<LandingStepProps> = ({
  bmadProjects,
  showBmadInfo,
  setShowBmadInfo,
  handleLoadProject,
  handleDeleteProject,
  loadingProjects,
  onNewProject
}) => {
  const { t } = useTranslation();

  return (
    <div className="glass-card" style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'rgba(37, 99, 235, 0.05)',
          border: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(37, 99, 235, 0.1)'
        }}>
          <Sparkles className="w-8 h-8 text-accent" />
        </div>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0' }}>
        {t('bmad2.landing.welcome') || 'Bienvenue dans BMAD 2.0'}
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: '0 0 24px 0', lineHeight: '1.6' }}>
        {t('bmad2.landing.subtitle') || 'Le copilote intelligent pour structurer, mapper et délivrer vos projets avec précision.'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <button 
          onClick={onNewProject} 
          className="category-pill active"
          style={{ padding: '24px', gap: '12px' }}
        >
          <Plus className="w-6 h-6 text-accent" />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{t('bmad2.landing.newProject')}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{t('bmad2.landing.newProjectDesc')}</div>
          </div>
        </button>

        <button 
          onClick={() => {
            setShowBmadInfo(!showBmadInfo);
          }} 
          className="category-pill"
          style={{ padding: '24px', gap: '12px' }}
        >
          <FolderOpen className="w-6 h-6 text-accent" />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{t('bmad2.landing.loadProject')}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {t('bmad2.landing.projectsFound', { count: bmadProjects.length })}
            </div>
          </div>
        </button>
      </div>

      {/* Existing projects drawer */}
      {(showBmadInfo || bmadProjects.length > 0) && (
        <div style={{
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '20px',
          textAlign: 'left'
        }}>
          <h3 style={{ fontSize: '13.5px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderGit2 className="w-4 h-4 text-accent" />
            <span>{t('bmad2.landing.selectProject')}</span>
          </h3>

          {loadingProjects ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '12.5px' }}>
              <BrainLoader size={16} />
              <span>{t('bmad2.landing.searchingProjects')}</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
              {bmadProjects.map((proj) => {
                const CatIcon = CATEGORY_ICONS[proj.category] || FileText;
                return (
                  <div 
                    key={proj._filePath}
                    onClick={() => handleLoadProject(proj)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    className="hover:bg-interface"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CatIcon className="w-4 h-4 text-accent" />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{proj.name}</span>
                          {proj.version && (
                            <span style={{ 
                              fontSize: '9px', 
                              background: 'rgba(37,99,235,0.12)', 
                              color: '#60a5fa', 
                              border: '1px solid rgba(37,99,235,0.25)', 
                              padding: '1px 5px', 
                              borderRadius: '4px',
                              fontWeight: 500
                            }}>
                              v{proj.version}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }} className="truncate max-w-[280px]">
                          {proj.description || t('bmad2.landing.noDescription')}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => handleDeleteProject(proj, e)}
                      className="tech-button" 
                      style={{ padding: '6px', border: 'none', background: 'transparent' }}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500 hover:text-red-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LandingStep;
