import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  MessageSquare,
  Cpu,
  Fingerprint,
  Share2,
  Database,
  Sparkles,
  Check,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useTranslation } from '../i18n';
import { ChatMessage } from '../types/bmad.types';
import { SOUL_PRESETS } from '../constants/bmad.constants';
import { preprocessMarkdown } from '../utils/text-utils';
import BrainLoader from './brain-loader';

/**
 * Props expected by the ChatSidebar component.
 */
export interface ChatSidebarProps {
  /** Width of the chat sidebar in pixels. */
  chatWidth: number;
  /** Callback to toggle between default and expanded chat sidebar widths. */
  toggleChatWidth: () => void;
  /** Array of active messages in the conversation history. */
  chatMessages: ChatMessage[];
  /** Whether the AI model is currently generating a response for the chat. */
  isSendingChat: boolean;
  /** Whether the semantic RAG global vault search is enabled. */
  useVaultMemory: boolean;
  /** Callback to toggle the global vault memory search. */
  setUseVaultMemory: (val: boolean) => void;
  /** List of LLM models available from the host. */
  availableModels: Array<{ id: string; name: string }>;
  /** Active LLM model ID for the chat assistant. */
  assistantModel: string;
  /** Callback to update the active chat assistant model ID. */
  setAssistantModel: (m: string) => void;
  /** Callback to update the active reviewer model ID. */
  setReviewerModel: (m: string) => void;
  /** Active persona profile ID. */
  selectedSoul: string;
  /** Callback to update the active persona profile ID. */
  setSelectedSoul: (s: string) => void;
  /** List of loaded draft BMAD projects in the vault. */
  bmadProjects: any[];
  /** Checked status of projects in the resonance context popover. */
  resonanceCheckboxes: Record<string, boolean>;
  /** Callback to update checked status of projects in the resonance context. */
  setResonanceCheckboxes: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  /** Current text value in the chat input field. */
  chatInput: string;
  /** Callback to update the chat input field value. */
  setChatInput: (val: string) => void;
  /** Handler invoked when submitting the chat message form. */
  handleSendChatMessage: (e: React.FormEvent) => void;
  /** Ref to bind to the bottom of the chat list to enable scrolling. */
  chatEndRef: React.RefObject<HTMLDivElement>;
  /** Event handler to trigger mouse-drag resizing. */
  startResizing: (e: React.MouseEvent) => void;
  /** Whether the chat sidebar is currently being dragged/resized. */
  isResizing: boolean;
}

/**
 * A sidebar containing the AI Chat assistant, persona configuration,
 * RAG database switches, resonance mapping checklist, and markdown renderer.
 */
export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chatWidth,
  toggleChatWidth,
  chatMessages,
  isSendingChat,
  useVaultMemory,
  setUseVaultMemory,
  availableModels,
  assistantModel,
  setAssistantModel,
  setReviewerModel,
  selectedSoul,
  setSelectedSoul,
  bmadProjects,
  resonanceCheckboxes,
  setResonanceCheckboxes,
  chatInput,
  setChatInput,
  handleSendChatMessage,
  chatEndRef,
  startResizing,
  isResizing
}) => {
  const { t } = useTranslation();
  const [modelPopover, setModelPopover] = useState(false);
  const [soulPopover, setSoulPopover] = useState(false);
  const [resonancePopover, setResonancePopover] = useState(false);

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">
            <MessageSquare className="w-4 h-4 text-accent" />
            <span>Mnemosyne AI</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={toggleChatWidth}
              className="tech-button" 
              style={{ padding: '4px', background: 'transparent', border: 'none' }}
              title={chatWidth < 500 ? t('bmad2.chat.expandChat') : t('bmad2.chat.collapseChat')}
            >
              {chatWidth < 500 ? (
                <Maximize2 className="w-4 h-4 text-muted hover:text-white transition-colors" />
              ) : (
                <Minimize2 className="w-4 h-4 text-muted hover:text-white transition-colors" />
              )}
            </button>
          </div>
        </div>

        {/* Messages Log */}
        <div className="chat-messages" style={{ padding: '20px 16px', gap: '16px' }}>
          {chatMessages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.role}`} style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: msg.role === 'user' ? '85%' : '95%',
              padding: '14px 18px',
              borderRadius: '12px',
              borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
              borderBottomLeftRadius: msg.role === 'assistant' ? '2px' : '12px',
              boxShadow: msg.role === 'user' ? '0 4px 12px var(--accent-glow)' : '0 4px 20px rgba(0,0,0,0.25)',
              background: msg.role === 'user' 
                ? 'linear-gradient(135deg, var(--accent), #1d4ed8)' 
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
              border: msg.role === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.06)',
              position: 'relative',
              animation: 'slideIn 0.25s ease'
            }}>
              {msg.role === 'assistant' && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  marginBottom: '10px', 
                  fontSize: '10px', 
                  fontWeight: 'bold', 
                  color: '#60a5fa', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.08em',
                  opacity: 0.85
                }}>
                  <Sparkles className="w-3 h-3 text-accent" />
                  <span>Mnemosyne AI</span>
                </div>
              )}
              {msg.role === 'assistant' ? (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ ...props }) => <p style={{ margin: '0 0 10px 0', lineHeight: '1.6', fontSize: '13.5px', color: '#cbd5e1' }} {...props} />,
                    ul: ({ ...props }) => <ul style={{ margin: '0 0 10px 0', paddingLeft: '20px', listStyleType: 'disc' }} {...props} />,
                    ol: ({ ...props }) => <ol style={{ margin: '0 0 10px 0', paddingLeft: '20px', listStyleType: 'decimal' }} {...props} />,
                    li: ({ ...props }) => <li style={{ margin: '0 0 6px 0', lineHeight: '1.5', fontSize: '13px', color: '#cbd5e1' }} {...props} />,
                    strong: ({ ...props }) => <strong style={{ color: '#ffffff', fontWeight: '600' }} {...props} />,
                    blockquote: ({ ...props }) => (
                      <blockquote style={{ 
                        borderLeft: '3px solid var(--accent)', 
                        paddingLeft: '12px', 
                        margin: '12px 0', 
                        color: '#94a3b8', 
                        fontStyle: 'italic',
                        background: 'rgba(255, 255, 255, 0.01)',
                        paddingTop: '4px',
                        paddingBottom: '4px'
                      }} {...props} />
                    ),
                    h1: ({ ...props }) => <h1 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', margin: '18px 0 8px 0', borderBottom: '1px solid var(--border-glass)', paddingBottom: '4px' }} {...props} />,
                    h2: ({ ...props }) => <h2 style={{ fontSize: '14.5px', fontWeight: '600', color: '#ffffff', margin: '16px 0 6px 0' }} {...props} />,
                    h3: ({ ...props }) => <h3 style={{ fontSize: '13.5px', fontWeight: '600', color: '#ffffff', margin: '14px 0 4px 0' }} {...props} />,
                    code: ({ className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return match ? (
                        <pre style={{ 
                          background: 'rgba(0, 0, 0, 0.4)', 
                          border: '1px solid var(--border-glass)', 
                          borderRadius: '6px', 
                          padding: '12px', 
                          overflowX: 'auto',
                          margin: '10px 0',
                          fontFamily: 'monospace',
                          fontSize: '11.5px',
                          lineHeight: '1.4'
                        }}>
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code style={{ 
                          background: 'rgba(255, 255, 255, 0.08)', 
                          padding: '2px 6px', 
                          borderRadius: '4px',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          color: '#f8fafc'
                        }} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {preprocessMarkdown(msg.content)}
                </ReactMarkdown>
              ) : (
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', fontSize: '13.5px' }}>{msg.content}</div>
              )}
            </div>
          ))}
          {isSendingChat && (
            <div className="chat-bubble assistant" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-glass)',
              borderRadius: '12px',
              borderBottomLeftRadius: '2px'
            }}>
              <BrainLoader size={18} />
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {useVaultMemory ? t('bmad2.status.memorySearch') : t('bmad2.status.thinking')}
              </span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="chat-input-area">
          <div style={{ display: 'flex', gap: '8px', position: 'relative', marginBottom: '8px' }}>
            {/* Model Popover */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => { setModelPopover(!modelPopover); setSoulPopover(false); setResonancePopover(false); }}
                className="tech-button"
                style={{ borderRadius: '8px', padding: '8px' }}
                title={t('bmad2.actions.chooseModel')}
              >
                <Cpu className="w-4 h-4" />
              </button>
              {modelPopover && (
                <div className="popover">
                  <div className="popover-title">{t('bmad2.titles.llmModel')}</div>
                  {availableModels.map(m => (
                    <button 
                      key={m.id} 
                      onClick={() => { 
                        setAssistantModel(m.id); 
                        setReviewerModel(m.id); 
                        setModelPopover(false); 
                      }}
                      className="popover-item"
                    >
                      <span>{m.name}</span>
                      {assistantModel === m.id && <Check className="w-3.5 h-3.5 text-accent" />}
                    </button>
                  ))}
                  {availableModels.length === 0 && (
                    <div className="popover-item" style={{ color: 'var(--text-muted)' }}>
                      {t('bmad2.status.usingDefaultHostModel')}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Soul Persona Popover */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => { setSoulPopover(!soulPopover); setModelPopover(false); setResonancePopover(false); }}
                className="tech-button"
                style={{ borderRadius: '8px', padding: '8px' }}
                title={t('bmad2.actions.aiProfile')}
              >
                <Fingerprint className="w-4 h-4" />
              </button>
              {soulPopover && (
                <div className="popover">
                  <div className="popover-title">{t('bmad2.titles.cognitiveProfile')}</div>
                  {SOUL_PRESETS.map(s => (
                    <button 
                      key={s.id} 
                      onClick={() => { setSelectedSoul(s.id); setSoulPopover(false); }}
                      className="popover-item"
                    >
                      <span>{t(`bmad2.chat.souls.${s.id}`) || s.name}</span>
                      {selectedSoul === s.id && <Check className="w-3.5 h-3.5 text-accent" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Resonance Context Popover */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => { setResonancePopover(!resonancePopover); setModelPopover(false); setSoulPopover(false); }}
                className="tech-button"
                style={{ borderRadius: '8px', padding: '8px' }}
                title={t('bmad2.actions.contextualLink')}
              >
                <Share2 className="w-4 h-4" />
              </button>
              {resonancePopover && (
                <div className="popover" style={{ width: '280px' }}>
                  <div className="popover-title">{t('bmad2.titles.contextualResonance')}</div>
                  {bmadProjects.map(p => (
                    <label 
                      key={p._filePath} 
                      className="popover-item" 
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                      <input 
                        type="checkbox" 
                        checked={!!resonanceCheckboxes[p._filePath]}
                        onChange={(e) => setResonanceCheckboxes(prev => ({ ...prev, [p._filePath]: e.target.checked }))}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="truncate" style={{ flex: 1 }}>{p.name}</span>
                    </label>
                  ))}
                  {bmadProjects.length === 0 && (
                    <div className="popover-item" style={{ color: 'var(--text-muted)' }}>
                      {t('bmad2.errors.noOtherBmadProjects')}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Vault Memory (RAG) Toggle */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => { setUseVaultMemory(!useVaultMemory); setModelPopover(false); setSoulPopover(false); setResonancePopover(false); }}
                className={`tech-button ${useVaultMemory ? 'active' : ''}`}
                style={{ 
                  borderRadius: '8px', 
                  padding: '8px',
                  backgroundColor: useVaultMemory ? 'rgba(59, 130, 246, 0.15)' : undefined,
                  borderColor: useVaultMemory ? 'var(--accent)' : undefined,
                  color: useVaultMemory ? 'var(--text-primary)' : 'var(--text-muted)'
                }}
                title={useVaultMemory ? t('chat.vaultMemoryActive') || "Mémoire globale active (RAG)" : t('chat.vaultMemoryInactive') || "Mémoire globale désactivée (LLM Brut)"}
              >
                <Database className="w-4 h-4" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="tech-input"
              style={{ flex: 1, borderRadius: '8px' }}
              placeholder={t('bmad2.chat.placeholder') || "Aide-moi à rédiger mon brief..."}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isSendingChat}
            />
            <button 
              type="submit" 
              className="tech-button primary" 
              style={{ borderRadius: '8px', padding: '8px 12px' }}
              disabled={isSendingChat || !chatInput.trim()}
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </form>
        </div>
      </aside>

      {/* resizer handle */}
      <div 
        className={`sidebar-resizer ${isResizing ? 'resizing' : ''}`}
        onMouseDown={startResizing}
        onDoubleClick={toggleChatWidth}
        style={{
          width: '4px',
          height: '100%',
          cursor: 'col-resize',
          zIndex: 10,
          borderLeft: '1px solid var(--border-glass)',
          backgroundColor: isResizing ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
          transition: 'background-color 0.2s',
        }}
        title={t('bmad2.actions.resizeChat')}
      />
    </>
  );
};

export default ChatSidebar;
