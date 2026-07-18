import { useState, useEffect } from 'react';
import frBmad from './locales/fr/bmad.json';
import enBmad from './locales/en/bmad.json';
import esBmad from './locales/es/bmad.json';

const SUPPORTED_LANGS = ['en', 'fr', 'es'] as const;

/** Clamp any BCP-47-ish input ('fr-FR', 'es', 'de'…) onto a supported pack. */
const normalizeLang = (lang: string | null | undefined): string => {
  const short = (lang || '').slice(0, 2).toLowerCase();
  return (SUPPORTED_LANGS as readonly string[]).includes(short) ? short : 'en';
};

// Detect host language via URL query parameter or fallback to system locale
const getInitialLang = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return normalizeLang(urlParams.get('lang') || navigator.language);
};

let currentLang = getInitialLang();
const listeners = new Set<(lang: string) => void>();

export function setLanguage(newLang: string) {
  const next = normalizeLang(newLang);
  if (next === currentLang) return;
  currentLang = next;
  listeners.forEach(l => l(next));
}

export function useTranslation() {
  const [lang, setLangState] = useState(currentLang);

  useEffect(() => {
    const handleUpdate = (l: string) => setLangState(l);
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const bmadPack: any = lang === 'fr' ? frBmad : lang === 'es' ? esBmad : enBmad;

  const t = (key: string, options?: any): any => {
    const resolve = (pathArr: string[]): any => {
      let current: any = bmadPack;
      for (const part of pathArr) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          return undefined;
        }
      }
      return current;
    };

    const candidates: string[][] = [];
    
    // 1. Exact path
    candidates.push(key.split('.'));

    // 2. Stripped path
    let stripped = key;
    let wasStripped = false;
    if (stripped.startsWith('bmad.')) {
      stripped = stripped.slice(5);
      wasStripped = true;
    } else if (stripped.startsWith('bmad2.')) {
      stripped = stripped.slice(6);
      wasStripped = true;
    }
    
    const strippedParts = stripped.split('.');
    if (wasStripped) {
      candidates.push(strippedParts);
    }

    // 3. Namespace prefixes
    if (strippedParts[0] !== 'bmad' && strippedParts[0] !== 'bmad2') {
      candidates.push(['bmad2', ...strippedParts]);
      candidates.push(['bmad', ...strippedParts]);
    }

    let found: any = undefined;
    for (const cand of candidates) {
      const val = resolve(cand);
      if (val !== undefined && val !== null) {
        found = val;
        break;
      }
    }

    if (typeof found === 'string') {
      let text = found;
      if (options) {
        for (const [k, v] of Object.entries(options)) {
          text = text.replace(new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, 'g'), String(v));
        }
      }
      return text;
    }

    if (found && typeof found === 'object') {
      return found; // Return nested object (like categories or suggestions)
    }

    return options?.defaultValue !== undefined ? options.defaultValue : key;
  };

  return { t, i18n: { language: lang } };
}
