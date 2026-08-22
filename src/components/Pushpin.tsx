export function Pushpin({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="9" r="6" fill="#b0413a" />
      <circle cx="10" cy="7" r="1.6" fill="#e8837c" opacity="0.7" />
      <path d="M12 15 L12 21" stroke="#7a2e29" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
