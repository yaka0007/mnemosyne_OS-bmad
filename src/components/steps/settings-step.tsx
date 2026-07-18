import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n';

/**
 * Props expected by the SettingsStep component.
 */
export interface SettingsStepProps {
  /** The selected assistant user mode level. */
  userMode: 'novice' | 'pro' | 'expert';
  /** Callback to update the user mode level. */
  setUserMode: (mode: 'novice' | 'pro' | 'expert') => void;
  /** Telemetry collection level setting. */
  telemetry: 'local_only' | 'opt_in_remote' | 'full_remote';
  /** Callback to update the telemetry level. */
  setTelemetry: (val: 'local_only' | 'opt_in_remote' | 'full_remote') => void;
  /** The active AI proactive level. */
  proactiveMode: 'manual_only' | 'soft_proactive' | 'strong_proactive';
  /** Callback to update the active AI proactive level. */
  setProactiveMode: (val: 'manual_only' | 'soft_proactive' | 'strong_proactive') => void;
  /** Callback to navigate between steps. */
  setCurrentStep: (step: number) => void;
}

/**
 * Step 2: Configuration panel for setting assistant profile,
 * telemetry options, and proactive suggestions level.
 */
export const SettingsStep: React.FC<SettingsStepProps> = ({
  userMode,
  setUserMode,
  telemetry,
  setTelemetry,
  proactiveMode,
  setProactiveMode,
  setCurrentStep
}) => {
  const { t } = useTranslation();

  return (
    <div className="glass-card" style={{ maxWidth: '580px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0' }}>{t('bmad2.step2.title')}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', margin: '0 0 20px 0' }}>
        {t('bmad2.step2.subtitle')}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            {t('bmad2.step2.userMode')}
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['novice', 'pro', 'expert'].map(mode => (
              <button
                key={mode}
                onClick={() => setUserMode(mode as any)}
                className={`tech-button ${userMode === mode ? 'primary' : ''}`}
                style={{ flex: 1, textTransform: 'capitalize', borderRadius: '8px' }}
              >
                {t('bmad2.step2.mode' + mode.charAt(0).toUpperCase() + mode.slice(1))}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            {t('bmad2.step2.telemetry')}
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'local_only', name: t('options.telemetry.local_only') },
              { id: 'opt_in_remote', name: t('options.telemetry.opt_in_remote') },
              { id: 'full_remote', name: t('options.telemetry.full_remote') }
            ].map(tMode => (
              <button
                key={tMode.id}
                onClick={() => setTelemetry(tMode.id as any)}
                className={`tech-button ${telemetry === tMode.id ? 'primary' : ''}`}
                style={{ flex: 1, borderRadius: '8px', fontSize: '11px' }}
              >
                {tMode.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            {t('bmad2.step2.proactiveMode')}
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'manual_only', name: t('options.proactive.manual_only') },
              { id: 'soft_proactive', name: t('options.proactive.soft_proactive') },
              { id: 'strong_proactive', name: t('options.proactive.strong_proactive') }
            ].map(pMode => (
              <button
                key={pMode.id}
                onClick={() => setProactiveMode(pMode.id as any)}
                className={`tech-button ${proactiveMode === pMode.id ? 'primary' : ''}`}
                style={{ flex: 1, borderRadius: '8px', fontSize: '11px' }}
              >
                {pMode.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
          <button onClick={() => setCurrentStep(1)} className="tech-button">{t('bmad2.actions.back')}</button>
          <button onClick={() => setCurrentStep(3)} className="tech-button primary">
            {t('bmad2.actions.continue')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsStep;
