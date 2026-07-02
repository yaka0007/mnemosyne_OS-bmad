import React from 'react';

/**
 * Props for the BrainLoader component.
 */
export interface BrainLoaderProps {
  /** Width and height dimensions in pixels. */
  size?: number;
  /** Optional custom CSS classes. */
  className?: string;
  /** Primary nodes and paths fill/stroke color. */
  color?: string;
}

/**
 * Animated SVG component representing a neural network/brain synapse loader.
 * Renders glowing pulsing paths and synapse nodes.
 */
export const BrainLoader: React.FC<BrainLoaderProps> = ({ size = 24, className, color }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      className={`neural-brain-loader ${className || ''}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', overflow: 'visible' }}
    >
      <style>{`
        @keyframes pulseNode {
          0%, 100% { transform: scale(1); opacity: 0.35; filter: drop-shadow(0 0 0px var(--accent)); }
          50% { transform: scale(1.4); opacity: 1; filter: drop-shadow(0 0 3px var(--accent)); }
        }
        @keyframes pulsePath {
          0% { stroke-dashoffset: 24; opacity: 0.15; }
          50% { opacity: 0.6; }
          100% { stroke-dashoffset: 0; opacity: 0.15; }
        }
        .brain-node {
          animation: pulseNode 1.8s infinite ease-in-out;
          transform-origin: center;
          fill: ${color || 'var(--accent, #3b82f6)'};
        }
        .brain-path {
          stroke: ${color || 'var(--accent, #3b82f6)'};
          stroke-width: 1.2px;
          stroke-linecap: round;
          stroke-dasharray: 4 12;
          animation: pulsePath 1.8s infinite linear;
          opacity: 0.25;
        }
      `}</style>
      
      {/* Left hemisphere paths */}
      <path className="brain-path" d="M 24,10 C 17,9 12,13 12,20 C 12,27 17,31 24,38" fill="none" style={{ animationDelay: '0s' }} />
      <path className="brain-path" d="M 24,16 C 19,17 16,21 16,25 C 16,29 19,31 24,33" fill="none" style={{ animationDelay: '0.3s' }} />
      {/* Right hemisphere paths */}
      <path className="brain-path" d="M 24,10 C 31,9 36,13 36,20 C 36,27 31,31 24,38" fill="none" style={{ animationDelay: '0.15s' }} />
      <path className="brain-path" d="M 24,16 C 29,17 32,21 32,25 C 32,29 29,31 24,33" fill="none" style={{ animationDelay: '0.45s' }} />
      {/* Central axis paths */}
      <line className="brain-path" x1="24" y1="10" x2="24" y2="38" style={{ animationDelay: '0.6s' }} />

      {/* Synapse Nodes */}
      {/* Center Top */}
      <circle className="brain-node" cx="24" cy="10" r="2.2" style={{ animationDelay: '0s' }} />
      {/* Center Bottom */}
      <circle className="brain-node" cx="24" cy="38" r="2.2" style={{ animationDelay: '1.0s' }} />
      
      {/* Left Hemisphere Nodes */}
      <circle className="brain-node" cx="12" cy="20" r="2.2" style={{ animationDelay: '0.25s' }} />
      <circle className="brain-node" cx="16" cy="13" r="1.8"   style={{ animationDelay: '0.5s' }} />
      <circle className="brain-node" cx="16" cy="27" r="2.2" style={{ animationDelay: '0.75s' }} />
      <circle className="brain-node" cx="19" cy="33" r="1.8"   style={{ animationDelay: '1.25s' }} />

      {/* Right Hemisphere Nodes */}
      <circle className="brain-node" cx="36" cy="20" r="2.2" style={{ animationDelay: '0.4s' }} />
      <circle className="brain-node" cx="32" cy="13" r="1.8"   style={{ animationDelay: '0.65s' }} />
      <circle className="brain-node" cx="32" cy="27" r="2.2" style={{ animationDelay: '0.9s' }} />
      <circle className="brain-node" cx="29" cy="33" r="1.8"   style={{ animationDelay: '1.4s' }} />
      
      {/* Inner cortex node */}
      <circle className="brain-node" cx="24" cy="22" r="2.8"   style={{ animationDelay: '0.8s', fill: 'var(--accent-purple, #8b5cf6)' }} />
    </svg>
  );
};
export default BrainLoader;
