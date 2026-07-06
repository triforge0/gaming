import './LauncherBackButton.css';

export function LauncherBackButton() {
  const handleBack = () => {
    window.location.href = '/';
  };

  return (
    <button className="launcher-back-btn" onClick={handleBack} aria-label="Back to Launcher">
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
  );
}
