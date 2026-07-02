import {
  Code,
  Link as LinkIcon,
  Briefcase,
  Store as StoreIcon,
  Palette,
  Plane,
  Lightbulb
} from 'lucide-react';
import { SoulPreset, BmadData } from '../types/bmad.types';

/**
 * Icons mapping for project categories using Lucide components.
 */
export const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  software: Code,
  blockchain: LinkIcon,
  business: Briefcase,
  store: StoreIcon,
  creative: Palette,
  event: Plane,
  other: Lightbulb,
};

/**
 * Preset persona definitions (Souls) configured for the assistant chat.
 */
export const SOUL_PRESETS: SoulPreset[] = [
  { 
    id: 'default', 
    name: 'Mnemosyne AI Default', 
    prompt: 'You are Mnemosyne, a helpful cognitive OS assistant. Help the user clarify and structure their thoughts.' 
  },
  { 
    id: 'architect', 
    name: 'Software Architect', 
    prompt: 'You are a senior software architect. Help the user design clean, modular, and scalable software systems, analyzing trade-offs and tech stacks.' 
  },
  { 
    id: 'researcher', 
    name: 'Math Researcher', 
    prompt: 'You are a rigorous mathematical and logical researcher. Guide the user to define clear formulas, formal definitions, and systemic logic.' 
  },
  { 
    id: 'analyst', 
    name: 'Business Strategist', 
    prompt: 'You are a venture strategist and business analyst. Help the user optimize product-market fit, value proposition, and KPIs.' 
  }
];

/**
 * Initial empty structure representing default project configurations.
 */
export const DEFAULT_BMAD_DATA: BmadData = {
  brief: { objective: '', problem: '', scope: '', notes: '' },
  mapping: { actors: '', resources: '', risks: '', notes: '' },
  architecture: { structure: '', techStack: '', tradeoffs: '', notes: '' },
  delivery: { milestones: '', validation: '', kpis: '', notes: '' }
};
