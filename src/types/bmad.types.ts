/**
 * Represents a single message in the chat history.
 */
export interface ChatMessage {
  /** The sender's role: either the user or the assistant. */
  role: 'user' | 'assistant';
  /** The text content of the message. */
  content: string;
}

/**
 * RAG and inference options for a cognitive persona (Soul).
 */
export interface SoulPreset {
  /** Unique identifier for the persona. */
  id: string;
  /** Human-readable display name. */
  name: string;
  /** The system instructions defining the behavior of the persona. */
  prompt: string;
}

/**
 * RAG and model metadata from host configuration.
 */
export interface SystemModelConfig {
  /** System mode configuration ('local' or 'remote'). */
  mode: 'local' | 'cloud';
  /** Optional cloud provider settings. */
  cloud?: {
    /** The cloud provider type (e.g. 'vertex' or 'openai'). */
    provider?: string;
    /** The API key to connect to the cloud provider. */
    apiKey?: string;
    /** Path to Vertex service account JSON file, if applicable. */
    serviceAccountJsonPath?: string;
  };
  /** Default system model ID. */
  model?: string;
  /** Provider string. */
  provider?: string;
}

/**
 * Fields corresponding to a single step/tab in the BMAD framework.
 */
export interface BmadStepData {
  /** Primary objective or key focus. */
  objective?: string;
  /** Problem to solve or input. */
  problem?: string;
  /** Scope bounds or system boundaries. */
  scope?: string;
  /** Primary actors or systems. */
  actors?: string;
  /** Available resources or entities. */
  resources?: string;
  /** Potential risks or mitigation vectors. */
  risks?: string;
  /** System design structure. */
  structure?: string;
  /** Technical stack or choices. */
  techStack?: string;
  /** Architectural trade-offs. */
  tradeoffs?: string;
  /** Key delivery milestones. */
  milestones?: string;
  /** Validation criteria or methods. */
  validation?: string;
  /** Key performance indicators. */
  kpis?: string;
  /** Custom freeform notes for the step. */
  notes: string;
}

/**
 * Complete set of wizard data mapping all 4 stages of the BMAD framework.
 */
export interface BmadData {
  /** Business Briefing stage. */
  brief: BmadStepData;
  /** System Mapping stage. */
  mapping: BmadStepData;
  /** Technical Architecture stage. */
  architecture: BmadStepData;
  /** Delivery & Success Metrics stage. */
  delivery: BmadStepData;
}
