import { useEffect, useRef } from 'react';
import type { CatalogEntry } from '../catalog/types';
import './IframePlayer.css';

interface IframePlayerProps {
  entry: CatalogEntry;
  onClose: () => void;
}

export function IframePlayer({ entry, onClose }: IframePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Focus the iframe when it loads to capture keyboard events immediately
    const iframe = iframeRef.current;
    if (iframe) {
      const handleLoad = () => {
        iframe.focus();
      };
      iframe.addEventListener('load', handleLoad);
      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <div className="iframe-player">
      <button className="floating-back-btn" onClick={onClose} aria-label="Quay lại Launcher">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6"/>
        </svg>
        <span>Launcher</span>
      </button>
      <div className="iframe-container">
        <iframe
          ref={iframeRef}
          src={entry.externalUrl || entry.path}
          title={entry.title}
          allow="fullscreen; autoplay; gamepad; display-capture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
