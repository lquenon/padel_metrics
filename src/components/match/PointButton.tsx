interface PointButtonProps {
  label: string;
  team: 'us' | 'them';
  onScore: () => void;
  disabled?: boolean;
}

export default function PointButton({ label, team, onScore, disabled }: PointButtonProps) {
  const isPrimary = team === 'us';

  const activeColor = isPrimary ? 'active:bg-primary' : 'active:bg-secondary-neon';

  return (
    <button
      onClick={onScore}
      disabled={disabled}
      className={`relative overflow-hidden h-14 rounded-xl bg-surface-dark hover:bg-[#362b42] border border-white/5 transition-all group disabled:opacity-50 disabled:cursor-not-allowed ${activeColor}`}
    >
      <div className="absolute inset-0 flex items-center justify-center gap-2">
        <span className="text-white font-bold tracking-wider">{label}</span>
        <span className="material-symbols-outlined text-white/50 group-active:text-white text-sm">
          add
        </span>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
    </button>
  );
}
