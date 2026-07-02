import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MnemoCartridgeSDK } from './sdk/mnemo-sdk';
import { useTranslation, setLanguage } from './i18n';
import './App.css';

// Types & Constants
import { ChatMessage, BmadData } from './types/bmad.types';
import { DEFAULT_BMAD_DATA, SOUL_PRESETS } from './constants/bmad.constants';

// Utils
import { cleanCodeBlock } from './utils/text-utils';
import { generateSvgFromData } from './utils/svg-generator';
import { SLIDES_SYSTEM_PROMPT, getHtmlSlidesPrompt } from './utils/html-templates';
import { compileMarkdownDocuments } from './utils/document-compiler';

// Components
import ChatSidebar from './components/chat-sidebar';
import ModalPreview from './components/modal-preview';

// Steps
import LandingStep from './components/steps/landing-step';
import FoundationsStep from './components/steps/foundations-step';
import SettingsStep from './components/steps/settings-step';
import FlowWizardStep from './components/steps/flow-wizard-step';
import ValidationStep from './components/steps/validation-step';

const sdk = new MnemoCartridgeSDK('@mnemosyne-plugins/bmad-2');

/**
 * Renders the main entry point of the BMAD-2.0 cartridge.
 * Orchestrates navigation flow, project data persistence, and chat/visual modules integration.
 */
export default function App() {
  const { t, i18n } = useTranslation();

  // App Theme State (sync with host)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('theme') as 'dark' | 'light') || 'dark';
  });

  // Host model/vault configs
  const [vaultRoot, setVaultRoot] = useState<string>('');
  const [bmadProjects, setBmadProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // App Navigation
  const [currentStep, setCurrentStep] = useState(0); // 0: Landing, 1: Init, 2: AI Settings, 3: Flow, 4: Review
  const [showBmadInfo, setShowBmadInfo] = useState(false);

  // Form State - Step 1: Init
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [projectCategory, setProjectCategory] = useState('software');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [resonanceParent, setResonanceParent] = useState('');
  const [projectVersion, setProjectVersion] = useState('0.1.0');

  // Form State - Step 2: AI Settings
  const [userMode, setUserMode] = useState<'novice' | 'pro' | 'expert'>('pro');
  const [telemetry, setTelemetry] = useState<'local_only' | 'opt_in_remote' | 'full_remote'>('opt_in_remote');
  const [proactiveMode, setProactiveMode] = useState<'manual_only' | 'soft_proactive' | 'strong_proactive'>('soft_proactive');
  const [assistantModel, setAssistantModel] = useState('gemini-2.5-flash');
  const [reviewerModel, setReviewerModel] = useState('gemini-2.5-flash');
  const [availableModels, setAvailableModels] = useState<any[]>([]);

  // Form State - Step 3: BMAD Flow Tabs
  const [activeBmadTab, setActiveBmadTab] = useState<'brief' | 'mapping' | 'architecture' | 'delivery'>('brief');
  const [bmadData, setBmadData] = useState<BmadData>(DEFAULT_BMAD_DATA);

  // Step 4: Critical Review & Document Generation
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [reviewOutput, setReviewOutput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedSuggestionIds, setSelectedSuggestionIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<{ current: number; total: number; message: string } | null>(null);
  const [completedPath, setCompletedPath] = useState('');
  const [customExportPath, setCustomExportPath] = useState<string>('');
  const [assistingFields, setAssistingFields] = useState<Record<string, boolean>>({});

  // States for visuals & presentation generators
  const [systemModelConfig, setSystemModelConfig] = useState<any>(null);
  const [generatedSvg, setGeneratedSvg] = useState<string>('');
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [isGeneratingVisual, setIsGeneratingVisual] = useState<'slides' | 'diagram' | null>(null);
  const [activeModal, setActiveModal] = useState<'diagram' | 'slides' | null>(null);

  // Left Sidebar Chat State
  const [chatMessages, setChatMessages] = useState<Array<ChatMessage>>(() => [
    { role: 'assistant', content: t('bmad2.chat.welcomeMessage') }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [useVaultMemory, setUseVaultMemory] = useState(true);
  const [selectedSoul, setSelectedSoul] = useState('default');
  const [resonanceCheckboxes, setResonanceCheckboxes] = useState<Record<string, boolean>>({});

  // Layout Width Sizing
  const [chatWidth, setChatWidth] = useState(350);
  const [isResizing, setIsResizing] = useState(false);

  // Toast popup
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Refs
  const chatEndRef = useRef<HTMLDivElement>(null);

  /** Display simple toast notifications on the upper right corner. */
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  /** Resizing mouse event handlers for the drag bar */
  const startResizing = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    const nextWidth = e.clientX;
    const minWidth = 260;
    const maxWidth = Math.min(window.innerWidth - 320, 900);
    if (nextWidth >= minWidth && nextWidth <= maxWidth) {
      setChatWidth(nextWidth);
    }
  }, [isResizing]);

  const toggleChatWidth = () => {
    if (chatWidth < 500) {
      setChatWidth(700);
    } else {
      setChatWidth(350);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isSendingChat]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sync theme from host
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialTheme = params.get('theme') as 'dark' | 'light' | null;
    if (initialTheme) setTheme(initialTheme);

    const handleSync = (event: MessageEvent) => {
      if (event.data?.type === 'MNEMOSYNE_CONFIG_SYNC') {
        const themeVal = event.data.config?.theme;
        if (themeVal) setTheme(themeVal);
        const langVal = event.data.config?.lang;
        if (langVal) {
          setLanguage(langVal);
        }
      }
    };
    window.addEventListener('message', handleSync);
    return () => window.removeEventListener('message', handleSync);
  }, []);

  /** Scan draft json configurations in vault */
  const scanVaultProjects = useCallback(async (root: string) => {
    setLoadingProjects(true);
    try {
      const bmadPath = `${root}/.mnemo/bmad`.replace(/\\/g, '/');
      const res = await sdk.invoke('dialog.readDir', { dirPath: bmadPath });
      if (res.success && res.files) {
        const loaded: any[] = [];
        for (const file of res.files) {
          if (!file.isDirectory && file.name.endsWith('.json')) {
            const fileRes = await sdk.invoke('dialog.readFile', { filePath: file.path });
            if (fileRes.success && fileRes.content) {
              try {
                const parsed = JSON.parse(fileRes.content);
                parsed._filePath = file.path;
                loaded.push(parsed);
              } catch (e) {
                console.warn('Failed parsing JSON file:', file.path);
              }
            }
          }
        }
        setBmadProjects(loaded);
      }
    } catch (err) {
      console.warn('Failed to scan BMAD projects directory:', err);
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  // Fetch host details on startup
  useEffect(() => {
    sdk.getModelConfig()
      .then((cfg) => {
        setSystemModelConfig(cfg);
        if (cfg?.model) {
          setAvailableModels([{ id: cfg.model, name: cfg.model, provider: cfg.provider || 'system' }]);
          setAssistantModel(cfg.model);
          setReviewerModel(cfg.model);
        }
      })
      .catch((err) => console.warn('Could not load host model config:', err));

    sdk.invoke('vault.getConfig')
      .then((vaultCfg) => {
        if (vaultCfg && vaultCfg.rootPath) {
          const root = vaultCfg.rootPath.replace(/\\/g, '/');
          setVaultRoot(root);
          scanVaultProjects(root);
        }
      })
      .catch((err) => console.warn('Could not retrieve active vault config:', err));
  }, [scanVaultProjects]);

  /** Initialize states for a new project draft */
  const handleCreateNewProject = () => {
    setProjectName('');
    setDescription('');
    setProjectCategory('software');
    setHashtags([]);
    setResonanceParent('');
    setProjectVersion('0.1.0');
    setBmadData(DEFAULT_BMAD_DATA);
    setGeneratedSvg('');
    setGeneratedHtml('');
    setCustomExportPath('');
    setCompletedPath('');
    setChatMessages([
      { role: 'assistant', content: t('bmad2.chat.welcomeMessage') }
    ]);
    setCurrentStep(1);
  };

  /** Load selected project configuration into states */
  const handleLoadProject = (proj: any) => {
    try {
      setProjectName(proj.name || '');
      setDescription(proj.description || '');
      setProjectCategory(proj.category || 'software');
      setProjectVersion(proj.version || '0.1.0');
      setHashtags(proj.initialHashtags || proj.hashtags || []);
      setResonanceParent(proj.resonanceParent || '');

      const bmad = proj.bmad || {};
      if (bmad.userMode) setUserMode(bmad.userMode);
      if (bmad.telemetryMode) setTelemetry(bmad.telemetryMode);
      if (bmad.proactiveMode) setProactiveMode(bmad.proactiveMode);

      const sd = bmad.stepData || {};
      const defaultBmad = {
        brief: { objective: '', problem: '', scope: '', notes: '' },
        mapping: { actors: '', resources: '', risks: '', notes: '' },
        architecture: { structure: '', techStack: '', tradeoffs: '', notes: '' },
        delivery: { milestones: '', validation: '', kpis: '', notes: '' }
      };

      setBmadData({
        brief: { ...defaultBmad.brief, ...sd.brief },
        mapping: { ...defaultBmad.mapping, ...sd.mapping },
        architecture: { ...defaultBmad.architecture, ...sd.architecture },
        delivery: { ...defaultBmad.delivery, ...sd.delivery }
      });

      setGeneratedSvg(bmad.generatedSvg || '');
      setGeneratedHtml(bmad.generatedHtml || '');

      if (bmad.chatMessages && Array.isArray(bmad.chatMessages)) {
        setChatMessages(bmad.chatMessages);
      } else {
        setChatMessages([
          { role: 'assistant', content: t('bmad2.chat.welcomeMessage') }
        ]);
      }

      showToast(t('bmad2.success.reloadedMessage', { project: proj.name }), 'success');
      setCurrentStep(3);
    } catch (e) {
      showToast(t('bmad2.errors.loadProjectFailed'), 'error');
    }
  };

  /** Delete project configuration */
  const handleDeleteProject = async (proj: any, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!window.confirm(t('bmad2.confirm.deleteProject', { project: proj.name }))) return;

    try {
      const res = await sdk.invoke('dialog.deleteFile', { filePath: proj._filePath });
      if (res.success) {
        showToast(t('bmad2.success.projectDeleted', { project: proj.name }), 'success');
        scanVaultProjects(vaultRoot);
      } else {
        throw new Error(res.error);
      }
    } catch (e: any) {
      showToast(t('bmad2.errors.deleteFailed', { error: e.message || e }), 'error');
    }
  };

  /** Send chat messages to host model manager */
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isSendingChat) return;

    const userMsg = chatInput.trim();
    const withUserMsg: Array<ChatMessage> = [...chatMessages, { role: 'user', content: userMsg }];
    setChatMessages(withUserMsg);
    setChatInput('');
    setIsSendingChat(true);

    try {
      if (projectName.trim()) {
        await handleSaveDraft(true, { chatMessages: withUserMsg });
      }

      const pl = (key: string, opts?: any) => t(`bmad2.promptLabels.${key}`, opts);

      let linksCtx = '';
      const checkedPaths = Object.keys(resonanceCheckboxes).filter(p => resonanceCheckboxes[p]);
      if (checkedPaths.length > 0) {
        linksCtx = `\n\n${pl('resonanceHeader')} :\n`;
        checkedPaths.forEach((path) => {
          const matchPr = bmadProjects.find(p => p._filePath === path);
          if (matchPr) {
            linksCtx += `- ${pl('resonanceProject')} "${matchPr.name}" : ${matchPr.description || pl('noDescription')}\n`;
          }
        });
      }

      // Construct dynamic page context
      const bmadStateContext = `

${pl('pageContextHeader')}
${pl('projectName')} : ${projectName || pl('notSpecified')}
${pl('description')} : ${description || pl('notSpecified')}
${pl('category')} : ${projectCategory || pl('defaultCategory')}
${pl('exportFolder')} : ${customExportPath || `${vaultRoot}/BMAD/${projectName || 'Projet_Sans_Nom'}`}

${pl('bmadDataHeader')}
${pl('phase1Label')} :
- ${t('bmad2.step3.objective')} : ${bmadData.brief.objective || pl('emptyValue')}
- ${t('bmad2.step3.problem')} : ${bmadData.brief.problem || pl('emptyValue')}
- ${t('bmad2.step3.scope')} : ${bmadData.brief.scope || pl('emptyValue')}
- ${pl('notesFor', { phase: t('bmad2.step3.briefTab') })} : ${bmadData.brief.notes || pl('emptyValue')}

${pl('phase2Label')} :
- ${t('bmad2.step3.actors')} : ${bmadData.mapping.actors || pl('emptyValue')}
- ${t('bmad2.step3.resources')} : ${bmadData.mapping.resources || pl('emptyValue')}
- ${t('bmad2.step3.risks')} : ${bmadData.mapping.risks || pl('emptyValue')}
- ${pl('notesFor', { phase: t('bmad2.step3.mappingTab') })} : ${bmadData.mapping.notes || pl('emptyValue')}

${pl('phase3Label')} :
- ${t('bmad2.step3.structure')} : ${bmadData.architecture.structure || pl('emptyValue')}
- ${t('bmad2.step3.techStack')} : ${bmadData.architecture.techStack || pl('emptyValue')}
- ${t('bmad2.step3.tradeoffs')} : ${bmadData.architecture.tradeoffs || pl('emptyValue')}
- ${pl('notesFor', { phase: t('bmad2.step3.architectureTab') })} : ${bmadData.architecture.notes || pl('emptyValue')}

${pl('phase4Label')} :
- ${t('bmad2.step3.milestones')} : ${bmadData.delivery.milestones || pl('emptyValue')}
- ${t('bmad2.step3.validation')} : ${bmadData.delivery.validation || pl('emptyValue')}
- ${t('bmad2.step3.kpis')} : ${bmadData.delivery.kpis || pl('emptyValue')}
- ${pl('notesFor', { phase: t('bmad2.step3.deliveryTab') })} : ${bmadData.delivery.notes || pl('emptyValue')}
`;

      // File creation system prompt instruction
      const fileCreationInstruction = `

${pl('fileCreationHeader')}
${pl('fileCreationBody')}
[CREATE_FILE: nom_du_fichier.md]
# ${pl('fileCreationDocTitle')}
${pl('fileCreationDocBody')}
[END_CREATE_FILE]
${pl('fileCreationSyntaxNote')} ${pl('fileCreationWriteIn', { language: t('doc.aiLanguage') })}
`;

      const activeSoul = SOUL_PRESETS.find(s => s.id === selectedSoul);
      const systemPrompt = (activeSoul ? activeSoul.prompt : '') + linksCtx + bmadStateContext + fileCreationInstruction;

      const response = await sdk.inferModel({
        prompt: userMsg,
        systemPrompt,
        model: assistantModel,
        disableRAG: !useVaultMemory,
        maxTokens: 4000
      });

      let replyText = '';
      if (typeof response === 'string') {
        replyText = response;
      } else if (response) {
        replyText = response.text || response.content || response.response || response.answer || '';
      }

      if (replyText) {
        // Intercept [CREATE_FILE: filename.md] ... [END_CREATE_FILE]
        const createFileRegex = /\[CREATE_FILE:\s*([^\]\s]+)\]([\s\S]*?)\[END_CREATE_FILE\]/gi;
        let match;
        let cleanedReply = replyText;
        
        while ((match = createFileRegex.exec(replyText)) !== null) {
          const filename = match[1]!.trim();
          const fileContent = match[2]!.trim();
          
          if (filename && fileContent) {
            const safeProjName = projectName.trim().replace(/[^a-zA-Z0-9-_]/g, '_') || 'Projet_Sans_Nom';
            const targetDir = (completedPath || customExportPath || `${vaultRoot}/BMAD/${safeProjName}`).replace(/\\/g, '/');
            
            // Invoke mkdir and writeFile asynchronously
            (async () => {
              try {
                await sdk.invoke('dialog.mkdir', { dirPath: targetDir });
                const filePath = `${targetDir}/${filename}`;
                const writeRes = await sdk.invoke('dialog.writeFile', {
                  filePath,
                  content: fileContent
                });
                if (writeRes.success) {
                  showToast(t('bmad2.visuals.attachmentCreatedToast', { filename }), 'success');
                } else {
                  console.error(`Failed to write file ${filename}:`, writeRes.error);
                }
              } catch (err) {
                console.error(`Error writing file ${filename}:`, err);
              }
            })();
            
            const rawTag = match[0];
            cleanedReply = cleanedReply.replace(rawTag, `\n\n*📁 **${t('bmad2.visuals.attachmentCreatedLabel')}** : [${filename}](file:///${targetDir}/${filename})*\n\n`);
          }
        }

        const finalMsgs: Array<ChatMessage> = [...withUserMsg, { role: 'assistant', content: cleanedReply }];
        setChatMessages(finalMsgs);
        if (projectName.trim()) {
          await handleSaveDraft(true, { chatMessages: finalMsgs });
        }
      }
    } catch (err: any) {
      showToast(t('bmad2.errors.enrichFailed', { error: err.message || err }), 'error');
    } finally {
      setIsSendingChat(false);
    }
  };

  /** Assist field-level rephrasing or contextual drafting */
  const handleFieldAiAssist = async (phase: string, field: string, currentValue?: string) => {
    const fieldLabels: Record<string, string> = {
      objective: t('bmad2.step3.objective') || 'Objective',
      problem: t('bmad2.step3.problem') || 'Problem',
      scope: t('bmad2.step3.scope') || 'Scope',
      actors: t('bmad2.step3.actors') || 'Actors',
      resources: t('bmad2.step3.resources') || 'Resources',
      risks: t('bmad2.step3.risks') || 'Risks',
      structure: t('bmad2.step3.structure') || 'Structure',
      techStack: t('bmad2.step3.techStack') || 'Tech Stack',
      tradeoffs: t('bmad2.step3.tradeoffs') || 'Tradeoffs',
      milestones: t('bmad2.step3.milestones') || 'Milestones',
      validation: t('bmad2.step3.validation') || 'Validation',
      kpis: t('bmad2.step3.kpis') || 'KPIs'
    };

    const isDraftEmpty = !currentValue || !currentValue.trim();
    if (isDraftEmpty && !projectName.trim()) {
      showToast(t('bmad2.errors.nameProjectFirst'), 'info');
      return;
    }

    showToast(isDraftEmpty ? t('bmad2.ai.generatingFromContext') : t('bmad2.ai.generatingSuggestions'), 'info');
    setAssistingFields(prev => ({ ...prev, [field]: true }));
    
    try {
      const filledContext: string[] = [];
      const phases = ['brief', 'mapping', 'architecture', 'delivery'] as const;
      
      phases.forEach(p => {
        const section = bmadData[p];
        Object.entries(section).forEach(([key, val]) => {
          if (key === 'notes' || (p === phase && key === field) || !val || !val.trim()) {
            return;
          }
          const label = fieldLabels[key] || key;
          filledContext.push(`- ${label} : ${val.trim()}`);
        });
      });

      const contextBlocks: string[] = [];
      contextBlocks.push(`${t('bmad2.promptLabels.projectName')} : ${projectName}`);
      if (description) contextBlocks.push(`${t('bmad2.promptLabels.description')} : ${description}`);
      if (projectCategory) contextBlocks.push(`${t('bmad2.promptLabels.category')} : ${projectCategory}`);
      if (hashtags && hashtags.length > 0) {
        contextBlocks.push(`${t('bmad2.promptLabels.tags')} : ${hashtags.map(h => `#${h}`).join(' ')}`);
      }

      if (filledContext.length > 0) {
        contextBlocks.push(`\n${t('bmad2.promptLabels.definedElementsHeader')}`);
        contextBlocks.push(filledContext.join('\n'));
        contextBlocks.push(t('bmad2.promptLabels.definedElementsFooter'));
      }

      let systemPrompt = '';
      let prompt = '';

      if (isDraftEmpty) {
        systemPrompt = t('bmad2.step3.promptAssist', {
          field: fieldLabels[field] || field,
          question: getGuidedPlaceholder(phase, field),
          context: contextBlocks.join('\n')
        });
        prompt = t('bmad2.ai.generatingFromContext');
      } else {
        systemPrompt = t('bmad2.step3.promptRephrase') + `\n\n[CONTEXT]\n${contextBlocks.join('\n')}`;
        prompt = currentValue?.trim() || '';
      }

      const response = await sdk.inferModel({
        prompt,
        systemPrompt,
        temperature: 0.7,
        disableRAG: true,
        maxTokens: 4000
      });

      let enriched = '';
      if (typeof response === 'string') {
        enriched = response;
      } else if (response) {
        enriched = response.text || response.content || response.response || response.answer || '';
      }
      if (enriched.trim()) {
        setBmadData(prev => {
          const section = prev[phase as keyof typeof prev] as any;
          return {
            ...prev,
            [phase]: {
              ...section,
              [field]: enriched.trim()
            }
          };
        });
        showToast(t('bmad2.success.proposalApplied'), 'success');
      }
    } catch (e: any) {
      showToast(t('bmad2.errors.enrichFailed', { error: e.message || e }), 'error');
    } finally {
      setAssistingFields(prev => ({ ...prev, [field]: false }));
    }
  };

  const getGuidedPlaceholder = (phase: string, field: string) => {
    const validCategories = ['software', 'blockchain', 'business'];
    const cat = validCategories.includes(projectCategory) ? projectCategory : 'software';
    return t(`bmad2.questions.${cat}.${phase}.${field}`) || '';
  };

  /** AI Critical Critique Reviewer */
  const runAiReview = async () => {
    if (isReviewLoading) return;
    setIsReviewLoading(true);
    setReviewOutput('');

    try {
      const pl = (key: string, opts?: any) => t(`bmad2.promptLabels.${key}`, opts);
      const compiled = `
# ${pl('reviewProjectHeader')} : ${projectName}
${pl('description')}: ${description}
${pl('category')}: ${projectCategory}

## ${pl('reviewBriefHeader')}
- ${t('bmad2.step3.objective')}: ${bmadData.brief.objective}
- ${t('bmad2.step3.problem')}: ${bmadData.brief.problem}
- ${t('bmad2.step3.scope')}: ${bmadData.brief.scope}
- ${pl('notesFor', { phase: t('bmad2.step3.briefTab') })}: ${bmadData.brief.notes}

## ${pl('reviewMappingHeader')}
- ${t('bmad2.step3.actors')}: ${bmadData.mapping.actors}
- ${t('bmad2.step3.resources')}: ${bmadData.mapping.resources}
- ${t('bmad2.step3.risks')}: ${bmadData.mapping.risks}
- ${pl('notesFor', { phase: t('bmad2.step3.mappingTab') })}: ${bmadData.mapping.notes}

## ${pl('reviewArchHeader')}
- ${pl('reviewGlobalStructure')}: ${bmadData.architecture.structure}
- ${pl('reviewTechStack')}: ${bmadData.architecture.techStack}
- ${t('bmad2.step3.tradeoffs')}: ${bmadData.architecture.tradeoffs}
- ${pl('notesFor', { phase: t('bmad2.step3.architectureTab') })}: ${bmadData.architecture.notes}

## ${pl('reviewDeliveryHeader')}
- ${pl('reviewMilestonesPlanning')}: ${bmadData.delivery.milestones}
- ${pl('reviewValidationCriteria')}: ${bmadData.delivery.validation}
- ${t('bmad2.step3.kpis')}: ${bmadData.delivery.kpis}
- ${pl('notesFor', { phase: t('bmad2.step3.deliveryTab') })}: ${bmadData.delivery.notes}
      `;

      const systemPrompt = t('ai.reviewerSystemPrompt', { language: t('doc.aiLanguage') || 'français' });

      const response = await sdk.inferModel({
        prompt: t('ai.reviewerPromptInput', { compiled }),
        systemPrompt,
        model: reviewerModel,
        temperature: 0.8,
        disableRAG: true,
        maxTokens: 4000
      });

      let reviewText = '';
      if (typeof response === 'string') {
        reviewText = response;
      } else if (response) {
        reviewText = response.text || response.content || response.response || response.answer || '';
      }

      const parts = reviewText.split(/=== SUGGESTIONS ===/i);
      const generalReview = parts[0] ? parts[0].trim() : '';
      const suggestionsText = parts[1] ? parts[1].trim() : '';

      const sugs: any[] = [];
      if (suggestionsText) {
        const rawBlocks = suggestionsText.split(/\[SUGGESTION\]/i);
        let blockCount = 0;
        
        rawBlocks.forEach((block) => {
          if (!block.trim()) return;
          
          let target = '';
          let label = '';
          let critique = '';
          let correction = '';

          const lines = block.split('\n');
          let currentField = '';
          
          lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('```')) return;

            const targetMatch = line.match(/^CIBLE:\s*(.+)$/i);
            const labelMatch = line.match(/^LABEL:\s*(.+)$/i);
            const critiqueMatch = line.match(/^CRITIQUE:\s*(.+)$/i);
            const correctionMatch = line.match(/^CORRECTION:\s*([\s\S]*)$/i);

            if (targetMatch) {
              target = targetMatch[1].trim();
              currentField = 'target';
            } else if (labelMatch) {
              label = labelMatch[1].trim();
              currentField = 'label';
            } else if (critiqueMatch) {
              critique = critiqueMatch[1].trim();
              currentField = 'critique';
            } else if (correctionMatch) {
              correction = correctionMatch[1].trim();
              currentField = 'correction';
            } else {
              if (currentField === 'correction') {
                correction += (correction ? '\n' : '') + line;
              } else if (currentField === 'critique') {
                critique += (critique ? ' ' : '') + trimmed;
              }
            }
          });

          const targetParts = target.split('.');
          const phase = targetParts[0] || '';
          const field = targetParts[1] || '';

          if (phase && field && correction.trim()) {
            blockCount++;
            sugs.push({
              id: `s_${blockCount}`,
              fieldLabel: label.trim() || target.trim(),
              phase: phase.trim(),
              field: field.trim(),
              critique: critique.trim() || t('bmad2.status.suggestedAdjustment'),
              proposedText: correction.trim()
            });
          }
        });
      }

      setReviewOutput(generalReview || reviewText);
      setSuggestions(sugs);
      setSelectedSuggestionIds(sugs.map(s => s.id));
      showToast(t('bmad2.success.reviewReady'), 'success');
    } catch (e: any) {
      showToast(t('bmad2.errors.reviewFailed', { error: e.message || e }), 'error');
    } finally {
      setIsReviewLoading(false);
    }
  };

  /** Apply AI checkable suggestions modifications */
  const applySelectedCorrections = () => {
    if (selectedSuggestionIds.length === 0) {
      showToast(t('bmad2.errors.noSuggestionSelected'), 'info');
      return;
    }

    setBmadData(prev => {
      let updated = { ...prev };
      let count = 0;

      suggestions.forEach(sug => {
        if (selectedSuggestionIds.includes(sug.id)) {
          let fieldName = (sug.field || '').trim();
          if (fieldName === 'objectives') fieldName = 'objective';
          if (fieldName === 'problems') fieldName = 'problem';
          if (fieldName === 'actor') fieldName = 'actors';
          if (fieldName === 'resource') fieldName = 'resources';
          if (fieldName === 'risk') fieldName = 'risks';
          if (fieldName === 'milestone') fieldName = 'milestones';
          if (fieldName === 'techstack') fieldName = 'techStack';

          const phaseKey = sug.phase as keyof typeof prev;
          if (updated[phaseKey]) {
            const section = { ...updated[phaseKey] } as any;
            if (fieldName in section) {
              section[fieldName] = sug.proposedText;
              updated[phaseKey] = section;
              count++;
            }
          }
        }
      });

      showToast(t('bmad2.success.correctionsApplied', { count }), 'success');
      return updated;
    });

    setSuggestions([]);
    setSelectedSuggestionIds([]);
    setCurrentStep(3);
  };

  const handleSaveDraft = async (
    silent = false,
    overrides?: {
      generatedSvg?: string;
      generatedHtml?: string;
      chatMessages?: Array<ChatMessage>;
    }
  ) => {
    if (!projectName.trim()) {
      showToast(t('bmad2.errors.nameRequiredToSave'), 'error');
      return false;
    }

    try {
      const bmadPath = `${vaultRoot}/.mnemo/bmad`.replace(/\\/g, '/');
      await sdk.invoke('dialog.mkdir', { dirPath: bmadPath });

      const fileFullPath = `${bmadPath}/${projectName.trim().replace(/[^a-zA-Z0-9-_]/g, '_')}.json`;

      const draftPayload = {
        name: projectName.trim(),
        description,
        category: projectCategory,
        version: projectVersion,
        hashtags,
        resonanceParent,
        updatedAt: new Date().toISOString(),
        bmad: {
          version: '0.900.0',
          userMode,
          telemetryMode: telemetry,
          proactiveMode,
          steps: {
            brief: bmadData.brief.notes || '',
            mapping: bmadData.mapping.notes || '',
            architecture: bmadData.architecture.notes || '',
            delivery: bmadData.delivery.notes || '',
          },
          stepData: bmadData,
          generatedSvg: overrides && overrides.generatedSvg !== undefined ? overrides.generatedSvg : (generatedSvg || ''),
          generatedHtml: overrides && overrides.generatedHtml !== undefined ? overrides.generatedHtml : (generatedHtml || ''),
          chatMessages: overrides && overrides.chatMessages !== undefined ? overrides.chatMessages : chatMessages
        }
      };

      const writeRes = await sdk.invoke('dialog.writeFile', {
        filePath: fileFullPath,
        content: JSON.stringify(draftPayload, null, 2)
      });

      if (writeRes.success) {
        if (!silent) {
          showToast(t('bmad2.success.projectSaved'), 'success');
        }
        scanVaultProjects(vaultRoot);
        return true;
      } else {
        throw new Error(writeRes.error);
      }
    } catch (err: any) {
      showToast(t('bmad2.errors.writeFailed', { error: err.message || err }), 'error');
      return false;
    }
  };

  /** Compile and write final Markdown documents */
  const handleGenerateProject = async () => {
    if (!projectName.trim()) return;

    setIsGenerating(true);
    setGenerationProgress({ current: 0, total: 4, message: t('bmad2.step4.creating') || 'Génération...' });

    try {
      const draftSaved = await handleSaveDraft(true);
      if (!draftSaved) throw new Error(t('bmad2.errors.saveConfigFailed') || 'Impossible de sauvegarder la configuration.');

      const targetDir = (customExportPath || `${vaultRoot}/BMAD/${projectName.trim().replace(/[^a-zA-Z0-9-_]/g, '_')}`).replace(/\\/g, '/');
      const mkdirRes = await sdk.invoke('dialog.mkdir', { dirPath: targetDir });
      if (!mkdirRes || mkdirRes.success === false) {
        throw new Error(mkdirRes?.error || t('bmad2.errors.mkdirFailed') || `Impossible de créer le dossier.`);
      }

      const timestamp = new Date().toLocaleDateString(i18n?.language || 'fr', { year: 'numeric', month: 'long', day: 'numeric' });
      const docs = compileMarkdownDocuments(projectName, projectVersion, bmadData, hashtags, timestamp, t);

      for (let i = 0; i < docs.length; i++) {
        const doc = docs[i]!;
        setGenerationProgress({
          current: i + 1,
          total: docs.length,
          message: t('bmad2.status.generatingDoc', { file: doc.filename })
        });

        const systemPrompt = t('ai.compilerSystemPrompt', { language: t('doc.aiLanguage') || 'français' });
        const prompt = t('ai.compilerPromptInput', { title: doc.title, rawContent: doc.content });

        const response = await sdk.inferModel({
          prompt,
          systemPrompt,
          model: assistantModel,
          disableRAG: true,
          maxTokens: 4000
        });

        let enrichedContent = '';
        if (typeof response === 'string') {
          enrichedContent = response;
        } else if (response) {
          enrichedContent = response.text || response.content || response.response || response.answer || '';
        }

        const filePath = `${targetDir}/${doc.filename}`;
        const writeRes = await sdk.invoke('dialog.writeFile', {
          filePath,
          content: enrichedContent || doc.content
        });

        if (!writeRes || writeRes.success === false) {
          throw new Error(writeRes?.error || `Failed to write ${doc.filename}`);
        }
      }

      showToast(t('bmad2.success.projectGenerated'), 'success');
      setCompletedPath(targetDir);
    } catch (e: any) {
      showToast(t('bmad2.errors.generationFailed', { error: e.message || e }), 'error');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(null);
    }
  };

  /** Locale-aware SVG diagram column headers/fallbacks — see svg-generator.ts. */
  const svgDiagramLabels = {
    actorsFallback: t('bmad2.diagramLabels.actorsFallback'),
    structureFallback: t('bmad2.diagramLabels.structureFallback'),
    techStackFallback: t('bmad2.diagramLabels.techStackFallback'),
    milestonesFallback: t('bmad2.diagramLabels.milestonesFallback'),
    colActors: t('bmad2.diagramLabels.colActors'),
    colStructure: t('bmad2.diagramLabels.colStructure'),
    colTechStack: t('bmad2.diagramLabels.colTechStack'),
    colMilestones: t('bmad2.diagramLabels.colMilestones'),
  };

  /** Deterministic SVG diagram rendering */
  const generateVisualDiagram = async () => {
    setIsGeneratingVisual('diagram');
    try {
      const svg = generateSvgFromData(projectName, bmadData, svgDiagramLabels);
      setGeneratedSvg(svg);
      showToast(t('bmad2.visuals.diagramGeneratedToast'), 'success');
      await handleSaveDraft(true, { generatedSvg: svg });
    } catch (e: any) {
      showToast(t('bmad2.visuals.diagramGenErrorToast') + (e.message || e), 'error');
    } finally {
      setIsGeneratingVisual(null);
    }
  };

  /** AI HTML slideshow presentations compiler */
  const generateVisualSlides = async () => {
    setIsGeneratingVisual('slides');
    try {
      const prompt = getHtmlSlidesPrompt(projectName, description, projectCategory, bmadData, t('doc.aiLanguage'));
      const res = await sdk.inferModel({
        prompt,
        systemPrompt: SLIDES_SYSTEM_PROMPT,
        model: reviewerModel || assistantModel,
        disableRAG: true,
        maxTokens: 4000,
        temperature: 0.2
      });

      let replyText = '';
      if (typeof res === 'string') {
        replyText = res;
      } else if (res) {
        replyText = res.text || res.content || res.response || res.answer || '';
      }

      const extracted = cleanCodeBlock(replyText, 'html');
      setGeneratedHtml(extracted);
      showToast(t('bmad2.visuals.slidesGeneratedToast'), 'success');
      await handleSaveDraft(true, { generatedHtml: extracted });
    } catch (e: any) {
      showToast(t('bmad2.visuals.slidesGenErrorToast') + (e.message || e), 'error');
    } finally {
      setIsGeneratingVisual(null);
    }
  };

  /** Save visual files directly to project folder */
  const saveVisualFile = async (type: 'diagram' | 'slides') => {
    try {
      const targetDir = customExportPath || `${vaultRoot}/BMAD/${projectName.trim().replace(/[^a-zA-Z0-9-_]/g, '_')}`;
      await sdk.invoke('dialog.mkdir', { path: targetDir });

      const filename = type === 'diagram' ? 'architecture.svg' : 'presentation.html';
      const content = type === 'diagram' ? generatedSvg : generatedHtml;

      const filePath = `${targetDir}/${filename}`;
      const writeRes = await sdk.invoke('dialog.writeFile', {
        filePath,
        content
      });

      if (!writeRes || writeRes.success === false) {
        throw new Error(writeRes?.error || t('bmad2.visuals.writeFailedError'));
      }
      showToast(t('bmad2.visuals.saveSuccessToast', { filename }), 'success');
      await handleSaveDraft(true);
    } catch (e: any) {
      showToast(t('bmad2.visuals.saveErrorToast') + (e.message || e), 'error');
    }
  };

  const handleOpenInExplorer = async () => {
    if (!completedPath) return;
    try {
      await sdk.invoke('dialog.openPath', { path: completedPath });
    } catch (e) {
      showToast("Impossible d'ouvrir le dossier : " + e, 'error');
    }
  };

  const isCloudAvailable = useMemo(() => {
    if (!systemModelConfig) return false;
    const mode = systemModelConfig.mode;
    if (mode === 'local') return false;
    const cloud = systemModelConfig.cloud;
    if (!cloud) return false;
    if (cloud.provider === 'vertex') {
      return !!cloud.serviceAccountJsonPath || true;
    }
    return !!cloud.apiKey;
  }, [systemModelConfig]);

  return (
    <div 
      className={`app-container ${theme}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden'
      }}
    >
      <div 
        className="main-layout" 
        style={{ gridTemplateColumns: `${chatWidth}px 4px 1fr` }}
      >
        
        {/* Left Chat Sidebar Component */}
        <ChatSidebar
          chatWidth={chatWidth}
          toggleChatWidth={toggleChatWidth}
          chatMessages={chatMessages}
          isSendingChat={isSendingChat}
          useVaultMemory={useVaultMemory}
          setUseVaultMemory={setUseVaultMemory}
          availableModels={availableModels}
          assistantModel={assistantModel}
          setAssistantModel={setAssistantModel}
          setReviewerModel={setReviewerModel}
          selectedSoul={selectedSoul}
          setSelectedSoul={setSelectedSoul}
          bmadProjects={bmadProjects}
          resonanceCheckboxes={resonanceCheckboxes}
          setResonanceCheckboxes={setResonanceCheckboxes}
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleSendChatMessage={handleSendChatMessage}
          chatEndRef={chatEndRef}
          startResizing={startResizing}
          isResizing={isResizing}
        />

        {/* Right workspace canvas */}
        <main className="main-content">
          <div className="grid-overlay" />

          {/* Stepper Header */}
          <header className="wizard-header" style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 className="wizard-title" style={{ margin: 0 }}>BMAD 2.0</h1>
                <span style={{
                  fontSize: '9.5px',
                  fontWeight: 600,
                  background: 'rgba(37, 99, 235, 0.15)',
                  color: '#60a5fa',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  lineHeight: 1
                }}>
                  v0.900
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                {t('bmad2.headerSubtitle')}
              </p>
            </div>

            {currentStep > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {[1, 2, 3, 4].map(s => {
                  const isActive = currentStep === s;
                  const isPassed = currentStep > s;
                  return (
                    <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                      <button
                        onClick={() => setCurrentStep(s)}
                        className="tech-button"
                        style={{
                          width: '28px',
                          height: '28px',
                          padding: 0,
                          justifyContent: 'center',
                          borderRadius: '50%',
                          border: isActive ? '1px solid var(--accent)' : '1px solid var(--border-glass)',
                          background: isActive ? 'var(--accent)' : isPassed ? 'rgba(37,99,235,0.1)' : 'transparent',
                          color: isActive || isPassed ? '#fff' : 'var(--text-muted)',
                          boxShadow: isActive ? '0 0 10px var(--accent-glow)' : 'none'
                        }}
                      >
                        {s}
                      </button>
                      {s < 4 && (
                        <div style={{
                          width: '30px',
                          height: '1px',
                          background: isPassed ? 'var(--accent)' : 'var(--border-glass)',
                          marginLeft: '10px'
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </header>

          {/* Main Wizard Canvas Body */}
          <div style={{ flex: 1, position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            
            {/* Step 0: Landing */}
            {currentStep === 0 && (
              <LandingStep
                bmadProjects={bmadProjects}
                showBmadInfo={showBmadInfo}
                setShowBmadInfo={setShowBmadInfo}
                handleLoadProject={handleLoadProject}
                handleDeleteProject={handleDeleteProject}
                loadingProjects={loadingProjects}
                onNewProject={handleCreateNewProject}
              />
            )}

            {/* Step 1: Foundations */}
            {currentStep === 1 && (
              <FoundationsStep
                projectName={projectName}
                setProjectName={setProjectName}
                projectVersion={projectVersion}
                setProjectVersion={setProjectVersion}
                description={description}
                setDescription={setDescription}
                projectCategory={projectCategory}
                setProjectCategory={setProjectCategory}
                hashtags={hashtags}
                setHashtags={setHashtags}
                setCurrentStep={setCurrentStep}
              />
            )}

            {/* Step 2: AI Settings */}
            {currentStep === 2 && (
              <SettingsStep
                userMode={userMode}
                setUserMode={setUserMode}
                telemetry={telemetry}
                setTelemetry={setTelemetry}
                proactiveMode={proactiveMode}
                setProactiveMode={setProactiveMode}
                setCurrentStep={setCurrentStep}
              />
            )}

            {/* Step 3: Flow Wizard */}
            {currentStep === 3 && (
              <FlowWizardStep
                activeBmadTab={activeBmadTab}
                setActiveBmadTab={setActiveBmadTab}
                bmadData={bmadData}
                setBmadData={setBmadData}
                assistingFields={assistingFields}
                handleFieldAiAssist={handleFieldAiAssist}
                getGuidedPlaceholder={getGuidedPlaceholder}
                handleSaveDraft={() => handleSaveDraft()}
                setCurrentStep={setCurrentStep}
              />
            )}

            {/* Step 4: Critique & Export */}
            {currentStep === 4 && (
              <ValidationStep
                projectName={projectName}
                vaultRoot={vaultRoot}
                customExportPath={customExportPath}
                setCustomExportPath={setCustomExportPath}
                completedPath={completedPath}
                setCompletedPath={setCompletedPath}
                isGenerating={isGenerating}
                generationProgress={generationProgress}
                isReviewLoading={isReviewLoading}
                reviewOutput={reviewOutput}
                suggestions={suggestions}
                selectedSuggestionIds={selectedSuggestionIds}
                setSelectedSuggestionIds={setSelectedSuggestionIds}
                isCloudAvailable={isCloudAvailable}
                isGeneratingVisual={isGeneratingVisual}
                generatedSvg={generatedSvg}
                setGeneratedSvg={setGeneratedSvg}
                generatedHtml={generatedHtml}
                setGeneratedHtml={setGeneratedHtml}
                setActiveModal={setActiveModal}
                runAiReview={runAiReview}
                applySelectedCorrections={applySelectedCorrections}
                handleGenerateProject={handleGenerateProject}
                generateVisualDiagram={generateVisualDiagram}
                generateVisualSlides={generateVisualSlides}
                saveVisualFile={saveVisualFile}
                handleOpenInExplorer={handleOpenInExplorer}
                scanVaultProjects={scanVaultProjects}
                setCurrentStep={setCurrentStep}
                showToast={showToast}
                selectFolder={() => sdk.selectFolder()}
                bmadData={bmadData}
              />
            )}

          </div>
        </main>
      </div>

      {/* Fullscreen Overlay Modal component */}
      <ModalPreview
        activeModal={activeModal}
        generatedSvg={generatedSvg}
        generatedHtml={generatedHtml}
        onClose={() => setActiveModal(null)}
      />

      {/* Toast notifications rendering */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          padding: '12px 20px',
          borderRadius: '12px',
          border: toast.type === 'error' ? (theme === 'light' ? '1px solid #fca5a5' : '1px solid rgba(239,68,68,0.2)') : toast.type === 'success' ? (theme === 'light' ? '1px solid #6ee7b7' : '1px solid rgba(16,185,129,0.2)') : '1px solid var(--border-glass)',
          background: toast.type === 'error' ? (theme === 'light' ? '#fee2e2' : 'rgba(239,68,68,0.1)') : toast.type === 'success' ? (theme === 'light' ? '#d1fae5' : 'rgba(16,185,129,0.1)') : 'var(--popover-bg)',
          backdropFilter: 'blur(12px)',
          color: toast.type === 'error' ? (theme === 'light' ? '#b91c1c' : '#fca5a5') : toast.type === 'success' ? (theme === 'light' ? '#047857' : '#a7f3d0') : 'var(--text-primary)',
          zIndex: 100,
          fontSize: '13.5px',
          boxShadow: theme === 'light' ? '0 8px 32px rgba(15,23,42,0.08)' : '0 8px 32px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideIn 0.3s ease'
        }}>
          <span>{toast.type === 'error' ? '⚠️' : toast.type === 'success' ? '✅' : 'ℹ️'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
