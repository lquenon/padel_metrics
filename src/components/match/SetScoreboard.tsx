interface Set {
  setNumber: number;
  us: number;
  them: number;
  completed: boolean;
}

interface SetScoreboardProps {
  sets: Set[];
  currentSetNumber: number;
}

export default function SetScoreboard({ sets, currentSetNumber }: SetScoreboardProps) {
  return (
    <div className="flex items-center justify-center gap-4 text-xs font-mono">
      {sets.map((set) => (
        <div
          key={set.setNumber}
          className={`flex flex-col items-center ${
            set.setNumber === currentSetNumber ? 'opacity-100' : 'opacity-50'
          }`}
        >
          <span className="text-gray-500 text-[10px]">SET {set.setNumber}</span>
          <span
            className={`font-bold ${
              set.setNumber === currentSetNumber ? 'text-primary' : 'text-white'
            }`}
          >
            {set.us}-{set.them}
          </span>
        </div>
      ))}
    </div>
  );
}
