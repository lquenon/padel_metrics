interface TouchCounterProps {
  player: 'left' | 'right';
  playerName: string;
  touches: number;
  onTouch: () => void;
}

export default function TouchCounter({
  player,
  playerName,
  touches,
  onTouch,
}: TouchCounterProps) {
  const isPrimary = player === 'left';

  const colorClasses = isPrimary
    ? 'from-[#2a1d35] to-[#151118] border-primary/30 shadow-neon-primary'
    : 'from-[#1a252e] to-[#151118] border-secondary-neon/30 shadow-neon-secondary';

  const glowColor = isPrimary ? 'bg-primary/5' : 'bg-secondary-neon/5';
  const glowActiveColor = isPrimary ? 'bg-primary/10' : 'bg-secondary-neon/10';

  const iconColor = isPrimary ? 'text-primary/70' : 'text-secondary-neon/70';
  const dotColor = isPrimary
    ? 'bg-primary shadow-[0_0_8px_#a640f5]'
    : 'bg-secondary-neon shadow-[0_0_8px_#00f0ff]';

  const textColor = isPrimary ? 'text-primary' : 'text-secondary-neon';

  return (
    <button
      onClick={onTouch}
      className={`group relative flex flex-col items-center justify-between rounded-2xl bg-gradient-to-br border p-4 transition-all active:scale-[0.98] h-full min-h-[300px] ${colorClasses}`}
    >
      {/* Decorative Glow */}
      <div
        className={`absolute inset-0 rounded-2xl transition-colors ${glowColor} group-active:${glowActiveColor}`}
      ></div>

      {/* Header */}
      <div className="z-10 w-full flex justify-between items-start">
        <span className={`material-symbols-outlined ${iconColor}`}>
          sports_tennis
        </span>
        <div className={`h-2 w-2 rounded-full ${dotColor}`}></div>
      </div>

      {/* Counter */}
      <div className="z-10 flex flex-col items-center">
        <span className="text-7xl font-bold text-white tracking-tighter">
          {touches.toString().padStart(2, '0')}
        </span>
        <span className={`text-sm font-bold uppercase tracking-widest mt-2 ${textColor}`}>
          Touches
        </span>
      </div>

      {/* Footer */}
      <div className="z-10 w-full text-center border-t border-white/10 pt-3 mt-2">
        <h3 className="text-white text-base font-bold truncate">{playerName}</h3>
      </div>
    </button>
  );
}
